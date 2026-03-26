from flask import Blueprint, request, jsonify, current_app
from services.claude_analyzer import analyze_code_with_claude
from services.bandit_scanner import scan_python_code
from services.result_parser import parse_and_combine_results
from utils.validators import validate_code_input
from models import db
from models.scan import Scan
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from extensions import limiter

scan_bp = Blueprint('scan', __name__)

ALLOWED_LANGUAGES = ['javascript', 'typescript', 'python', 'php', 'java', 'ruby', 'go', 'cpp', 'csharp']
MAX_CODE_LENGTH = 50000  # 50KB max

def validate_scan_input(code, language):
    errors = []
    
    if not code or not code.strip():
        errors.append('Code cannot be empty')
    
    if len(code) > MAX_CODE_LENGTH:
        errors.append(f'Code exceeds maximum length of {MAX_CODE_LENGTH} characters')
    
    if not language:
        errors.append('Language is required')
    
    if language and language.lower() not in ALLOWED_LANGUAGES:
        errors.append(f'Unsupported language. Allowed: {", ".join(ALLOWED_LANGUAGES)}')
    
    return errors

@scan_bp.route('/scan', methods=['POST'])
@limiter.limit("30 per hour")
def scan_code():
    """
    Main endpoint for code scanning.
    Accepts: { code: string, language: string }
    Returns: { vulnerabilities: [], securityScore: int, ... }
    """
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        code = data.get('code', '')
        language = data.get('language', 'javascript').lower()
        
        # Validate input
        errors = validate_scan_input(code, language)
        if errors:
            return jsonify({'error': errors[0]}), 400
        
        # Run Claude AI analysis
        current_app.logger.debug(f"Analyzing {language} code with Claude AI...")
        claude_results = analyze_code_with_claude(code, language)
        
        # Run Bandit (Python only)
        bandit_results = None
        if language == 'python':
            current_app.logger.debug("Running Bandit static analysis...")
            bandit_results = scan_python_code(code)
        
        # Combine results
        final_results = parse_and_combine_results(claude_results, bandit_results)
        
        current_app.logger.debug(f"Scan complete: {final_results['totalIssues']} issues found")
        
        # Get user_id if logged in (optional — guests get None)
        user_id = None
        try:
            verify_jwt_in_request(optional=True)
            identity = get_jwt_identity()
            if identity:
                user_id = int(identity)
        except Exception:
            user_id = None

        # Save scan to database
        try:
            new_scan = Scan(
                user_id=user_id,
                language=language,
                code_snippet=code[:500],  # store first 500 chars only
                results=final_results,
                security_score=final_results.get('securityScore', 100),
                vulnerability_count=len(final_results.get('vulnerabilities', []))
            )
            db.session.add(new_scan)
            db.session.commit()
        except Exception as e:
            # Never let database errors break the scan response
            db.session.rollback()
            current_app.logger.warning("Could not save scan to database: %s", e)
        
        return jsonify(final_results), 200
        
    except Exception as e:
        current_app.logger.exception("Internal error during scan")
        return jsonify({
            'error': 'An unexpected error occurred'
        }), 500

@scan_bp.route('/scan/history', methods=['GET'])
@scan_bp.route('/history', methods=['GET'])
def get_scan_history():
    try:
        verify_jwt_in_request()
        user_id = int(get_jwt_identity())
    except Exception:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        scans = Scan.query.filter_by(user_id=user_id)\
            .order_by(Scan.created_at.desc())\
            .limit(20)\
            .all()

        return jsonify({
            'history': [s.to_dict() for s in scans],
            'total': len(scans)
        }), 200

    except Exception as e:
        current_app.logger.exception("Internal error retrieving scan history")
        return jsonify({'error': 'An unexpected error occurred'}), 500

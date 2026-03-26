import tempfile
import os
import logging
from bandit.core import manager as bandit_manager
from bandit.core import config as bandit_config

logger = logging.getLogger(__name__)

def scan_python_code(code: str) -> list:
    """
    Scan Python code using Bandit static analysis tool.
    Returns list of vulnerabilities in standardized format.
    """
    
    vulnerabilities = []
    
    try:
        # Create temporary file with code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
            tmp.write(code)
            tmp_path = tmp.name
        
        # Configure Bandit
        b_conf = bandit_config.BanditConfig()
        b_mgr = bandit_manager.BanditManager(b_conf, 'file')
        
        # Run Bandit scan
        b_mgr.discover_files([tmp_path])
        b_mgr.run_tests()
        
        # Get results
        issues = b_mgr.get_issue_list()
        
        # Convert to standard format
        for idx, issue in enumerate(issues):
            vuln = {
                'id': f'bandit_{idx + 1}',
                'severity': map_bandit_severity(issue.severity),
                'title': issue.test_id,
                'category': 'Static Analysis',
                'owaspCategory': map_to_owasp(issue.test_id),
                'line': issue.lineno,
                'column': issue.col_offset or 0,
                'description': issue.text,
                'codeSnippet': get_code_snippet(code, issue.lineno),
                'fix': get_bandit_fix(issue.test_id),
                'confidence': issue.confidence,
                'source': 'bandit'
            }
            vulnerabilities.append(vuln)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        return vulnerabilities
        
    except Exception as e:
        logger.exception("Bandit scan error")
        return []

def map_bandit_severity(severity: str) -> str:
    """Map Bandit severity to our standard levels."""
    mapping = {
        'HIGH': 'CRITICAL',
        'MEDIUM': 'HIGH',
        'LOW': 'MEDIUM'
    }
    return mapping.get(severity.upper(), 'LOW')

def map_to_owasp(test_id: str) -> str:
    """Map Bandit test IDs to OWASP categories."""
    owasp_mapping = {
        'B201': 'A02:2021 - Cryptographic Failures',
        'B301': 'A08:2021 - Software and Data Integrity Failures',
        'B303': 'A02:2021 - Cryptographic Failures',
        'B304': 'A02:2021 - Cryptographic Failures',
        'B305': 'A02:2021 - Cryptographic Failures',
        'B306': 'A02:2021 - Cryptographic Failures',
        'B307': 'A02:2021 - Cryptographic Failures',
        'B308': 'A05:2021 - Security Misconfiguration',
        'B309': 'A02:2021 - Cryptographic Failures',
        'B310': 'A03:2021 - Injection',
        'B320': 'A02:2021 - Cryptographic Failures',
        'B601': 'A03:2021 - Injection',
        'B602': 'A03:2021 - Injection',
        'B608': 'A03:2021 - Injection',
    }
    return owasp_mapping.get(test_id, 'A04:2021 - Insecure Design')

def get_code_snippet(code: str, line_number: int) -> str:
    """Extract code snippet at given line."""
    lines = code.split('\n')
    if 0 < line_number <= len(lines):
        return lines[line_number - 1].strip()
    return ''

def get_bandit_fix(test_id: str) -> str:
    """Provide fix suggestions for common Bandit issues."""
    fixes = {
        'B201': 'Use secrets module instead: import secrets; token = secrets.token_urlsafe()',
        'B301': 'Avoid using pickle with untrusted data. Use JSON instead.',
        'B303': 'Use hashlib.sha256() instead of insecure MD5',
        'B304': 'Use hashlib.sha256() instead of insecure SHA1',
        'B601': 'Use parameterized queries to prevent SQL injection',
        'B602': 'Use subprocess with shell=False and validate inputs',
    }
    return fixes.get(test_id, 'Review Bandit documentation for this issue')

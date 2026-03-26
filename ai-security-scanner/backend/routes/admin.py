from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    """Mock admin stats."""
    
    stats = {
        'totalScans': 47,
        'totalUsers': 12,
        'criticalIssues': 23,
        'averageScore': 62,
        'recentScans': [
            {
                'id': 1,
                'language': 'javascript',
                'score': 45,
                'issues': 8,
                'timestamp': '2025-03-20T10:30:00Z'
            }
        ]
    }
    
    return jsonify(stats), 200

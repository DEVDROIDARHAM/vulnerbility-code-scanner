from typing import List, Dict

def calculate_security_score(vulnerabilities: List[Dict]) -> int:
    """
    Calculate security score (0-100) based on vulnerabilities.
    Start at 100, deduct points based on severity.
    """
    
    if not vulnerabilities:
        return 100
    
    score = 100
    
    for vuln in vulnerabilities:
        severity = vuln.get('severity', 'LOW').upper()
        
        if severity == 'CRITICAL':
            score -= 25
        elif severity == 'HIGH':
            score -= 15
        elif severity == 'MEDIUM':
            score -= 10
        elif severity == 'LOW':
            score -= 5
    
    return max(0, score)

from typing import List, Dict
from utils.score_calculator import calculate_security_score

def parse_and_combine_results(claude_results: List[Dict], bandit_results: List[Dict] = None) -> Dict:
    """
    Combine results from Claude and Bandit, remove duplicates, calculate score.
    """
    
    all_vulnerabilities = []
    
    # Add Claude results
    if claude_results:
        all_vulnerabilities.extend(claude_results)
    
    # Add Bandit results if available
    if bandit_results:
        all_vulnerabilities.extend(bandit_results)
    
    # Remove duplicates (same line + similar title)
    unique_vulns = remove_duplicates(all_vulnerabilities)
    
    # Calculate summary
    summary = calculate_summary(unique_vulns)
    
    # Calculate security score
    security_score = calculate_security_score(unique_vulns)
    
    # Determine risk level
    risk_level = get_risk_level(security_score)
    
    return {
        'success': True,
        'vulnerabilities': unique_vulns,
        'securityScore': security_score,
        'riskLevel': risk_level,
        'summary': summary,
        'totalIssues': len(unique_vulns)
    }

def remove_duplicates(vulnerabilities: List[Dict]) -> List[Dict]:
    """Remove duplicate vulnerabilities based on line and similarity."""
    seen = set()
    unique = []
    
    for vuln in vulnerabilities:
        identifier = f"{vuln.get('line', 0)}_{vuln.get('title', '')[:30]}"
        
        if identifier not in seen:
            seen.add(identifier)
            unique.append(vuln)
    
    return unique

def calculate_summary(vulnerabilities: List[Dict]) -> Dict:
    """Calculate summary statistics with category aggregation."""
    summary = {
        'totalIssues': len(vulnerabilities),
        'critical': 0,
        'high': 0,
        'medium': 0,
        'low': 0,
        'categories': {}
    }
    
    for vuln in vulnerabilities:
        # Count by severity
        severity = vuln.get('severity', 'LOW').upper()
        if severity == 'CRITICAL':
            summary['critical'] += 1
        elif severity == 'HIGH':
            summary['high'] += 1
        elif severity == 'MEDIUM':
            summary['medium'] += 1
        else:
            summary['low'] += 1
            
        # Count by category for the frontend chart
        category = vuln.get('category', 'Uncategorized')
        if category in summary['categories']:
            summary['categories'][category] += 1
        else:
            summary['categories'][category] = 1
            
    return summary

def get_risk_level(score: int) -> str:
    """Determine risk level from security score."""
    if score >= 80:
        return 'LOW'
    elif score >= 60:
        return 'MEDIUM'
    elif score >= 40:
        return 'HIGH'
    else:
        return 'CRITICAL'

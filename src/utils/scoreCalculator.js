/**
 * Calculate a security score based on vulnerability data.
 * @param {Array} vulnerabilities - List of vulnerability objects
 * @returns {number} Score from 0 to 100
 */
export const calculateSecurityScore = (vulnerabilities) => {
  if (!vulnerabilities || vulnerabilities.length === 0) return 100;

  const weights = {
    CRITICAL: 25,
    HIGH: 15,
    MEDIUM: 8,
    LOW: 3,
  };

  let deductions = 0;
  vulnerabilities.forEach((vuln) => {
    deductions += weights[vuln.severity] || 5;
  });

  return Math.max(0, Math.min(100, 100 - deductions));
};

/**
 * Get the risk level label based on a security score.
 * @param {number} score - Security score (0-100)
 * @returns {string} Risk level label
 */
export const getRiskLevel = (score) => {
  if (score >= 90) return "EXCELLENT";
  if (score >= 70) return "GOOD";
  if (score >= 50) return "FAIR";
  if (score >= 30) return "POOR";
  return "CRITICAL";
};

/**
 * Get the color class for a given score.
 * @param {number} score - Security score (0-100)
 * @returns {string} CSS color value
 */
export const getScoreColor = (score) => {
  if (score >= 70) return "#00ff88";
  if (score >= 40) return "#ffd700";
  return "#ff3864";
};

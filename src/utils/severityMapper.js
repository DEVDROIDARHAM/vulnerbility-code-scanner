/**
 * Map severity levels to colors, labels, and sort order.
 */

export const severityConfig = {
  CRITICAL: {
    color: "#ff3864",
    bg: "rgba(255, 56, 100, 0.15)",
    border: "rgba(255, 56, 100, 0.3)",
    label: "Critical",
    order: 0,
    icon: "🔴",
  },
  HIGH: {
    color: "#ffa500",
    bg: "rgba(255, 165, 0, 0.15)",
    border: "rgba(255, 165, 0, 0.3)",
    label: "High",
    order: 1,
    icon: "🟠",
  },
  MEDIUM: {
    color: "#ffd700",
    bg: "rgba(255, 215, 0, 0.15)",
    border: "rgba(255, 215, 0, 0.3)",
    label: "Medium",
    order: 2,
    icon: "🟡",
  },
  LOW: {
    color: "#00ff88",
    bg: "rgba(0, 255, 136, 0.15)",
    border: "rgba(0, 255, 136, 0.3)",
    label: "Low",
    order: 3,
    icon: "🟢",
  },
};

/**
 * Get severity configuration by level.
 * @param {string} severity - Severity level (CRITICAL, HIGH, MEDIUM, LOW)
 * @returns {object} Severity configuration
 */
export const getSeverityConfig = (severity) => {
  return severityConfig[severity] || severityConfig.LOW;
};

/**
 * Sort vulnerabilities by severity (most severe first).
 * @param {Array} vulnerabilities - List of vulnerability objects
 * @returns {Array} Sorted vulnerabilities
 */
export const sortBySeverity = (vulnerabilities) => {
  return [...vulnerabilities].sort(
    (a, b) =>
      (severityConfig[a.severity]?.order ?? 99) -
      (severityConfig[b.severity]?.order ?? 99)
  );
};

/**
 * Filter vulnerabilities by severity level.
 * @param {Array} vulnerabilities - List of vulnerability objects
 * @param {string} severity - Severity level to filter by, or "ALL"
 * @returns {Array} Filtered vulnerabilities
 */
export const filterBySeverity = (vulnerabilities, severity) => {
  if (severity === "ALL") return vulnerabilities;
  return vulnerabilities.filter((v) => v.severity === severity);
};

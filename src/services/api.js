const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error("VITE_API_URL is not set. Please define it in your .env file.");
}

/**
 * Scan code for security vulnerabilities.
 * Phase 1: Returns mock data after a simulated delay.
 * Phase 2: Replace with real API call to Flask backend.
 */
export const scanCode = async (code, language) => {
  
  try {
    const response = await fetch(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        language: language
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Scan failed');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    throw error;
  }
};

const readLocalScanHistory = () => {
  try {
    const saved = localStorage.getItem("scanHistory");
    const history = saved ? JSON.parse(saved) : [];
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

export const getScanHistory = async () => {
  const token = localStorage.getItem('token');
  const localHistory = readLocalScanHistory();
  if (!token) return { history: localHistory, total: localHistory.length };

  try {
    const response = await fetch(`${BASE_URL}/api/scan/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return { history: [], total: 0 };
    return await response.json();

  } catch (error) {
    return { history: [], total: 0 };
  }
};
/**
 * Save a scan result to history in localStorage.
 */
export const saveScanToHistory = (scanResult, code, language) => {
  let history = [];
  try {
    const saved = localStorage.getItem("scanHistory");
    history = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(history)) history = [];
  } catch {
    history = [];
  }
  const entry = {
    id: `scan_${Date.now()}`,
    date: new Date().toISOString(),
    language,
    securityScore: scanResult.securityScore,
    riskLevel: scanResult.riskLevel,
    totalIssues: scanResult.summary.totalIssues,
    critical: scanResult.summary.critical,
    high: scanResult.summary.high,
    medium: scanResult.summary.medium,
    low: scanResult.summary.low,
    codePreview: code.substring(0, 100) + (code.length > 100 ? "..." : ""),
    fullResult: scanResult,
  };

  history.unshift(entry);
  // Keep only last 50 scans
  if (history.length > 50) history.pop();
  localStorage.setItem("scanHistory", JSON.stringify(history));
  return entry;
};

/**
 * Delete a scan from history.
 */
export const deleteScanFromHistory = (scanId) => {
  const history = readLocalScanHistory();
  const updated = history.filter((s) => s.id !== scanId);
  localStorage.setItem("scanHistory", JSON.stringify(updated));
  return updated;
};

/**
 * Clear all scan history.
 */
export const clearScanHistory = () => {
  localStorage.removeItem("scanHistory");
  return [];
};

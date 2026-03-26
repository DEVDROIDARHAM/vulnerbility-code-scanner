import { useState, useCallback, useEffect } from "react";
import { scanCode, saveScanToHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";

const GUEST_SCAN_LIMIT = 5;
const GUEST_WARNING_AT = 3;

// Get current guest scan count
const getGuestCount = () => parseInt(localStorage.getItem('guestScanCount') || '0');

// Increment guest scan count
const incrementGuestCount = () => {
  const count = getGuestCount() + 1;
  localStorage.setItem('guestScanCount', count.toString());
  return count;
};

/**
 * Custom hook encapsulating scanner logic.
 * @returns {object} Scanner state and controls
 */
export const useScanner = () => {
  const { isAuthenticated } = useAuth();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [guestBlocked, setGuestBlocked] = useState(false);
  const [guestWarning, setGuestWarning] = useState(false);
  const [scansRemaining, setScansRemaining] = useState(() => {
    const current = getGuestCount();
    return Math.max(0, GUEST_SCAN_LIMIT - current);
  });

  useEffect(() => {
    if (isAuthenticated) {
      setGuestBlocked(false);
      setGuestWarning(false);
      setScansRemaining(GUEST_SCAN_LIMIT);
      return;
    }

    const current = getGuestCount();
    setScansRemaining(Math.max(0, GUEST_SCAN_LIMIT - current));
    setGuestBlocked(current >= GUEST_SCAN_LIMIT);
    setGuestWarning(current >= GUEST_WARNING_AT && current < GUEST_SCAN_LIMIT);
  }, [isAuthenticated]);

  const scan = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to scan.");
      return false; // return false for empty code
    }

    if (!isAuthenticated) {
      const count = getGuestCount();
      
      // Block at limit
      if (count >= GUEST_SCAN_LIMIT) {
        setGuestBlocked(true);
        return false;
      }
      
      // Increment count
      const newCount = incrementGuestCount();
      
      // Warn at threshold
      if (newCount >= GUEST_WARNING_AT) {
        setGuestWarning(true);
        setScansRemaining(GUEST_SCAN_LIMIT - newCount);
      }
    }

    setIsScanning(true);
    setError(null);

    try {
      const response = await scanCode(code, language);
      
      setResults(response);
      saveScanToHistory(response, code, language);
      return true; // return true on success
    } catch (err) {
      setError("Scan failed. Please try again.");
      return false; // return false on error
    } finally {
      setIsScanning(false);
    }
  }, [code, language, isAuthenticated]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCode("");
    setResults(null);
    setError(null);
    setLanguage("javascript");
  }, []);

  return {
    code,
    setCode,
    language,
    setLanguage,
    results,
    isScanning,
    error,
    guestBlocked,
    guestWarning,
    scansRemaining,
    isLoggedIn: isAuthenticated,
    scan,
    clearResults,
    reset,
  };
};

export default useScanner;

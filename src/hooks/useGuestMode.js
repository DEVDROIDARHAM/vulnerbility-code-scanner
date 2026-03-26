import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to manage Guest/Trial mode scan counting and limits.
 */
export const useGuestMode = () => {
  const { isAuthenticated } = useAuth();
  const [guestScans, setGuestScans] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  
  const TRIAL_LIMIT = 5;

  useEffect(() => {
    // A user is a guest if they are not authenticated.
    setIsGuest(!isAuthenticated);
    
    // Retrieve guest scan count from localStorage.
    const scans = parseInt(localStorage.getItem('guestScanCount') || '0', 10);
    setGuestScans(scans);
  }, [isAuthenticated]);
  
  const incrementGuestScans = () => {
    if (!isAuthenticated) {
      const newCount = guestScans + 1;
      setGuestScans(newCount);
      localStorage.setItem('guestScanCount', newCount.toString());
    }
  };
  
  const getRemainingScans = () => {
    return Math.max(0, TRIAL_LIMIT - guestScans);
  };
  
  const hasTrialScans = () => {
    return guestScans < TRIAL_LIMIT;
  };
  
  return {
    isGuest,
    guestScans,
    incrementGuestScans,
    getRemainingScans,
    hasTrialScans,
    trialLimit: TRIAL_LIMIT
  };
};

export default useGuestMode;

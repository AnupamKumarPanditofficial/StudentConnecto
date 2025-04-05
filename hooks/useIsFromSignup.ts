
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to check if user navigated from the signup page
 */
export const useIsFromSignup = () => {
  const location = useLocation();
  const [isFromSignup, setIsFromSignup] = useState(false);
  
  useEffect(() => {
    // Check if the user navigated from the signup page
    if (location.state && location.state.fromSignup) {
      setIsFromSignup(true);
      // Clean up the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  return isFromSignup;
};

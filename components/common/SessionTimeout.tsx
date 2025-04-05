
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { isAuthenticated } from '@/config/firebase';

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;
// Warning before timeout (1 minute before)
const WARNING_TIME = 60 * 1000;

const SessionTimeout: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [countDown, setCountDown] = useState(60);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkActivity = () => {
      if (!isAuthenticated()) return;
      
      const lastActivity = Number(localStorage.getItem('lastActivity'));
      const currentTime = Date.now();
      
      if (lastActivity && currentTime - lastActivity > SESSION_TIMEOUT) {
        // Session expired
        handleLogout();
      } else if (lastActivity && currentTime - lastActivity > SESSION_TIMEOUT - WARNING_TIME) {
        // Show warning
        setShowWarning(true);
        const secondsLeft = Math.floor((SESSION_TIMEOUT - (currentTime - lastActivity)) / 1000);
        setCountDown(secondsLeft);
        
        // Start countdown
        if (!timer) {
          const intervalId = window.setInterval(() => {
            setCountDown(prev => {
              if (prev <= 1) {
                clearInterval(intervalId);
                handleLogout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          setTimer(intervalId);
        }
      }
    };
    
    // Check inactivity every minute
    const interval = setInterval(checkActivity, 60000);
    
    // Update last activity on user interaction
    const updateActivity = () => {
      if (isAuthenticated()) {
        localStorage.setItem('lastActivity', String(Date.now()));
      }
    };
    
    // Listen for user activity
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    // Initial check
    checkActivity();
    
    return () => {
      clearInterval(interval);
      if (timer) clearInterval(timer);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, [navigate, timer]);
  
  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    
    // Trigger auth state change
    window.dispatchEvent(new Event('auth-state-changed'));
    
    if (timer) clearInterval(timer);
    setTimer(null);
    setShowWarning(false);
    
    // Redirect to login
    navigate('/login', { 
      state: { message: 'Your session has expired due to inactivity. Please log in again.' } 
    });
  };
  
  const handleContinue = () => {
    // Update last activity
    localStorage.setItem('lastActivity', String(Date.now()));
    
    // Clear timer and hide warning
    if (timer) clearInterval(timer);
    setTimer(null);
    setShowWarning(false);
  };
  
  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out in {countDown} seconds due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>Logout Now</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>Continue Session</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeout;

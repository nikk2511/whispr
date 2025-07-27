import { useState, useEffect, useCallback } from 'react';

interface UseUserActivityOptions {
  timeout?: number; // Time in milliseconds before user is considered inactive
  throttle?: number; // Throttle time for activity events
}

export function useUserActivity(options: UseUserActivityOptions = {}) {
  const { timeout = 5 * 60 * 1000, throttle = 1000 } = options; // Default 5 minutes timeout, 1 second throttle
  
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  const updateActivity = useCallback(() => {
    const now = new Date();
    setLastActivity(now);
    if (!isActive) {
      setIsActive(true);
    }
  }, [isActive]);

  // Throttled version of updateActivity
  const throttledUpdateActivity = useCallback(() => {
    const now = Date.now();
    const lastActivityTime = lastActivity.getTime();
    
    if (now - lastActivityTime > throttle) {
      updateActivity();
    }
  }, [updateActivity, lastActivity, throttle]);

  useEffect(() => {
    // Activity event listeners
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      throttledUpdateActivity();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up interval to check for inactivity
    const interval = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
      
      if (timeSinceLastActivity > timeout && isActive) {
        setIsActive(false);
      }
    }, 10000); // Check every 10 seconds

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(interval);
    };
  }, [throttledUpdateActivity, timeout, isActive, lastActivity]);

  const getActivityStatus = useCallback(() => {
    return isActive ? 'active' : 'away';
  }, [isActive]);

  const getActivityColor = useCallback(() => {
    return isActive ? 'bg-green-500' : 'bg-yellow-500';
  }, [isActive]);

  const getActivityText = useCallback(() => {
    return isActive ? 'Active' : 'Away';
  }, [isActive]);

  return {
    isActive,
    lastActivity,
    getActivityStatus,
    getActivityColor,
    getActivityText,
  };
} 
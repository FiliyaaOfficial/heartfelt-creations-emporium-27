import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKeepAlive = () => {
  useEffect(() => {
    // Call keep-alive function every 5 minutes (300000 ms)
    const keepAliveInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke('keep-alive');
      } catch (error) {
        // Silent error handling for production
      }
    }, 300000); // 5 minutes

    // Initial call when app starts
    const initialKeepAlive = async () => {
      try {
        await supabase.functions.invoke('keep-alive');
      } catch (error) {
        // Silent error handling for production
      }
    };

    // Call immediately when hook mounts
    initialKeepAlive();

    // Also call keep-alive on user interaction to keep session active
    const handleUserActivity = () => {
      initialKeepAlive();
    };

    // Listen for user activity
    document.addEventListener('click', handleUserActivity, { passive: true });
    document.addEventListener('keypress', handleUserActivity, { passive: true });
    document.addEventListener('scroll', handleUserActivity, { passive: true });

    return () => {
      clearInterval(keepAliveInterval);
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
    };
  }, []);
};

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKeepAlive = () => {
  useEffect(() => {
    // Call keep-alive function every 5 minutes (300000 ms) - more frequent to prevent timeout
    const keepAliveInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('keep-alive');
        if (error) {
          console.error('Keep-alive error:', error);
        } else {
          console.log('Keep-alive successful:', data);
        }
      } catch (error) {
        console.error('Keep-alive function call failed:', error);
      }
    }, 300000); // 5 minutes

    // Initial call when app starts
    const initialKeepAlive = async () => {
      try {
        await supabase.functions.invoke('keep-alive');
        console.log('Initial keep-alive call successful');
      } catch (error) {
        console.error('Initial keep-alive failed:', error);
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

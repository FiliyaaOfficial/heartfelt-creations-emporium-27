import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKeepAlive = () => {
  useEffect(() => {
    // Call keep-alive function every 6 hours (21600000 ms)
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
    }, 21600000); // 6 hours

    // Initial call
    const initialKeepAlive = async () => {
      try {
        await supabase.functions.invoke('keep-alive');
        console.log('Initial keep-alive call successful');
      } catch (error) {
        console.error('Initial keep-alive failed:', error);
      }
    };

    initialKeepAlive();

    return () => clearInterval(keepAliveInterval);
  }, []);
};

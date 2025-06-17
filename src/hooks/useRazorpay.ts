
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RazorpayOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initializePayment = async (options: RazorpayOptions) => {
    setLoading(true);
    
    try {
      // Create Razorpay order
      const { data: orderData, error } = await supabase.functions.invoke('razorpay-order', {
        body: {
          amount: options.amount,
          currency: options.currency || 'INR',
          notes: {
            description: options.description
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
        amount: orderData.amount,
        currency: orderData.currency,
        name: options.name,
        description: options.description,
        order_id: orderData.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          options.onSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: function() {
            options.onError(new Error('Payment cancelled'));
          }
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      options.onError(error);
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, loading };
};

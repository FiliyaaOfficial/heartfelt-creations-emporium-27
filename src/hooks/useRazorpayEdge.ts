
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRazorpayEdge = () => {
  const createOrder = async (amount: number, currency = 'INR') => {
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount,
          currency,
          receipt: `order_${Date.now()}`
        }
      });

      if (error) {
        console.error('Error creating Razorpay order:', error);
        toast.error('Failed to create payment order');
        return null;
      }

      if (!data.success) {
        console.error('Razorpay order creation failed:', data.error);
        toast.error('Failed to create payment order');
        return null;
      }

      return data.order;
    } catch (error) {
      console.error('Unexpected error creating Razorpay order:', error);
      toast.error('Failed to create payment order');
      return null;
    }
  };

  return { createOrder };
};


import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
}

export const useCoupons = () => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async (code: string, orderAmount: number) => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return null;
    }

    setIsValidating(true);
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        toast.error('Invalid coupon code');
        return null;
      }

      // Check if coupon is still valid
      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        toast.error('This coupon has expired');
        return null;
      }

      // Check minimum order amount
      if (orderAmount < coupon.min_order_amount) {
        toast.error(`Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`);
        return null;
      }

      // Check usage limit
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        toast.error('This coupon has reached its usage limit');
        return null;
      }

      toast.success('Coupon applied successfully!');
      setAppliedCoupon(coupon);
      return coupon;
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Failed to validate coupon');
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const calculateDiscount = (orderAmount: number, coupon: Coupon | null = appliedCoupon) => {
    if (!coupon) return 0;

    if (coupon.discount_type === 'percentage') {
      return Math.min((orderAmount * coupon.discount_value) / 100, orderAmount);
    } else {
      return Math.min(coupon.discount_value, orderAmount);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  return {
    appliedCoupon,
    isValidating,
    validateCoupon,
    calculateDiscount,
    removeCoupon
  };
};

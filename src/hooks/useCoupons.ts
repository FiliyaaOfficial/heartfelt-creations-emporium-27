
import { useState } from 'react';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  valid_until?: string;
  active: boolean;
}

// Mock coupon data until database is set up
const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'SAVE10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 500,
    max_uses: 100,
    used_count: 0,
    active: true
  },
  {
    id: '2',
    code: 'FLAT50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 200,
    max_uses: 50,
    used_count: 0,
    active: true
  }
];

export const useCoupons = () => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async (code: string, orderAmount: number) => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return null;
    }

    setIsValidating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find coupon in mock data
      const coupon = MOCK_COUPONS.find(c => 
        c.code.toUpperCase() === code.toUpperCase() && c.active
      );

      if (!coupon) {
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

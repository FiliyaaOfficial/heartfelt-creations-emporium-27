
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CouponCodeProps {
  subtotal: number;
  onApplyCoupon: (discount: number, code: string) => void;
  appliedCoupon?: { code: string; discount: number };
  onRemoveCoupon: () => void;
}

const CouponCode: React.FC<CouponCodeProps> = ({ 
  subtotal, 
  onApplyCoupon, 
  appliedCoupon, 
  onRemoveCoupon 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    try {
      const { data, error } = await supabase.rpc('validate_coupon', {
        coupon_code_input: couponCode.trim().toUpperCase(),
        order_amount: subtotal
      });

      if (error) throw error;

      if (data.valid) {
        onApplyCoupon(data.discount_amount, couponCode.trim().toUpperCase());
        toast.success(`Coupon applied! You saved ₹${data.discount_amount}`);
        setCouponCode('');
      } else {
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600">
                You saved ₹{appliedCoupon.discount}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveCoupon}
            className="text-green-600 hover:text-green-800"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <Label htmlFor="coupon" className="text-sm font-medium mb-2 block">
        Have a coupon code?
      </Label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
          disabled={isApplying}
        />
        <Button
          onClick={handleApplyCoupon}
          disabled={isApplying || !couponCode.trim()}
          variant="outline"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
};

export default CouponCode;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, X, Loader2 } from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied: (discount: number, coupon: any) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ orderAmount, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const { appliedCoupon, isValidating, validateCoupon, calculateDiscount, removeCoupon } = useCoupons();

  const handleApplyCoupon = async () => {
    const coupon = await validateCoupon(couponCode, orderAmount);
    if (coupon) {
      const discount = calculateDiscount(orderAmount, coupon);
      onCouponApplied(discount, coupon);
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    onCouponApplied(0, null);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={18} className="text-heartfelt-burgundy" />
        <h3 className="font-medium">Coupon Code</h3>
      </div>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
          <div>
            <p className="font-medium text-green-800">
              {appliedCoupon.code} Applied
            </p>
            <p className="text-sm text-green-600">
              {appliedCoupon.discount_type === 'percentage' 
                ? `${appliedCoupon.discount_value}% off`
                : `₹${appliedCoupon.discount_value} off`
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-green-700 hover:text-green-800"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code (try SAVE10 or FLAT50)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isValidating}
            variant="outline"
          >
            {isValidating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponInput;

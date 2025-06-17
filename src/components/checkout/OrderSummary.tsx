
import React from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, CreditCard, Shield, Loader2, Tag } from 'lucide-react';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  currencySymbol: string;
  appliedCoupon: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, 
  subtotal, 
  discount,
  loading, 
  handleSubmit,
  currencySymbol,
  appliedCoupon
}) => {
  const shippingCost = 0;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shippingCost + tax;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-80 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center py-3 border-b">
              <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image_url} 
                  alt={item.product.name} 
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="text-sm font-medium">{item.product.name}</h3>
                <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
              </div>
              <div className="font-medium text-right ml-2">
                {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          
          {appliedCoupon && discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={14} />
                Discount ({appliedCoupon.code})
              </span>
              <span>-{currencySymbol}{discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (18%)</span>
            <span>{currencySymbol}{tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          
          <div className="pt-3 border-t border-dashed">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <div className="text-heartfelt-burgundy text-lg">
                {currencySymbol}{total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark py-6 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>Place Order</>
            )}
          </Button>
          
          <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground gap-1">
            <Shield size={14} />
            <span>Secure checkout with 100% purchase protection</span>
          </div>
        </div>
        
        <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Truck size={14} className="mr-1" />
            <span>Free delivery</span>
          </div>
          <div className="flex items-center">
            <CreditCard size={14} className="mr-1" />
            <span>Secure payment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;

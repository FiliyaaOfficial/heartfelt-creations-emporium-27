
import React from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, Shield, Loader2 } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, 
  subtotal, 
  loading, 
  handleSubmit 
}) => {
  const { formatCurrency } = useCurrency();
  const shippingCost = 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="max-h-80 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start py-3 border-b">
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
                
                {/* Show customization details */}
                {item.customization && (
                  <div className="mt-1 p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800 mb-1">Custom:</p>
                    <p className="text-blue-700 line-clamp-2">{item.customization}</p>
                    {item.selected_options?.customizationImages && item.selected_options.customizationImages.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {item.selected_options.customizationImages.slice(0, 2).map((imageUrl: string, index: number) => (
                          <img 
                            key={index}
                            src={imageUrl} 
                            alt={`Custom ${index + 1}`}
                            className="w-6 h-6 object-cover rounded border"
                          />
                        ))}
                        {item.selected_options.customizationImages.length > 2 && (
                          <div className="w-6 h-6 bg-gray-200 rounded border flex items-center justify-center text-xs">
                            +{item.selected_options.customizationImages.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="font-medium text-right ml-2">
                <div className="flex items-center">
                  <span>{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (18%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          
          <div className="pt-3 border-t border-dashed">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <div className="text-heartfelt-burgundy text-lg">
                {formatCurrency(total)}
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
            <span>Free delivery across India</span>
          </div>
          <div className="flex items-center">
            <CreditCard size={14} className="mr-1" />
            <span>Secure payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ShippingAddress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import EmptyCart from '@/components/checkout/EmptyCart';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CouponCode from '@/components/checkout/CouponCode';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      const userMetadata = user.user_metadata || {};
      const firstName = userMetadata.first_name || '';
      const lastName = userMetadata.last_name || '';
      
      setShippingInfo(prev => ({
        ...prev,
        full_name: `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || ''
      }));
    }
  }, [user]);

  const handleCityStateChange = (city: string, state: string, postalCode: string) => {
    setShippingInfo(prev => ({
      ...prev,
      city,
      state,
      postal_code: postalCode
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCoupon = (discount: number, code: string) => {
    setAppliedCoupon({ code, discount });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const validateShippingInfo = () => {
    const requiredFields = ['full_name', 'street_address', 'city', 'state', 'postal_code', 'phone'];
    const missingFields = requiredFields.filter(field => {
      const value = shippingInfo[field as keyof ShippingAddress];
      return !value || value.toString().trim() === '';
    });
    
    if (missingFields.length) {
      toast.error(`Please fill in all required shipping information: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    console.log('Shipping info before validation:', shippingInfo);
    if (validateShippingInfo()) {
      setCurrentStep(2);
    }
  };

  const createOrder = async () => {
    if (!user || !cartItems.length) {
      toast.error('Please login and add items to cart');
      return null;
    }

    setLoading(true);
    try {
      const finalTotal = subtotal - (appliedCoupon?.discount || 0);
      const tax = finalTotal * 0.18;
      const totalAmount = finalTotal + tax;

      // Convert ShippingAddress to Json format
      const shippingAddressJson = {
        full_name: shippingInfo.full_name,
        street_address: shippingInfo.street_address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postal_code: shippingInfo.postal_code,
        country: shippingInfo.country,
        phone: shippingInfo.phone
      };

      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: shippingInfo.full_name,
          customer_email: user.email!,
          user_id: user.id,
          total_amount: totalAmount,
          shipping_address: shippingAddressJson,
          coupon_code: appliedCoupon?.code || null,
          coupon_discount: appliedCoupon?.discount || 0,
          is_first_order: appliedCoupon?.code === 'FIRST50',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update coupon usage count if coupon was applied
      if (appliedCoupon) {
        const { error: couponError } = await supabase.functions.invoke('increment-coupon-usage', {
          body: { coupon_code: appliedCoupon.code }
        });
        
        if (couponError) {
          console.error('Error updating coupon usage:', couponError);
        }
      }

      // Track user purchase history
      await supabase
        .from('user_purchase_history')
        .upsert({
          user_id: user.id,
          email: user.email!,
          first_order_date: new Date().toISOString(),
          total_orders: 1
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        });

      clearCart();
      navigate(`/order-confirmation/${orderData.id}`);
      
      return orderData.id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create your order. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => currentStep === 1 ? navigate(-1) : setCurrentStep(1)} 
            variant="ghost" 
            size="sm" 
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-serif font-medium">Secure Checkout</h1>
        </div>

        <CheckoutSteps currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                <ShippingForm 
                  shippingInfo={shippingInfo} 
                  handleInputChange={handleInputChange}
                  handleCityStateChange={handleCityStateChange}
                />
                
                <div className="mt-8 pt-6 border-t">
                  <CouponCode
                    subtotal={subtotal}
                    onApplyCoupon={handleApplyCoupon}
                    appliedCoupon={appliedCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={handleContinueToPayment}
                    className="bg-heartfelt-burgundy hover:bg-heartfelt-dark px-8 py-3"
                  >
                    Continue to Payment <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.full_name}<br />
                      {shippingInfo.street_address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postal_code}<br />
                      {shippingInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PaymentMethodSelector loading={loading} />
                  
                  <div className="mt-6">
                    <Button 
                      onClick={createOrder}
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark py-6 text-lg"
                      disabled={loading}
                    >
                      {loading ? 'Processing Order...' : 'Complete Order'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            <OrderSummary 
              cartItems={cartItems} 
              subtotal={subtotal} 
              loading={loading} 
              handleSubmit={async () => {}} // Empty async function since we handle submission differently now
              couponDiscount={appliedCoupon?.discount}
              appliedCouponCode={appliedCoupon?.code}
              showPlaceOrderButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ShippingAddress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { shippingAddressSchema } from '@/utils/validation';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import EmptyCart from '@/components/checkout/EmptyCart';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const { initializePayment, loading: paymentLoading } = useRazorpay();
  const { trackPurchase } = useAnalytics();
  const [loading, setLoading] = useState(false);
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

  const handleCityStateChange = (city: string, state: string) => {
    setShippingInfo(prev => ({
      ...prev,
      city,
      state
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = async (paymentId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          shipping_address: shippingInfo,
          cart_items: cartItems,
          total_amount: subtotal,
          payment_id: paymentId
        }
      });

      if (error) throw error;
      return data.order_id;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const orderId = await createOrder(paymentId);
      
      // Track purchase
      trackPurchase(orderId, subtotal, cartItems);
      
      // Clear cart
      await clearCart();
      
      toast.success('Payment successful! Order placed.');
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Post-payment error:', error);
      toast.error('Payment successful but order processing failed. Please contact support.');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate shipping info
    try {
      shippingAddressSchema.parse(shippingInfo);
    } catch (error: any) {
      toast.error(error.errors[0]?.message || 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    
    try {
      await initializePayment({
        amount: subtotal,
        currency: 'INR',
        name: 'Filiyaa',
        description: `Order for ${cartItems.length} items`,
        onSuccess: handlePaymentSuccess,
        onError: handlePaymentError
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead 
        title="Checkout - Filiyaa"
        description="Complete your purchase securely with Filiyaa"
      />
      
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          size="sm" 
          className="mr-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl md:text-3xl font-serif font-medium">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <form onSubmit={handleSubmit}>
            <ShippingForm 
              shippingInfo={shippingInfo} 
              handleInputChange={handleInputChange}
              handleCityStateChange={handleCityStateChange}
            />
            
            <PaymentMethodSelector loading={loading || paymentLoading} />
            
            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark py-3"
                disabled={loading || paymentLoading}
              >
                {(loading || paymentLoading) ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {loading || paymentLoading ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="col-span-1">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal} 
            loading={loading || paymentLoading} 
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

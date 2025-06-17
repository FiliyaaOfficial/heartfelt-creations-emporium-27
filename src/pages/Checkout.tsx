import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/hooks/useCurrency';
import { usePaymentGateway } from '@/hooks/usePaymentGateway';
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
import CouponInput from '@/components/checkout/CouponInput';
import CurrencySelector from '@/components/checkout/CurrencySelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const { initializePayment, loading: paymentLoading } = useRazorpay();
  const { trackPurchase } = useAnalytics();
  const { currencyConfig, convertFromINR, convertToINR } = useCurrency();
  const { selectedGateway } = usePaymentGateway(currencyConfig.currency);
  
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
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

  const convertedSubtotal = convertFromINR(subtotal);
  const convertedDiscount = convertFromINR(discount);
  const finalAmount = convertedSubtotal - convertedDiscount;

  const handleCouponApplied = (discountAmount: number, coupon: any) => {
    setDiscount(discountAmount);
    setAppliedCoupon(coupon);
  };

  const handleStripePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          amount: finalAmount,
          currency: currencyConfig.currency,
          shipping_address: shippingInfo,
          cart_items: cartItems,
          coupon_code: appliedCoupon?.code,
          discount_amount: convertedDiscount
        }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error('Failed to initialize Stripe payment');
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const amountInINR = convertToINR(finalAmount);
      
      await initializePayment({
        amount: amountInINR,
        currency: 'INR',
        name: 'Filiyaa',
        description: `Order for ${cartItems.length} items`,
        onSuccess: handlePaymentSuccess,
        onError: handlePaymentError,
        coupon_code: appliedCoupon?.code,
        discount_amount: discount
      });
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error('Failed to initialize Razorpay payment');
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const orderId = await createOrder(paymentId);
      
      trackPurchase(orderId, finalAmount, cartItems);
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

  const createOrder = async (paymentId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          shipping_address: shippingInfo,
          cart_items: cartItems,
          total_amount: finalAmount,
          payment_id: paymentId,
          coupon_code: appliedCoupon?.code,
          discount_amount: convertedDiscount,
          currency: currencyConfig.currency
        }
      });

      if (error) throw error;
      return data.order_id;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      shippingAddressSchema.parse(shippingInfo);
    } catch (error: any) {
      toast.error(error.errors[0]?.message || 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    
    try {
      if (selectedGateway === 'stripe') {
        await handleStripePayment();
      } else {
        await handleRazorpayPayment();
      }
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
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
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
        <CurrencySelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <ShippingForm 
            shippingInfo={shippingInfo} 
            handleInputChange={handleInputChange}
            handleCityStateChange={handleCityStateChange}
          />
          
          <CouponInput 
            orderAmount={subtotal}
            onCouponApplied={handleCouponApplied}
          />
          
          <PaymentMethodSelector 
            loading={loading || paymentLoading}
            selectedGateway={selectedGateway}
            currency={currencyConfig.currency}
          />
          
          <div className="mt-6">
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark py-3"
              disabled={loading || paymentLoading}
            >
              {(loading || paymentLoading) ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {loading || paymentLoading ? 'Processing...' : `Pay ${currencyConfig.symbol}${finalAmount.toFixed(2)}`}
            </Button>
          </div>
        </div>
        
        <div className="col-span-1">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={convertedSubtotal}
            discount={convertedDiscount}
            loading={loading || paymentLoading} 
            handleSubmit={handleSubmit}
            currencySymbol={currencyConfig.symbol}
            appliedCoupon={appliedCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

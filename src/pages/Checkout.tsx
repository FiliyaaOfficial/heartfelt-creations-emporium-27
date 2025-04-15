
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ShippingAddress } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import EmptyCart from '@/components/checkout/EmptyCart';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
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
      // Safely handle user data - first_name and last_name might not exist
      // We need to use any type here since TypeScript doesn't know about these properties
      const userAny = user as any;
      const firstName = userAny?.first_name || '';
      const lastName = userAny?.last_name || '';
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    const requiredFields = ['full_name', 'street_address', 'city', 'state', 'postal_code', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingAddress]);
    
    if (missingFields.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const shippingAddressJson = JSON.parse(JSON.stringify(shippingInfo));
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          shipping_address: shippingAddressJson,
          total_amount: subtotal,
          status: 'pending',
          payment_status: 'pending',
          contact_email: user?.email || '',
          contact_phone: shippingInfo.phone
        })
        .select()
        .single();

      if (error) throw error;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
            
            <PaymentMethodSelector loading={loading} />
          </form>
        </div>
        
        <div className="col-span-1">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal} 
            loading={loading} 
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

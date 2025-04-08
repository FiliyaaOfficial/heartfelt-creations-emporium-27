
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShippingAddress } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, toJson } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in shippingAddress) {
      setShippingAddress(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create the order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          contact_email: formData.email,
          contact_phone: formData.phone,
          total_amount: cartTotal,
          shipping_address: toJson(shippingAddress),
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (orderData) {
        // Create order items
        for (const cartItem of cartItems) {
          const { error: orderItemError } = await supabase
            .from('order_items')
            .insert({
              order_id: orderData.id,
              product_id: cartItem.product.id,
              product_name: cartItem.product.name,
              product_price: cartItem.product.price,
              quantity: cartItem.quantity,
            });

          if (orderItemError) throw orderItemError;
        }

        // Clear the cart
        clearCart();

        // Redirect to success page
        navigate(`/order-confirmation/${orderData.id}`);

        toast({
          title: 'Order Placed!',
          description: 'Your order has been successfully placed.',
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: 'Checkout Failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="container mx-auto p-4">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div className="mb-4">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              type="text"
              id="full_name"
              name="full_name"
              value={shippingAddress.full_name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="street_address">Street Address</Label>
            <Input
              type="text"
              id="street_address"
              name="street_address"
              value={shippingAddress.street_address}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                type="text"
                id="postal_code"
                name="postal_code"
                value={shippingAddress.postal_code}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <ul className="mb-4">
            {cartItems.map(item => (
              <li key={item.product.id} className="flex justify-between items-center py-2 border-b">
                <span>{item.product.name} ({item.quantity})</span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

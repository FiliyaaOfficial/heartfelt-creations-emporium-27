import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ShippingAddress } from '@/types';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<ShippingAddress>({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Basic validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value && key !== 'country') {
        toast({
          title: "Missing information",
          description: `Please fill in your ${key.replace('_', ' ')}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (!contactEmail) {
      toast({
        title: "Missing information",
        description: "Please provide your email address",
        variant: "destructive",
      });
      return false;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: subtotal,
          shipping_address: formData,
          payment_status: 'pending',
          contact_email: contactEmail,
          contact_phone: contactPhone || null
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order!.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart
      await clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order!.id.slice(0, 8)} has been placed.`,
      });
      
      // Redirect to thank you page or order confirmation
      navigate(`/order-confirmation/${order!.id}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error placing your order",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-medium mb-3">Contact Information</h2>
            <Input 
              type="email" 
              placeholder="Email Address" 
              name="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <Input 
              type="tel" 
              placeholder="Phone Number (optional)" 
              name="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-3"
            />
          </div>
          
          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-medium mb-3">Shipping Address</h2>
            <Input 
              type="text" 
              placeholder="Full Name" 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <Input 
              type="text" 
              placeholder="Street Address" 
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              className="mt-3"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Input 
                type="text" 
                placeholder="City" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input 
                type="text" 
                placeholder="State" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Input 
                type="text" 
                placeholder="Postal Code" 
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
              <Input 
                type="text" 
                placeholder="Country" 
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-medium mb-3">Order Summary</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>{subtotal}</span>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee, Truck, CreditCard, ShoppingBag, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { ShippingAddress } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PinCodeLookup from '@/utils/PinCodeLookup';

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

  // Set initial values if we have user data
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      }));
    }
  }, [user]);

  // Handle city and state update from PIN code
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

    // Validation
    const requiredFields = ['full_name', 'street_address', 'city', 'state', 'postal_code', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof ShippingAddress]);
    
    if (missingFields.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Create order in Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          shipping_address: shippingInfo,
          total_amount: subtotal,
          status: 'pending',
          payment_status: 'pending',
          contact_email: user?.email || '',
          contact_phone: shippingInfo.phone
        })
        .select()
        .single();

      if (error) throw error;

      // Create order items
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

      // Clear cart and redirect to confirmation page
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
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="mx-auto h-12 w-12 text-heartfelt-burgundy/40 mb-4" />
          <h1 className="text-2xl font-serif font-medium mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to your cart before checking out</p>
          <Button asChild>
            <a href="/categories">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  const shippingCost = 0; // Free shipping
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

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
        {/* Billing & Shipping Information */}
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input 
                      id="full_name" 
                      name="full_name" 
                      value={shippingInfo.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="street_address">Street Address *</Label>
                  <Input 
                    id="street_address" 
                    name="street_address" 
                    value={shippingInfo.street_address}
                    onChange={handleInputChange}
                    placeholder="1234 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PinCodeLookup onCityStateChange={handleCityStateChange} />
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      name="country" 
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            <Tabs defaultValue="card">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card_number">Card Number</Label>
                    <Input 
                      id="card_number" 
                      placeholder="1234 5678 9012 3456"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="card_name">Name on Card</Label>
                    <Input 
                      id="card_name" 
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123"
                      disabled={loading}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="upi">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upi_id">UPI ID</Label>
                    <Input 
                      id="upi_id" 
                      placeholder="name@upi"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a payment request on your UPI app when you place the order
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="cod">
                <div className="p-4 bg-heartfelt-cream/20 rounded-md">
                  <p className="font-medium mb-2">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Pay with cash when your order is delivered. Additional ₹40 fee applies.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-3 border-b">
                    <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h3 className="text-sm font-medium">{item.product.name}</h3>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium text-right ml-2">
                      <div className="flex items-center">
                        <IndianRupee size={12} />
                        {(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <div className="flex items-center">
                    <IndianRupee size={12} />
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <div className="flex items-center">
                    <IndianRupee size={12} />
                    <span>{tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="pt-3 border-t border-dashed">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <div className="flex items-center text-heartfelt-burgundy text-lg">
                      <IndianRupee size={14} />
                      <span>{total.toFixed(2)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShippingAddress } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  created_at: string;
  shipping_address: ShippingAddress;
  total_amount: number;
  status: string;
  payment_status: string;
  coupon_code?: string;
  coupon_discount?: number;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch order details from Supabase
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        if (orderData) {
          // Safely parse the shipping_address Json field
          let shippingAddress: ShippingAddress;
          try {
            if (typeof orderData.shipping_address === 'string') {
              shippingAddress = JSON.parse(orderData.shipping_address);
            } else if (typeof orderData.shipping_address === 'object' && orderData.shipping_address !== null) {
              shippingAddress = orderData.shipping_address as ShippingAddress;
            } else {
              throw new Error('Invalid shipping address format');
            }
          } catch (e) {
            console.error('Error parsing shipping address:', e);
            toast.error('Error loading shipping address');
            return;
          }

          setOrder({
            id: orderData.id,
            created_at: orderData.created_at,
            shipping_address: shippingAddress,
            total_amount: orderData.total_amount,
            status: orderData.status || 'pending',
            payment_status: orderData.payment_status || 'pending',
            coupon_code: orderData.coupon_code,
            coupon_discount: orderData.coupon_discount,
            items: itemsData || []
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-semibold mb-2 text-red-700">Order Not Found</h1>
          <p className="mb-4">We couldn't find the order you're looking for.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.total_amount - (order.total_amount * 0.18);
  const tax = order.total_amount * 0.18;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-green-800">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span>#{order.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock size={12} className="mr-1" />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Status:</span>
                <span className="capitalize">{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.street_address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              <p className="mt-2">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-sm rounded-lg p-6 border mt-8">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-medium">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {order.coupon_discount && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount ({order.coupon_code}):</span>
                <span>-{formatCurrency(order.coupon_discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/account">
            <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2 text-blue-800">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              <span>Order processing (1-2 hours)</span>
            </div>
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              <span>Shipping (3-5 business days)</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Delivery confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

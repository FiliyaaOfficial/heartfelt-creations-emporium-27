
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package2, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/useCurrency';
import OrderStatusTimeline from './OrderStatusTimeline';
import OrderSupport from '../account/OrderSupport';

interface OrderDetails {
  id: string;
  created_at: string;
  shipping_address: any;
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  order_notes?: string;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  status_history: Array<{
    status: string;
    status_message: string;
    created_at: string;
  }>;
}

const DetailedOrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        // Fetch order details
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

        // Fetch status history
        const { data: historyData, error: historyError } = await supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;

        setOrder({
          ...orderData,
          items: itemsData || [],
          status_history: historyData || []
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Set up real-time updates for order status
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrder(prev => prev ? { ...prev, ...payload.new } : null);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Status history updated:', payload);
          setOrder(prev => prev ? {
            ...prev,
            status_history: [payload.new as any, ...prev.status_history]
          } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700">Order Not Found</h1>
          <p>We couldn't find the order you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          onClick={() => window.history.back()} 
          variant="ghost" 
          size="sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Track Order #{order.id.substring(0, 8)}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <OrderStatusTimeline 
            orderStatus={order.status} 
            statusHistory={order.status_history}
          />

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package2 className="w-5 h-5 mr-2" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <div className="flex justify-between font-bold text-lg pt-4">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.customer_name}</p>
                {order.shipping_address && (
                  <>
                    <p>{order.shipping_address.street_address}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    {order.shipping_address.phone && (
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {order.shipping_address.phone}
                      </p>
                    )}
                  </>
                )}
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {order.customer_email}
                </p>
              </div>
              
              {order.tracking_number && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Tracking Number: {order.tracking_number}
                  </p>
                </div>
              )}
              
              {order.estimated_delivery_date && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="capitalize">{order.payment_status}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <OrderSupport orderId={order.id} />
        </div>
      </div>
    </div>
  );
};

export default DetailedOrderTracking;

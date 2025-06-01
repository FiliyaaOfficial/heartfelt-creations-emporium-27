
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShippingAddress } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

// Define a simplified order type for this component
interface OrderWithoutItems {
  id: string;
  created_at: string;
  shipping_address: ShippingAddress;
  total: number;
  items: any[];
}

const OrderConfirmation = () => {
  const [order, setOrder] = useState<OrderWithoutItems | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        // Get order from localStorage temporarily
        const orderData = localStorage.getItem(`order_${orderId}`);
        if (orderData) {
          const order = JSON.parse(orderData);
          setOrder(order);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
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

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-lg p-6 border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order Number:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Date:</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total Amount:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="capitalize">pending</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Shipping Details</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p><strong>Name:</strong> {order.shipping_address.full_name}</p>
            <p><strong>Address:</strong> {order.shipping_address.street_address}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/account">
            <Button>View Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

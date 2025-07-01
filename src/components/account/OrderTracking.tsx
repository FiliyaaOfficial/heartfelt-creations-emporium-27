
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  order: {
    id: string;
    status: string;
    created_at: string;
    total_amount: number;
    shipping_address: any;
  };
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'processing', label: 'Processing', completed: order.status !== 'pending' },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status.toLowerCase()) },
    { status: 'delivered', label: 'Delivered', completed: order.status.toLowerCase() === 'delivered' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Order Date:</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Amount:</span>
            <span>₹{order.total_amount}</span>
          </div>
          
          {/* Tracking Progress */}
          <div className="mt-6">
            <h4 className="font-medium mb-4">Order Progress</h4>
            <div className="space-y-3">
              {trackingSteps.map((step, index) => (
                <div key={step.status} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracking;

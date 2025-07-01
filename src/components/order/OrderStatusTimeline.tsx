
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Package, Truck, AlertCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  orderStatus: string;
  statusHistory?: Array<{
    status: string;
    status_message: string;
    created_at: string;
  }>;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ 
  orderStatus, 
  statusHistory = [] 
}) => {
  const getStatusIcon = (status: string, completed: boolean) => {
    const iconClass = completed ? "text-green-600" : "text-gray-400";
    
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className={`w-5 h-5 ${iconClass}`} />;
      case 'processing':
        return <Package className={`w-5 h-5 ${iconClass}`} />;
      case 'shipped':
        return <Truck className={`w-5 h-5 ${iconClass}`} />;
      case 'delivered':
        return <CheckCircle className={`w-5 h-5 ${iconClass}`} />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className={`w-5 h-5 ${iconClass}`} />;
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

  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => 
    step.key === orderStatus.toLowerCase()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Status</span>
          <Badge className={getStatusColor(orderStatus)}>
            <span className="capitalize">{orderStatus}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status Timeline */}
        <div className="space-y-4 mb-6">
          {statusSteps.map((step, index) => {
            const completed = index <= currentStatusIndex;
            const isActive = index === currentStatusIndex;
            
            return (
              <div key={step.key} className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  completed 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-gray-50 border-gray-300'
                }`}>
                  {getStatusIcon(step.key, completed)}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                  {isActive && (
                    <div className="text-sm text-blue-600">
                      Current Status
                    </div>
                  )}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`w-px h-8 ${
                    completed ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Status History */}
        {statusHistory.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Status Updates</h4>
            <div className="space-y-2">
              {statusHistory.slice().reverse().map((history, index) => (
                <div key={index} className="text-sm bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium capitalize">{history.status}</span>
                      {history.status_message && (
                        <p className="text-gray-600 mt-1">{history.status_message}</p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(history.created_at).toLocaleDateString()} {' '}
                      {new Date(history.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusTimeline;

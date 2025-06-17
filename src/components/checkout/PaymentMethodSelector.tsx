
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentMethodSelectorProps {
  loading: boolean;
  selectedGateway: string;
  currency: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  loading, 
  selectedGateway, 
  currency 
}) => {
  const getGatewayInfo = () => {
    if (selectedGateway === 'stripe') {
      return {
        name: 'Stripe',
        icon: <CreditCard className="h-5 w-5" />,
        description: 'International payments with credit/debit cards',
        methods: ['Visa', 'Mastercard', 'American Express']
      };
    } else {
      return {
        name: 'Razorpay',
        icon: <Smartphone className="h-5 w-5" />,
        description: 'Multiple payment options for India',
        methods: ['UPI', 'Cards', 'Net Banking', 'Wallets']
      };
    }
  };

  const gatewayInfo = getGatewayInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {gatewayInfo.icon}
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{gatewayInfo.name}</h3>
              <Badge variant="secondary">{currency}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{gatewayInfo.description}</p>
            <div className="flex flex-wrap gap-2">
              {gatewayInfo.methods.map((method) => (
                <Badge key={method} variant="outline" className="text-xs">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ Secure encrypted payments</p>
            <p>✓ Multiple payment options</p>
            <p>✓ Instant payment confirmation</p>
            {selectedGateway === 'razorpay' && (
              <p>✓ UPI, cards, wallets supported</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

interface PaymentMethodSelectorProps {
  loading: boolean;
  onPaymentMethodChange?: (method: string) => void;
  codAvailable?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  loading, 
  onPaymentMethodChange,
  codAvailable = true 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onPaymentMethodChange?.(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          {codAvailable && (
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Banknote className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </div>
              </Label>
            </div>
          )}
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value="razorpay" id="razorpay" />
            <Label htmlFor="razorpay" className="flex items-center space-x-3 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Online Payment</div>
                <div className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        {!codAvailable && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <Banknote className="h-4 w-4 inline mr-1" />
              Cash on Delivery is not available for this order
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;


import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PaymentMethodSelectorProps {
  loading: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ loading }) => {
  return (
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
  );
};

export default PaymentMethodSelector;


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ShippingAddress } from '@/types';
import PinCodeLookup from '@/utils/PinCodeLookup';

interface ShippingFormProps {
  shippingInfo: ShippingAddress;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCityStateChange: (city: string, state: string, postalCode: string) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ 
  shippingInfo, 
  handleInputChange,
  handleCityStateChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
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
              placeholder="Auto-filled from PIN code"
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
              placeholder="Auto-filled from PIN code"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;


import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PinCodeLookupProps {
  onCityStateChange: (city: string, state: string, postalCode: string) => void;
}

const PinCodeLookup: React.FC<PinCodeLookupProps> = ({ onCityStateChange }) => {
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPinCodeDetails = async (pin: string) => {
    if (pin.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.District;
        const state = postOffice.State;
        
        onCityStateChange(city, state, pin);
        toast.success('PIN code details fetched successfully');
      } else {
        toast.error('Invalid PIN code or details not found');
      }
    } catch (error) {
      console.error('Error fetching PIN code details:', error);
      toast.error('Failed to fetch PIN code details');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinCode(value);
    
    if (value.length === 6) {
      fetchPinCodeDetails(value);
    }
  };

  return (
    <div>
      <Label htmlFor="postal_code">PIN Code *</Label>
      <div className="flex gap-2">
        <Input 
          id="postal_code"
          name="postal_code"
          value={pinCode}
          onChange={handlePinCodeChange}
          placeholder="Enter 6-digit PIN code"
          maxLength={6}
          required
        />
        <Button
          type="button"
          onClick={() => fetchPinCodeDetails(pinCode)}
          disabled={isLoading || pinCode.length !== 6}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Checking...' : 'Verify'}
        </Button>
      </div>
    </div>
  );
};

export default PinCodeLookup;


import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PinCodeLookupProps {
  onCityStateChange: (city: string, state: string) => void;
}

const PinCodeLookup: React.FC<PinCodeLookupProps> = ({ onCityStateChange }) => {
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPincode(value);
    setError('');
    
    if (value.length === 6) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          onCityStateChange(postOffice.District, postOffice.State);
        } else {
          setError('Invalid PIN code');
          onCityStateChange('', '');
        }
      } catch (err) {
        setError('Failed to fetch location data');
        onCityStateChange('', '');
      } finally {
        setIsLoading(false);
      }
    } else if (value.length > 0) {
      onCityStateChange('', '');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pincode">PIN Code</Label>
      <Input
        id="pincode"
        type="text"
        placeholder="Enter 6-digit PIN code"
        value={pincode}
        onChange={handlePincodeChange}
        maxLength={6}
        className={error ? 'border-red-500' : ''}
      />
      {isLoading && <p className="text-xs text-muted-foreground">Looking up location...</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && pincode.length === 6 && !isLoading && (
        <p className="text-xs text-green-600">PIN code found</p>
      )}
    </div>
  );
};

export default PinCodeLookup;

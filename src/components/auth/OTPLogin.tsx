
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Phone, ArrowLeft } from 'lucide-react';

interface OTPLoginProps {
  onBack: () => void;
}

const OTPLogin: React.FC<OTPLoginProps> = ({ onBack }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) throw error;
      
      setOtpSent(true);
      toast.success('OTP sent to your phone number');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to other options
      </Button>

      {!otpSent ? (
        <form onSubmit={sendOTP} className="space-y-4">
          <div className="text-center mb-4">
            <Phone className="mx-auto h-12 w-12 text-heartfelt-burgundy mb-2" />
            <h3 className="text-lg font-semibold">Login with OTP</h3>
            <p className="text-sm text-gray-600">We'll send you a verification code</p>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="rounded-l-none"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
            disabled={loading || phone.length !== 10}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Enter Verification Code</h3>
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to +91{phone}
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setOtpSent(false)}
          >
            Change Phone Number
          </Button>
        </form>
      )}
    </div>
  );
};

export default OTPLogin;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OrderSupportProps {
  orderId: string;
}

const OrderSupport: React.FC<OrderSupportProps> = ({ orderId }) => {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitSupport = async () => {
    if (!issueType || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          user_id: user?.id,
          name: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || user?.email?.split('@')[0] || 'Customer',
          email: user?.email || '',
          subject: `Order Support - ${issueType}`,
          message: description,
          order_id: orderId,
          status: 'open'
        });

      if (error) throw error;

      toast.success('Support request submitted successfully');
      setIssueType('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error('Failed to submit support request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Need Help with This Order?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="issue-type">Issue Type</Label>
          <Select value={issueType} onValueChange={setIssueType}>
            <SelectTrigger>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery-delay">Delivery Delay</SelectItem>
              <SelectItem value="product-quality">Product Quality Issue</SelectItem>
              <SelectItem value="missing-items">Missing Items</SelectItem>
              <SelectItem value="return-request">Return Request</SelectItem>
              <SelectItem value="refund-request">Refund Request</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your issue in detail..."
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSubmitSupport} 
          disabled={loading}
          className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
        >
          {loading ? 'Submitting...' : 'Submit Support Request'}
        </Button>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">Or contact us directly:</p>
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-heartfelt-burgundy" />
              <span>+91 7050682347</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-heartfelt-burgundy" />
              <span>support@filiyaa.com</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSupport;

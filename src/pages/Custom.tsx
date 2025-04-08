// Import the needed types and other necessary imports
import { useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Custom = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    budget: '',
    deliveryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // In your component, update the form submission handler:
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make sure custom_orders exists in the database types
      const { error } = await supabase
        .from('custom_orders')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          delivery_date: formData.deliveryDate || null
        });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Request Submitted",
        description: "We've received your custom order request! Our team will contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        budget: '',
        deliveryDate: ''
      });
    } catch (error) {
      console.error('Error submitting custom order:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-8">Custom Order Request</h1>
          {success ? (
            <div className="text-center py-8">
              <p className="text-green-600 text-xl mb-4">Your request has been submitted successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description of Custom Order</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (Optional)</Label>
                <Input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Preferred Delivery Date (Optional)</Label>
                <Input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <Button type="submit" disabled={loading} className="w-full bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Custom;

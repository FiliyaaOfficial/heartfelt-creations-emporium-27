import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileInput } from '@/components/ui/file-input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const Custom = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    description: '',
    budget: '',
    timeline: '',
    additionalInfo: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    try {
      const newImageUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `custom-orders/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
          .from('custom-order-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image. Please try again.');
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from('custom-order-images')
          .getPublicUrl(filePath);

        newImageUrls.push(data.publicUrl);
      }

      setUploadedImages(prevImages => [...prevImages, ...newImageUrls]);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('custom_orders')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          product_description: formData.description,
          budget_range: formData.budget,
          occasion: formData.occasion,
          preferred_delivery_date: formData.timeline,
          special_instructions: formData.additionalInfo,
          status: 'pending',
          image_urls: uploadedImages,
          user_id: user?.id || null
        });

      if (error) {
        console.error('Error submitting custom order:', error);
        toast.error('Failed to submit your request. Please try again.');
        return;
      }

      toast.success('Your custom order request has been submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        occasion: '',
        description: '',
        budget: '',
        timeline: '',
        additionalInfo: ''
      });
      setUploadedImages([]);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Custom Order Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <Input
            type="text"
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Under ₹1000">Under ₹1000</SelectItem>
              <SelectItem value="₹1000 - ₹3000">₹1000 - ₹3000</SelectItem>
              <SelectItem value="₹3000 - ₹5000">₹3000 - ₹5000</SelectItem>
              <SelectItem value="₹5000+">₹5000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeline">Preferred Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="images">Upload Images</Label>
          <FileInput onChange={handleImageUpload} multiple />
          <div className="flex space-x-2 mt-2">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img src={imageUrl} alt={`Uploaded ${index}`} className="h-20 w-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
};

export default Custom;

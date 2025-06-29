import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileInput } from '@/components/ui/file-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { CalendarIcon, Upload, X, Palette, Sparkles } from 'lucide-react';

const Custom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    description: '',
    budget: '',
    additionalInfo: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImageUrls: string[] = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('custom-order-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data } = supabase.storage
          .from('custom-order-images')
          .getPublicUrl(filePath);

        newImageUrls.push(data.publicUrl);
      }

      if (newImageUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...newImageUrls]);
        toast.success(`Successfully uploaded ${newImageUrls.length} image(s)`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    toast.success('Image removed');
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
          preferred_delivery_date: date ? format(date, 'yyyy-MM-dd') : null,
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
      
      // Redirect to thank you page
      navigate('/thank-you?form=custom');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heartfelt-cream/20 via-white to-heartfelt-burgundy/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-8 h-8 text-heartfelt-burgundy" />
            <h1 className="text-4xl font-bold text-heartfelt-dark">Custom Order Request</h1>
            <Sparkles className="w-8 h-8 text-heartfelt-burgundy" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create something truly unique! Share your vision with us and we'll craft a personalized piece just for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-dark text-white rounded-t-lg">
              <CardTitle className="text-2xl font-semibold">Tell Us About Your Dream Product</CardTitle>
              <CardDescription className="text-heartfelt-cream">
                Fill out the form below with as much detail as possible to help us understand your vision
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-lg font-medium text-heartfelt-dark">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg font-medium text-heartfelt-dark">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg font-medium text-heartfelt-dark">Phone</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="occasion" className="text-lg font-medium text-heartfelt-dark">Occasion</Label>
                    <Input
                      type="text"
                      id="occasion"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                      placeholder="Wedding, Birthday, Anniversary, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-lg font-medium text-heartfelt-dark">Budget Range</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under ₹1000">Under ₹1,000</SelectItem>
                        <SelectItem value="₹1000 - ₹3000">₹1,000 - ₹3,000</SelectItem>
                        <SelectItem value="₹3000 - ₹5000">₹3,000 - ₹5,000</SelectItem>
                        <SelectItem value="₹5000 - ₹10000">₹5,000 - ₹10,000</SelectItem>
                        <SelectItem value="₹10000+">₹10,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <Label htmlFor="description" className="text-lg font-medium text-heartfelt-dark">
                    Product Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                    placeholder="Describe your dream product in detail. Include materials, colors, size, style preferences, and any specific features you want..."
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <Label className="text-lg font-medium text-heartfelt-dark">Preferred Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-2 border-2 border-heartfelt-cream hover:border-heartfelt-burgundy justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a delivery date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Additional Information */}
                <div>
                  <Label htmlFor="additionalInfo" className="text-lg font-medium text-heartfelt-dark">
                    Additional Information
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
                    placeholder="Any other details, special requests, or inspiration you'd like to share..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-lg font-medium text-heartfelt-dark">Reference Images</Label>
                  <p className="text-sm text-gray-600 mb-3">Upload images that inspire your vision (Max 5MB per image)</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FileInput 
                        onChange={handleImageUpload} 
                        multiple 
                        accept="image/*"
                        disabled={uploading}
                        className="border-2 border-dashed border-heartfelt-cream hover:border-heartfelt-burgundy"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        className="whitespace-nowrap border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </Button>
                    </div>
                    
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={imageUrl} 
                              alt={`Reference ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-lg border-2 border-heartfelt-cream shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={loading || uploading}
                    className="w-full bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-dark hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white py-6 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting Request...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Submit Custom Order Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Custom;

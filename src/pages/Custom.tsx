
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Heart, Clock, CheckCircle, Upload, Image, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  description: z.string().min(10, 'Please provide more details about your custom order'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const Custom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
  });

  const selectedBudget = watch('budget');
  const selectedTimeline = watch('timeline');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + inspirationImages.length > 3) {
      toast.error('You can upload maximum 3 images');
      return;
    }
    setInspirationImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Use type assertion for the table that doesn't exist in types yet
      const { error } = await (supabase as any)
        .from('custom_orders')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          description: data.description,
          budget: data.budget ? parseFloat(data.budget) : null,
          timeline: data.timeline || null,
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Custom order request submitted successfully!');
    } catch (error) {
      console.error('Error submitting custom order:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-semibold mb-4">Request Submitted!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your custom order request. We'll review your requirements and get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} className="mr-4">
            Submit Another Request
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-heartfelt-cream/30 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Custom Orders</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have something special in mind? Let us create a unique, personalized piece just for you. 
            Our artisans love bringing your vision to life.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-semibold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-heartfelt-burgundy rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold mb-2">Share Your Vision</h3>
              <p className="text-sm text-muted-foreground">Tell us about your idea, upload inspiration images, and share your requirements</p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="text-heartfelt-burgundy" size={24} />
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-heartfelt-burgundy rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold mb-2">We Design</h3>
              <p className="text-sm text-muted-foreground">Our artisans create a detailed proposal with sketches and pricing within 24 hours</p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="text-heartfelt-burgundy" size={24} />
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-heartfelt-burgundy rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold mb-2">We Craft</h3>
              <p className="text-sm text-muted-foreground">Once approved, we handcraft your unique piece with love and attention to detail</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-heartfelt-cream">
            <CardHeader>
              <div className="w-16 h-16 bg-heartfelt-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette size={24} className="text-heartfelt-burgundy" />
              </div>
              <CardTitle>Personalized Design</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work directly with our artisans to create something uniquely yours, tailored to your style and preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-heartfelt-cream">
            <CardHeader>
              <div className="w-16 h-16 bg-heartfelt-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-heartfelt-burgundy" />
              </div>
              <CardTitle>Meaningful Gifts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create meaningful gifts that tell a story, commemorate special moments, or express your deepest feelings.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-heartfelt-cream">
            <CardHeader>
              <div className="w-16 h-16 bg-heartfelt-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-heartfelt-burgundy" />
              </div>
              <CardTitle>Flexible Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We work with your schedule, whether you need something in a week or have months to perfect every detail.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-heartfelt-cream shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Tell Us About Your Vision</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours with ideas and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      {...register('name')} 
                      className={errors.name ? 'border-red-300' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register('email')} 
                      className={errors.email ? 'border-red-300' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" {...register('phone')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Vision *</Label>
                  <Textarea 
                    id="description" 
                    rows={5}
                    placeholder="Tell us about what you have in mind. Include details about size, materials, colors, occasion, or any specific requirements..."
                    {...register('description')}
                    className={errors.description ? 'border-red-300' : ''}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message as string}</p>}
                </div>

                {/* Inspiration Images Upload */}
                <div className="space-y-4">
                  <Label>Inspiration Images (Optional)</Label>
                  <div className="border-2 border-dashed border-heartfelt-cream rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-heartfelt-burgundy mb-4" />
                        <p className="text-lg font-medium mb-2">Upload inspiration images</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Share photos of designs, colors, or styles you like (max 3 images)
                        </p>
                        <Button type="button" variant="outline" className="border-heartfelt-burgundy text-heartfelt-burgundy">
                          <Image className="mr-2 h-4 w-4" />
                          Choose Images
                        </Button>
                      </div>
                    </label>
                  </div>
                  
                  {inspirationImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {inspirationImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Inspiration ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Budget Range (Optional)</Label>
                    <Select onValueChange={(value) => setValue('budget', value)} value={selectedBudget}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="under-50">Under ₹50</SelectItem>
                        <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                        <SelectItem value="100-250">₹100 - ₹250</SelectItem>
                        <SelectItem value="250-500">₹250 - ₹500</SelectItem>
                        <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                        <SelectItem value="over-1000">Over ₹1,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timeline (Optional)</Label>
                    <Select onValueChange={(value) => setValue('timeline', value)} value={selectedTimeline}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="rush">Rush (1-2 weeks)</SelectItem>
                        <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
                        <SelectItem value="flexible">Flexible (1-2 months)</SelectItem>
                        <SelectItem value="no-rush">No rush (2+ months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Submit Custom Order Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Custom;

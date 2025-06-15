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
import { 
  Palette, Heart, Clock, CheckCircle, Upload, Image, ArrowRight, 
  MessageSquare, Sparkles, Star, Gift, Calendar, Users, Crown,
  Scissors, Paintbrush, Package
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  occasion: z.string().min(1, 'Please select an occasion or purpose'),
  description: z.string().min(10, 'Please provide more details about your custom order'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const Custom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
  });

  const selectedBudget = watch('budget');
  const selectedTimeline = watch('timeline');
  const selectedOccasion = watch('occasion');

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

  const uploadImages = async (): Promise<string[]> => {
    if (inspirationImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of inspirationImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `inspiration/${fileName}`;

        console.log('Uploading file:', fileName);

        const { data, error } = await supabase.storage
          .from('custom-order-images')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('custom-order-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
        console.log('File uploaded successfully:', publicUrlData.publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log('Form data being submitted:', data);
    
    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (inspirationImages.length > 0) {
        console.log('Uploading images...');
        imageUrls = await uploadImages();
        console.log('Images uploaded:', imageUrls);
      }

      const insertData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        occasion: data.occasion,
        description: data.description,
        budget: data.budget ? parseFloat(data.budget.replace(/[^\d.]/g, '')) : null,
        timeline: data.timeline || null,
        status: 'pending',
        image_urls: imageUrls
      };

      console.log('Insert data:', insertData);

      const { data: result, error } = await supabase
        .from('custom_orders')
        .insert(insertData)
        .select();

      console.log('Supabase response:', { result, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Custom order inserted successfully:', result);
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
      <div className="min-h-screen bg-gradient-to-br from-heartfelt-cream/20 via-white to-heartfelt-pink/10 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="relative">
            <div className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <CheckCircle size={48} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star size={16} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-heartfelt-burgundy via-heartfelt-pink to-heartfelt-burgundy bg-clip-text text-transparent">
            Your Vision is Now in Expert Hands
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Thank you for trusting us with your custom creation. Our master artisans will review your requirements and craft a personalized proposal within 24 hours.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-heartfelt-cream/50 shadow-lg">
            <p className="text-heartfelt-burgundy font-semibold mb-2">What happens next?</p>
            <div className="text-left space-y-2 text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-heartfelt-pink rounded-full mr-3"></div>
                <span>Design consultation within 24 hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-heartfelt-pink rounded-full mr-3"></div>
                <span>Detailed proposal with sketches & pricing</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-heartfelt-pink rounded-full mr-3"></div>
                <span>Revision rounds until perfection</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setSubmitted(false)} 
              className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              Submit Another Request
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="border-2 border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-heartfelt-cream/20 via-white to-heartfelt-pink/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-heartfelt-burgundy/5 to-heartfelt-pink/5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-heartfelt-cream/50 shadow-lg">
              <Crown className="w-5 h-5 text-heartfelt-burgundy mr-2" />
              <span className="text-heartfelt-burgundy font-semibold">Bespoke Creations</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 bg-gradient-to-r from-heartfelt-burgundy via-heartfelt-pink to-heartfelt-burgundy bg-clip-text text-transparent leading-tight">
              Crafted Just for You
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Transform your vision into a masterpiece. Our artisans blend traditional craftsmanship 
              with modern elegance to create something uniquely yours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Paintbrush className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-heartfelt-burgundy mb-2">Artisan Crafted</h3>
                <p className="text-gray-600 text-sm">Hand-made by skilled artisans with decades of experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-heartfelt-burgundy mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">Only the finest materials and attention to detail</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-heartfelt-burgundy mb-2">Deeply Personal</h3>
                <p className="text-gray-600 text-sm">Every piece tells your unique story</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-heartfelt-burgundy">
            Your Journey to Perfection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From initial concept to final creation, we guide you through every step of the artisan process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              number: "01",
              icon: MessageSquare,
              title: "Share Your Vision",
              description: "Tell us your story, inspiration, and dreams. Upload reference images and share every detail that matters to you.",
              features: ["Detailed consultation", "Inspiration gallery", "Personal preferences"]
            },
            {
              number: "02",
              icon: Palette,
              title: "Design & Proposal",
              description: "Our master designers create detailed sketches, material samples, and comprehensive proposals tailored to your vision.",
              features: ["Custom sketches", "Material selection", "Detailed pricing"]
            },
            {
              number: "03",
              icon: Scissors,
              title: "Artisan Crafting",
              description: "Skilled artisans bring your design to life using traditional techniques and premium materials with meticulous attention to detail.",
              features: ["Hand-crafted quality", "Progress updates", "Quality assurance"]
            },
            {
              number: "04",
              icon: Package,
              title: "Perfect Delivery",
              description: "Your masterpiece is carefully packaged and delivered with premium presentation, ready to create unforgettable moments.",
              features: ["Luxury packaging", "Secure delivery", "Satisfaction guarantee"]
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-heartfelt-cream/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-heartfelt-cream">
                      <span className="text-xs font-bold text-heartfelt-burgundy">{step.number}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-heartfelt-burgundy mb-4 text-center">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-center">{step.description}</p>
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-heartfelt-pink rounded-full mr-3 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-heartfelt-cream">
                    <ArrowRight className="w-4 h-4 text-heartfelt-burgundy" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-heartfelt-cream/50 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-heartfelt-burgundy/5 to-heartfelt-pink/5 p-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-heartfelt-burgundy mb-4">
                  Tell Us About Your Vision
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Share your ideas, inspiration, and requirements. The more details you provide, 
                  the better we can bring your vision to life.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 rounded-2xl p-6 border border-heartfelt-cream/30">
                  <h3 className="text-xl font-serif font-semibold text-heartfelt-burgundy mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
                      <Input 
                        id="name" 
                        {...register('name')} 
                        className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-heartfelt-burgundy'} bg-white/80`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-sm text-red-500 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.name.message as string}
                      </p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register('email')} 
                        className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-heartfelt-burgundy'} bg-white/80`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-sm text-red-500 flex items-center mt-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email.message as string}
                      </p>}
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      {...register('phone')} 
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-heartfelt-burgundy transition-all duration-300 bg-white/80"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Occasion & Purpose */}
                <div className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 rounded-2xl p-6 border border-heartfelt-cream/30">
                  <h3 className="text-xl font-serif font-semibold text-heartfelt-burgundy mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Occasion & Purpose
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">What's the occasion? *</Label>
                    <Select onValueChange={(value) => setValue('occasion', value)} value={selectedOccasion}>
                      <SelectTrigger className={`h-12 rounded-xl border-2 transition-all duration-300 ${errors.occasion ? 'border-red-300' : 'border-gray-200 focus:border-heartfelt-burgundy'} bg-white/80`}>
                        <SelectValue placeholder="Select the occasion or purpose" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-gray-100 shadow-xl">
                        <SelectItem value="birthday">🎂 Birthday Celebration</SelectItem>
                        <SelectItem value="anniversary">💕 Anniversary</SelectItem>
                        <SelectItem value="wedding">💒 Wedding</SelectItem>
                        <SelectItem value="engagement">💍 Engagement</SelectItem>
                        <SelectItem value="valentine">❤️ Valentine's Day</SelectItem>
                        <SelectItem value="mothers-day">🌸 Mother's Day</SelectItem>
                        <SelectItem value="fathers-day">👔 Father's Day</SelectItem>
                        <SelectItem value="graduation">🎓 Graduation</SelectItem>
                        <SelectItem value="new-baby">👶 New Baby</SelectItem>
                        <SelectItem value="housewarming">🏠 Housewarming</SelectItem>
                        <SelectItem value="retirement">🎉 Retirement</SelectItem>
                        <SelectItem value="thank-you">🙏 Thank You Gift</SelectItem>
                        <SelectItem value="corporate">🏢 Corporate Gift</SelectItem>
                        <SelectItem value="holiday">🎄 Holiday/Festival</SelectItem>
                        <SelectItem value="just-because">✨ Just Because</SelectItem>
                        <SelectItem value="other">🎁 Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.occasion && <p className="text-sm text-red-500 flex items-center mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.occasion.message as string}
                    </p>}
                  </div>
                </div>

                {/* Vision Description */}
                <div className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 rounded-2xl p-6 border border-heartfelt-cream/30">
                  <h3 className="text-xl font-serif font-semibold text-heartfelt-burgundy mb-6 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Your Vision
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Describe Your Vision *</Label>
                    <Textarea 
                      id="description" 
                      rows={6}
                      placeholder="Paint us a picture with words... What do you envision? Include details about size, materials, colors, style, special features, or any specific requirements. The more details you share, the better we can bring your vision to life."
                      {...register('description')}
                      className={`rounded-xl border-2 transition-all duration-300 ${errors.description ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-heartfelt-burgundy'} resize-none bg-white/80 leading-relaxed`}
                    />
                    {errors.description && <p className="text-sm text-red-500 flex items-center mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.description.message as string}
                    </p>}
                  </div>
                </div>

                {/* Inspiration Images */}
                <div className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 rounded-2xl p-6 border border-heartfelt-cream/30">
                  <h3 className="text-xl font-serif font-semibold text-heartfelt-burgundy mb-6 flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Inspiration Gallery
                  </h3>
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-gray-700">Upload Inspiration Images (Optional)</Label>
                    <div className="border-2 border-dashed border-heartfelt-cream/60 rounded-2xl p-8 text-center bg-white/50 hover:bg-white/70 transition-all duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImages || isSubmitting}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-lg font-semibold text-heartfelt-burgundy mb-2">Share Your Inspiration</p>
                          <p className="text-sm text-gray-600 mb-4 max-w-md">
                            Upload photos of designs, colors, textures, or styles that inspire you. Help us understand your aesthetic preferences.
                          </p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="border-2 border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white rounded-xl transition-all duration-300"
                            disabled={uploadingImages || isSubmitting}
                          >
                            <Image className="mr-2 h-4 w-4" />
                            {uploadingImages ? 'Uploading...' : 'Choose Images (Max 3)'}
                          </Button>
                        </div>
                      </label>
                    </div>
                    
                    {inspirationImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {inspirationImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Inspiration ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl border border-heartfelt-cream shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100"
                              disabled={uploadingImages || isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 rounded-2xl p-6 border border-heartfelt-cream/30">
                  <h3 className="text-xl font-serif font-semibold text-heartfelt-burgundy mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Budget & Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Budget Range (Optional)</Label>
                      <Select onValueChange={(value) => setValue('budget', value)} value={selectedBudget}>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-heartfelt-burgundy transition-all duration-300 bg-white/80">
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-gray-100 shadow-xl">
                          <SelectItem value="under-50">Under ₹50</SelectItem>
                          <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                          <SelectItem value="100-250">₹100 - ₹250</SelectItem>
                          <SelectItem value="250-500">₹250 - ₹500</SelectItem>
                          <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                          <SelectItem value="1000-2500">₹1,000 - ₹2,500</SelectItem>
                          <SelectItem value="over-2500">Over ₹2,500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Timeline (Optional)</Label>
                      <Select onValueChange={(value) => setValue('timeline', value)} value={selectedTimeline}>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-heartfelt-burgundy transition-all duration-300 bg-white/80">
                          <SelectValue placeholder="When do you need this?" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-gray-100 shadow-xl">
                          <SelectItem value="rush">🚀 Rush (1-2 weeks) - Additional charges may apply</SelectItem>
                          <SelectItem value="standard">⚡ Standard (3-4 weeks) - Most popular</SelectItem>
                          <SelectItem value="flexible">🌱 Flexible (1-2 months) - Best value</SelectItem>
                          <SelectItem value="no-rush">🎨 No rush (2+ months) - Perfect craftsmanship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || uploadingImages}
                    className="w-full h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-3 h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                        {uploadingImages ? 'Uploading Images...' : 'Crafting Your Request...'}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="mr-3 h-6 w-6" />
                        Begin Your Custom Journey
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </div>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    By submitting, you agree to our terms of service and privacy policy
                  </p>
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

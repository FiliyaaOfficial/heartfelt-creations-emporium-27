
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Check, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  giftType: z.string().min(2, { message: "Please specify the type of gift" }),
  budget: z.string().min(1, { message: "Please provide your budget" }),
  occasion: z.string().min(2, { message: "Please specify the occasion" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const Custom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          name: data.name,
          email: data.email,
          subject: `Custom Order Request: ${data.giftType}`,
          message: `
            Gift Type: ${data.giftType}
            Budget: ${data.budget}
            Occasion: ${data.occasion}
            Phone: ${data.phone || 'Not provided'}
            
            Description:
            ${data.description}
          `,
        });

      if (error) throw error;
      
      setIsSubmitted(true);
      reset();
      
      toast({
        title: "Request submitted successfully",
        description: "We'll contact you shortly to discuss your custom order.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error submitting your request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-filiyaa-peach-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Custom Order Request</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let us create something uniquely special for your loved ones. Share your vision with us, and our artisans will craft a memorable gift just for you.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="bg-filiyaa-peach-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6">
                <Check size={40} className="text-filiyaa-peach-600" />
              </div>
              <h2 className="text-2xl font-serif font-medium mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your custom order request has been submitted successfully. Our team will review your requirements and get back to you within 24-48 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
                Submit Another Request
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="name" {...register("name")} className={errors.name ? "border-red-300" : ""} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-300" : ""} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" {...register("phone")} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="giftType">Type of Gift <span className="text-red-500">*</span></Label>
                    <Input id="giftType" placeholder="e.g. Custom Bouquet, Embroidery Art, Gift Hamper" {...register("giftType")} className={errors.giftType ? "border-red-300" : ""} />
                    {errors.giftType && <p className="text-sm text-red-500">{errors.giftType.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Your Budget <span className="text-red-500">*</span></Label>
                    <Input id="budget" placeholder="e.g. ₹1,000 - ₹2,000" {...register("budget")} className={errors.budget ? "border-red-300" : ""} />
                    {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="occasion">Occasion <span className="text-red-500">*</span></Label>
                    <Input id="occasion" placeholder="e.g. Birthday, Anniversary, Wedding" {...register("occasion")} className={errors.occasion ? "border-red-300" : ""} />
                    {errors.occasion && <p className="text-sm text-red-500">{errors.occasion.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Custom Order <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description" 
                    rows={5} 
                    placeholder="Please provide details about what you're looking for, including colors, themes, recipients, and any special requirements."
                    {...register("description")}
                    className={errors.description ? "border-red-300" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600 py-6"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Gift size={18} className="mr-2" />
                        Submit Custom Order Request
                        <ArrowRight size={16} className="ml-2" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-filiyaa-peach-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-filiyaa-peach-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Submit Your Request</h3>
              <p className="text-muted-foreground">Fill out the form with your custom gift requirements and budget.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-filiyaa-peach-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-filiyaa-peach-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Personalized Consultation</h3>
              <p className="text-muted-foreground">Our team will reach out to discuss details and provide a quote.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="bg-filiyaa-peach-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-filiyaa-peach-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Crafting Your Gift</h3>
              <p className="text-muted-foreground">Once approved, our artisans will create your unique gift with care.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;

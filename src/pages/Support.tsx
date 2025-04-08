
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Phone, Mail, Clock, MapPin, Check, Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const Support = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
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
          subject: data.subject,
          message: data.message,
        });

      if (error) throw error;
      
      setIsSubmitted(true);
      reset();
      
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending your message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectSelect = (value: string) => {
    setValue("subject", value);
  };

  const faqItems = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within India. Express shipping options are available at checkout for faster delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for most products. Custom and personalized items cannot be returned unless damaged. Please contact our support team to initiate a return."
    },
    {
      question: "Are gift wrapping services available?",
      answer: "Yes, we offer premium gift wrapping for all products at a nominal charge. You can select this option at checkout and even add a personalized message."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also view your order status by logging into your account on our website."
    },
    {
      question: "Can I modify my order after placing it?",
      answer: "Orders can be modified within 2 hours of placement. Please contact our support team immediately if you need to make changes."
    }
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Customer Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Reach out with any questions, concerns, or feedback about our products and services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-serif font-medium mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="bg-filiyaa-peach-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Check size={32} className="text-filiyaa-peach-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We'll respond to your inquiry within 24 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
                    Send Another Message
                  </Button>
                </div>
              ) : (
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                    <Select onValueChange={handleSubjectSelect}>
                      <SelectTrigger className={errors.subject ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Order Inquiry">Order Inquiry</SelectItem>
                        <SelectItem value="Product Question">Product Question</SelectItem>
                        <SelectItem value="Shipping Question">Shipping Question</SelectItem>
                        <SelectItem value="Return Request">Return Request</SelectItem>
                        <SelectItem value="Feedback">Feedback</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="subject"
                      placeholder="Or type your own subject"
                      {...register("subject")}
                      className={`mt-2 ${errors.subject ? "border-red-300" : ""}`}
                    />
                    {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="message" 
                      rows={5}
                      {...register("message")}
                      className={errors.message ? "border-red-300" : ""}
                    />
                    {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send size={18} className="mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact Info & FAQs */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-serif font-medium mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-3 mr-4">
                    <Phone size={20} className="text-filiyaa-peach-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone Support</h3>
                    <p className="text-muted-foreground">+91 9876543210</p>
                    <p className="text-sm text-muted-foreground mt-1">Monday to Saturday, 9am-6pm IST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-3 mr-4">
                    <Mail size={20} className="text-filiyaa-peach-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Support</h3>
                    <p className="text-muted-foreground">support@filiyaa.com</p>
                    <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-3 mr-4">
                    <Clock size={20} className="text-filiyaa-peach-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">Monday to Friday: 9am - 6pm IST</p>
                    <p className="text-muted-foreground">Saturday: 10am - 4pm IST</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-filiyaa-peach-100 rounded-full p-3 mr-4">
                    <MapPin size={20} className="text-filiyaa-peach-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Office Address</h3>
                    <p className="text-muted-foreground">123 Creative Lane,</p>
                    <p className="text-muted-foreground">Craft District, Bangalore - 560001</p>
                    <p className="text-muted-foreground">Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-filiyaa-peach-50 rounded-2xl p-8">
              <h2 className="text-xl font-serif font-medium mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Shipping Policy
                </Button>
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Return Policy
                </Button>
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Terms & Conditions
                </Button>
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Privacy Policy
                </Button>
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Track Order
                </Button>
                <Button variant="ghost" className="justify-start hover:bg-filiyaa-peach-100 hover:text-filiyaa-peach-700">
                  Custom Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium flex items-center mb-2">
                  <MessageCircle size={18} className="text-filiyaa-peach-500 mr-2" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

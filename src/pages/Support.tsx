import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Phone, Mail, Clock, MapPin, Send, MessageCircle, ShoppingBag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type SupportMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type OrderType = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

const Support = () => {
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [orderHistory, setOrderHistory] = useState<OrderType[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact");
  const { toast } = useToast();
  
  const { register, handleSubmit: hookFormSubmit, formState: { errors }, reset, setValue } = useForm<SupportMessage>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrderHistory();
    }
  }, [activeTab]);

  const fetchOrderHistory = async () => {
    setIsLoadingOrders(true);
    try {
      const sessionId = localStorage.getItem("filiyaa_session_id");
      if (!sessionId) {
        setOrderHistory([]);
        return;
      }

      // Use type assertion for the table that doesn't exist in types yet
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrderHistory(data || []);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast({
        title: "Error loading orders",
        description: "There was a problem loading your order history.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSubjectSelect = (value: string) => {
    setSelectedSubject(value);
    setValue('subject', value);
  };
  
  const onSubmit = async (values: SupportMessage) => {
    setSubmitting(true);
    try {
      // Use type assertion for the table that doesn't exist in types yet
      const { error } = await (supabase as any)
        .from('support_messages')
        .insert({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        });
      
      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      reset();
      setSelectedSubject(undefined);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('contact');
    setValue('subject', 'Order Issue');
    setSelectedSubject('Order Issue');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-heartfelt-cream/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-2xl mb-6 shadow-lg">
            <MessageCircle size={28} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink bg-clip-text text-transparent">
            Customer Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to help! Reach out with any questions, concerns, or feedback about our products and services.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-gray-100">
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-heartfelt-burgundy data-[state=active]:to-heartfelt-pink data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-base py-3 px-6 transition-all duration-300 rounded-xl"
              >
                Contact Us
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-heartfelt-burgundy data-[state=active]:to-heartfelt-pink data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-base py-3 px-6 transition-all duration-300 rounded-xl"
              >
                My Orders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form - Takes 2/3 of the space */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-white/50">
                    <h2 className="text-3xl font-serif font-bold mb-8 text-heartfelt-burgundy">
                      {selectedOrderId ? 'Contact About Order' : 'Send Us a Message'}
                    </h2>
                    
                    {submitting ? (
                      <div className="text-center py-16">
                        <div className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 shadow-lg">
                          <Check size={40} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-heartfelt-burgundy">Message Sent!</h3>
                        <p className="text-gray-600 mb-8 text-lg">
                          Thank you for reaching out. We'll respond to your inquiry within 24 hours.
                        </p>
                        <Button 
                          onClick={() => setSubmitting(false)} 
                          className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-8">
                        {selectedOrderId && (
                          <div className="bg-gradient-to-r from-heartfelt-cream/40 to-heartfelt-pink/10 p-6 rounded-2xl mb-8 border border-heartfelt-cream/50">
                            <p className="font-semibold flex items-center text-heartfelt-burgundy text-lg">
                              <ShoppingBag size={20} className="mr-3" />
                              Regarding Order: #{selectedOrderId.substring(0, 8)}
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                            <Input 
                              id="name" 
                              {...register("name")} 
                              className={`h-12 rounded-xl border-2 ${errors.name ? "border-red-300" : "border-gray-200"} focus:border-heartfelt-burgundy transition-colors`} 
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                            <Input 
                              id="email" 
                              type="email" 
                              {...register("email")} 
                              className={`h-12 rounded-xl border-2 ${errors.email ? "border-red-300" : "border-gray-200"} focus:border-heartfelt-burgundy transition-colors`} 
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject <span className="text-red-500">*</span></Label>
                          <Select onValueChange={handleSubjectSelect} value={selectedSubject}>
                            <SelectTrigger className={`h-12 rounded-xl border-2 ${errors.subject ? "border-red-300" : "border-gray-200"} focus:border-heartfelt-burgundy`}>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border-2 border-gray-100 shadow-xl">
                              <SelectItem value="Order Inquiry">Order Inquiry</SelectItem>
                              <SelectItem value="Product Question">Product Question</SelectItem>
                              <SelectItem value="Shipping Question">Shipping Question</SelectItem>
                              <SelectItem value="Return Request">Return Request</SelectItem>
                              <SelectItem value="Order Issue">Order Issue</SelectItem>
                              <SelectItem value="Feedback">Feedback</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="subject"
                            placeholder="Or type your own subject"
                            {...register("subject")}
                            className={`h-12 rounded-xl border-2 ${errors.subject ? "border-red-300" : "border-gray-200"} focus:border-heartfelt-burgundy transition-colors`}
                          />
                          {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>}
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message <span className="text-red-500">*</span></Label>
                          <Textarea 
                            id="message" 
                            rows={6}
                            {...register("message")}
                            className={`rounded-xl border-2 ${errors.message ? "border-red-300" : "border-gray-200"} focus:border-heartfelt-burgundy transition-colors resize-none`}
                          />
                          {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full h-14 bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          {submitting ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Send size={20} className="mr-3" />
                              Send Message
                            </div>
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
                
                {/* Contact Info & Quick Links - Takes 1/3 of the space, smaller and more compact */}
                <div className="space-y-6">
                  {/* Compact Contact Info */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-serif font-bold text-heartfelt-burgundy mb-6 text-center">Get in Touch</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 rounded-2xl bg-gradient-to-r from-heartfelt-burgundy/5 to-heartfelt-pink/5 border border-heartfelt-cream/30">
                        <div className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-full p-2 mr-3 shadow-md">
                          <Phone size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-heartfelt-burgundy">Phone</p>
                          <p className="text-sm text-gray-600 truncate">+91 7050682347</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-2xl bg-gradient-to-r from-heartfelt-burgundy/5 to-heartfelt-pink/5 border border-heartfelt-cream/30">
                        <div className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-full p-2 mr-3 shadow-md">
                          <Mail size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-heartfelt-burgundy">Email</p>
                          <p className="text-sm text-gray-600 truncate">support@heartfelt.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 rounded-2xl bg-gradient-to-r from-heartfelt-burgundy/5 to-heartfelt-pink/5 border border-heartfelt-cream/30">
                        <div className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink rounded-full p-2 mr-3 shadow-md">
                          <Clock size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-heartfelt-burgundy">Hours</p>
                          <p className="text-sm text-gray-600">Mon-Sat: 9am-6pm</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Time Badge */}
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-full text-xs font-semibold border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Response: 2 hours
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Links */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                    <h2 className="text-xl font-serif font-bold text-heartfelt-burgundy mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {['Shipping Policy', 'Return Policy', 'Terms & Conditions', 'Privacy Policy', 'Track Order', 'Custom Orders'].map((link, index) => (
                        <Button 
                          key={index}
                          variant="ghost" 
                          className="justify-start h-10 text-sm hover:bg-gradient-to-r hover:from-heartfelt-burgundy/10 hover:to-heartfelt-pink/10 hover:text-heartfelt-burgundy transition-all duration-300 rounded-xl"
                        >
                          {link}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold text-heartfelt-burgundy">Your Order History</h2>
                  <Button 
                    onClick={fetchOrderHistory} 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-2 border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white rounded-xl transition-all duration-300"
                  >
                    <Search size={16} /> Refresh
                  </Button>
                </div>

                {isLoadingOrders ? (
                  <div className="flex justify-center py-16">
                    <div className="animate-spin h-12 w-12 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div>
                  </div>
                ) : orderHistory.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-heartfelt-cream/20 rounded-2xl border border-gray-100">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-heartfelt-burgundy">No Orders Found</h3>
                    <p className="text-gray-600 mb-8 text-lg">You haven't placed any orders yet.</p>
                    <Button className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orderHistory.map(order => (
                      <Card key={order.id} className="overflow-hidden hover:border-heartfelt-burgundy/50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl border-2">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-heartfelt-cream/20 p-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg font-bold text-heartfelt-burgundy">
                                Order #{order.id.substring(0, 8)}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                Placed on {formatDate(order.created_at)}
                              </CardDescription>
                            </div>
                            <div>
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-lg text-heartfelt-burgundy">Total: {formatCurrency(order.total_amount)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 p-6 pt-0 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-2 border-gray-300 hover:border-heartfelt-burgundy hover:text-heartfelt-burgundy rounded-xl transition-all duration-300"
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-pink hover:from-heartfelt-dark hover:to-heartfelt-burgundy text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
                            onClick={() => handleSelectOrder(order.id)}
                          >
                            Contact Support
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-heartfelt-burgundy mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold flex items-center mb-3 text-heartfelt-burgundy">
                  <MessageCircle size={20} className="mr-3 text-heartfelt-pink" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

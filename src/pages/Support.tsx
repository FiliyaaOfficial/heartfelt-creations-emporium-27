
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
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Customer Support</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Reach out with any questions, concerns, or feedback about our products and services.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm font-medium transition-all duration-200 rounded-md"
              >
                Contact Us
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-heartfelt-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm font-medium transition-all duration-200 rounded-md"
              >
                My Orders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-serif font-medium mb-6">
                      {selectedOrderId ? 'Contact About Order' : 'Send Us a Message'}
                    </h2>
                    
                    {submitting ? (
                      <div className="text-center py-10">
                        <div className="bg-heartfelt-cream w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6">
                          <Check size={32} className="text-heartfelt-burgundy" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-6">
                          Thank you for reaching out. We'll respond to your inquiry within 24 hours.
                        </p>
                        <Button onClick={() => setSubmitting(false)} className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-6">
                        {selectedOrderId && (
                          <div className="bg-heartfelt-cream/30 p-4 rounded-lg mb-6">
                            <p className="font-medium flex items-center">
                              <ShoppingBag size={18} className="mr-2 text-heartfelt-burgundy" />
                              Regarding Order: #{selectedOrderId.substring(0, 8)}
                            </p>
                          </div>
                        )}
                        
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
                          <Select onValueChange={handleSubjectSelect} value={selectedSubject}>
                            <SelectTrigger className={errors.subject ? "border-red-300" : ""}>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
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
                          disabled={submitting}
                          className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                        >
                          {submitting ? (
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
                  <div className="bg-gradient-to-br from-heartfelt-cream/10 to-heartfelt-pink/5 rounded-3xl shadow-lg p-8 border border-heartfelt-cream/50 backdrop-blur-sm">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-serif font-medium text-heartfelt-burgundy mb-2">Get in Touch</h2>
                      <p className="text-muted-foreground">We're here to help you every step of the way</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="group hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-heartfelt-burgundy to-heartfelt-pink rounded-full p-4 mr-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Phone size={22} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-heartfelt-burgundy">Phone Support</h3>
                            <p className="text-xl font-medium text-gray-800 mb-1">+91 7050682347</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              Monday to Saturday, 9am-6pm IST
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-heartfelt-burgundy to-heartfelt-pink rounded-full p-4 mr-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Mail size={22} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-heartfelt-burgundy">Email Support</h3>
                            <p className="text-xl font-medium text-gray-800 mb-1">support@heartfelt.com</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              We respond within 24 hours
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-heartfelt-burgundy to-heartfelt-pink rounded-full p-4 mr-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Clock size={22} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-heartfelt-burgundy">Business Hours</h3>
                            <div className="space-y-1 text-gray-700">
                              <p className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span className="font-medium">9am - 6pm IST</span>
                              </p>
                              <p className="flex justify-between">
                                <span>Saturday</span>
                                <span className="font-medium">10am - 4pm IST</span>
                              </p>
                              <p className="flex justify-between">
                                <span>Sunday</span>
                                <span className="font-medium text-muted-foreground">Closed</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-heartfelt-burgundy to-heartfelt-pink rounded-full p-4 mr-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <MapPin size={22} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-heartfelt-burgundy">Visit Our Studio</h3>
                            <div className="text-gray-700 leading-relaxed">
                              <p className="font-medium">123 Creative Lane</p>
                              <p>Craft District, Bangalore - 560001</p>
                              <p>Karnataka, India</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Time Badge */}
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Average response time: 2 hours
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Links */}
                  <div className="bg-heartfelt-cream/20 rounded-2xl p-8">
                    <h2 className="text-xl font-serif font-medium mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Shipping Policy
                      </Button>
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Return Policy
                      </Button>
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Terms & Conditions
                      </Button>
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Privacy Policy
                      </Button>
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Track Order
                      </Button>
                      <Button variant="ghost" className="justify-start hover:bg-heartfelt-cream hover:text-heartfelt-burgundy">
                        Custom Orders
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-medium">Your Order History</h2>
                  <Button onClick={fetchOrderHistory} variant="outline" size="sm" className="flex items-center gap-1">
                    <Search size={16} /> Refresh
                  </Button>
                </div>

                {isLoadingOrders ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-10 w-10 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div>
                  </div>
                ) : orderHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                    <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map(order => (
                      <Card key={order.id} className="overflow-hidden hover:border-heartfelt-burgundy/30 transition-colors">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-base font-medium">
                                Order #{order.id.substring(0, 8)}
                              </CardTitle>
                              <CardDescription>
                                Placed on {formatDate(order.created_at)}
                              </CardDescription>
                            </div>
                            <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Total: {formatCurrency(order.total_amount)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 p-4 pt-0 border-t border-gray-100">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button 
                            size="sm" 
                            className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium flex items-center mb-2">
                  <MessageCircle size={18} className="text-heartfelt-burgundy mr-2" />
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

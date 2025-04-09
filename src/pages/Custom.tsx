
import { useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Calendar, DollarSign, Clock, Gift, Send, PenTool } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

const CustomOrderSteps = [
  {
    title: "Share Your Vision",
    description: "Tell us about your ideal gift - who it's for, the occasion, and your budget.",
    icon: PenTool
  },
  {
    title: "Design Collaboration",
    description: "Our designers work with you to create a concept that captures your vision.",
    icon: Gift
  },
  {
    title: "Crafting Your Gift",
    description: "Our artisans carefully create your personalized gift with premium materials.",
    icon: Clock
  },
  {
    title: "Delivery",
    description: "Your beautifully packaged gift is delivered on time, ready to be cherished.",
    icon: Send
  }
];

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      sonnerToast.success("Request Submitted", {
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
      sonnerToast.error("Submission Failed", {
        description: "There was an error submitting your request. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-heartfelt-burgundy to-heartfelt-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Create Your Perfect Gift</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Let our artisans bring your vision to life with handcrafted, personalized gifts made exclusively for you
            </p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
            alt="Custom gifts background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-heartfelt-dark mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple 4-step process makes creating your custom gift effortless and enjoyable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CustomOrderSteps.map((step, index) => (
            <div key={index} className="premium-card p-6 text-center hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-heartfelt-cream flex items-center justify-center mx-auto mb-4">
                <step.icon size={28} className="text-heartfelt-burgundy" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="mt-4 text-heartfelt-burgundy font-semibold">Step {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Request Form */}
      <div className="bg-heartfelt-cream/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column - Form Info */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-2xl font-serif font-semibold text-heartfelt-burgundy mb-4">Start Your Custom Order</h3>
                <p className="text-gray-600 mb-6">
                  Fill out the form with your details and vision. Our team will contact you within 24 hours to discuss your custom gift.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check size={18} className="text-heartfelt-burgundy" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Personalized Consultation</h4>
                      <p className="text-sm text-gray-500">Our designers will work directly with you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Calendar size={18} className="text-heartfelt-burgundy" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Flexible Timeline</h4>
                      <p className="text-sm text-gray-500">Rush orders available upon request</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <DollarSign size={18} className="text-heartfelt-burgundy" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Transparent Pricing</h4>
                      <p className="text-sm text-gray-500">No hidden fees or surprises</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-heartfelt-cream/30 p-4 rounded-lg">
                  <p className="text-sm italic">
                    "Working with the Heartfelt team was amazing. They created exactly what I envisioned for my anniversary gift."
                  </p>
                  <p className="text-sm font-medium mt-2">— Sarah L., Custom Jewelry Box</p>
                </div>
              </div>
              
              {/* Right Column - Form */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      Your custom order request has been submitted successfully. Our team will contact you within 24 hours to discuss your project.
                    </p>
                    <Button onClick={() => setSuccess(false)} className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Full Name*</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700">Email Address*</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget" className="text-gray-700">Budget Range ($)</Label>
                        <Input
                          type="number"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="mt-1"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryDate" className="text-gray-700">Preferred Delivery Date</Label>
                      <Input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-gray-700">Tell us about your vision*</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 resize-none"
                        placeholder="Describe who it's for, the occasion, what you're looking for, and any specific details or preferences you have in mind."
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark text-white py-3"
                    >
                      {loading ? 'Submitting...' : 'Submit Custom Order Request'}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-500">
                      By submitting this form, you agree to be contacted regarding your custom order request.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Examples Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-heartfelt-dark mb-4">Recent Custom Creations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get inspired by these unique gifts we've crafted for our clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Anniversary Keepsake Box",
              description: "Personalized wooden box with couple's initials and special date",
              image: "https://images.unsplash.com/photo-1595856619767-a417d9feb32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Family Portrait Sculpture",
              description: "Custom clay sculpture based on a cherished family photo",
              image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            },
            {
              title: "Memorial Jewelry",
              description: "Hand-crafted pendant with personalized engraving",
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
          ].map((example, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <div className="h-60">
                <img 
                  src={example.image} 
                  alt={example.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">{example.title}</h3>
                <p className="text-gray-600">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Custom;

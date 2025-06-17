
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Heart, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from '@/hooks/useAnalytics';
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CustomOrderCta from "@/components/CustomOrderCta";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import SEOHead from "@/components/SEOHead";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  const { trackEvent } = useAnalytics();

  const handleCTAClick = (action: string) => {
    trackEvent(action, 'engagement', 'homepage_cta');
  };

  return (
    <div className="min-h-screen">
      <SEOHead />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Trust Indicators */}
      <section className="py-12 bg-heartfelt-cream/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Gift className="h-8 w-8 text-heartfelt-burgundy mb-2" />
              <h3 className="font-semibold text-gray-900">1000+ Gifts</h3>
              <p className="text-sm text-gray-600">Curated Collection</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-heartfelt-burgundy mb-2" />
              <h3 className="font-semibold text-gray-900">50k+ Customers</h3>
              <p className="text-sm text-gray-600">Happy Families</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-heartfelt-burgundy mb-2" />
              <h3 className="font-semibold text-gray-900">4.8★ Rating</h3>
              <p className="text-sm text-gray-600">Customer Reviews</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-heartfelt-burgundy mb-2" />
              <h3 className="font-semibold text-gray-900">100% Love</h3>
              <p className="text-sm text-gray-600">Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Custom Order CTA */}
      <CustomOrderCta />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-heartfelt-burgundy mb-4">
              Why Choose Filiyaa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to helping you create meaningful connections through thoughtful gifts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-heartfelt-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-heartfelt-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Touch</h3>
              <p className="text-gray-600">Every gift can be customized to make it uniquely yours and perfectly suited for your loved ones.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-heartfelt-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-heartfelt-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Made with Love</h3>
              <p className="text-gray-600">Each product is carefully crafted by skilled artisans who put love and attention into every detail.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-heartfelt-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-heartfelt-burgundy" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">We use only the finest materials and maintain the highest standards in everything we create.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              asChild 
              className="bg-heartfelt-burgundy hover:bg-heartfelt-dark"
              onClick={() => handleCTAClick('learn_more')}
            >
              <Link to="/shop">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default Index;

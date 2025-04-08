
import React from 'react';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import CustomOrderCta from '@/components/CustomOrderCta';

const Index = () => {
  return (
    <div>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <Testimonials />
      <CustomOrderCta />
    </div>
  );
};

export default Index;

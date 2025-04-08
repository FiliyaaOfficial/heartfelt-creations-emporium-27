
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-6">Our Story</h1>
        
        <div className="mb-12 relative rounded-lg overflow-hidden">
          <img 
            src="/images/workshop.jpg" 
            alt="Heartfelt Creations Workshop" 
            className="w-full h-72 md:h-96 object-cover"
            onError={(e) => {
              // Fallback if image doesn't load
              e.currentTarget.src = "https://images.unsplash.com/photo-1605002906889-5d5fd9639606";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-serif mb-2">Crafting Memories Since 2010</h2>
              <p className="text-white/90">Every piece tells a story, every gift carries emotion</p>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl mb-6">
            Heartfelt Creations began with a simple belief: that thoughtful, handcrafted gifts have the power to create moments of connection that last a lifetime.
          </p>
          
          <h2 className="text-2xl font-serif mt-10 mb-4">Our Beginning</h2>
          <p>
            Founded in 2010 by Emma and James Thompson, Heartfelt Creations started as a small workshop in their garage, fueled by Emma's passion for crafting and James's eye for design. What began as handmade gifts for friends and family soon blossomed into a business built on care, quality, and personal connection.
          </p>
          
          <h2 className="text-2xl font-serif mt-10 mb-4">Our Craftspeople</h2>
          <p>
            Today, we're a team of 15 dedicated artisans, each bringing unique skills and creativity to our workshop. From our chocolatiers who create delectable treats, to our embroidery artists who stitch with precision and care, every member of our team shares the same commitment to quality and personal touch.
          </p>
          
          <h2 className="text-2xl font-serif mt-10 mb-4">Our Promise</h2>
          <p>
            Every item that leaves our workshop is crafted with intention and care. We source sustainable materials, support local suppliers, and put heart into every step of the process. When you gift something from Heartfelt Creations, you're not just giving a product – you're giving a piece of our story and yours.
          </p>
          
          <h2 className="text-2xl font-serif mt-10 mb-4">Join Our Journey</h2>
          <p>
            We invite you to browse our collections, discover the stories behind our creations, and perhaps add a new chapter to your own story with a heartfelt gift for someone special.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/products">
              <Button variant="default">
                Explore Our Collections
              </Button>
            </Link>
            <Link to="/custom">
              <Button variant="outline">
                Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

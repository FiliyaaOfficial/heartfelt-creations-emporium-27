
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const products = [
    {
      id: '1',
      name: 'Assorted Artisanal Chocolates Gift Box',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Chocolates',
      isNew: true
    },
    {
      id: '2',
      name: 'Spring Bliss Flower Bouquet',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1587556930799-8dca6fad6d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Bouquets',
      isBestseller: true
    },
    {
      id: '3',
      name: 'Custom Embroidered Name Hoop',
      price: 32.50,
      image: 'https://images.unsplash.com/photo-1528344363875-c5b401a2f18e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Embroidery'
    },
    {
      id: '4',
      name: 'Vintage-Style Memory Scrapbook',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Memory Books',
      isNew: true
    },
    {
      id: '5',
      name: 'Deluxe Self-Care Gift Hamper',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1562158074-d151fb7a72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Gift Hampers',
      isBestseller: true
    },
    {
      id: '6',
      name: 'Gourmet Chocolate Truffles',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1548907040-4d5e3d4049bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Chocolates'
    },
    {
      id: '7',
      name: 'Rose & Lily Mixed Bouquet',
      price: 42.50,
      image: 'https://images.unsplash.com/photo-1494336934272-f0efcedfc8d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Bouquets'
    },
    {
      id: '8',
      name: 'Personalized Anniversary Memory Book',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Memory Books'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      
      // Update scroll position after scrolling
      setTimeout(() => {
        if (scrollContainerRef.current) {
          setScrollPosition(scrollContainerRef.current.scrollLeft);
        }
      }, 500);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 5
    : true;

  return (
    <section className="container-custom">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="section-title">Our Featured Products</h2>
          <p className="text-muted-foreground">Explore our most loved handcrafted creations</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border ${canScrollLeft ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            disabled={!canScrollRight}
            className={`p-2 rounded-full border ${canScrollRight ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300'}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <div key={product.id} className="min-w-[250px] sm:min-w-[280px] snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

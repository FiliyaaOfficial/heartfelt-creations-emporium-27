
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Open WhatsApp chat
  const openWhatsApp = () => {
    // Replace with your actual WhatsApp number and pre-filled message
    const phoneNumber = '919876543210'; // format: country code + number without +
    const message = encodeURIComponent('Hello! I have a question about your products.');
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-30">
      {/* WhatsApp Button */}
      <Button
        onClick={openWhatsApp}
        className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg"
        aria-label="Contact us on WhatsApp"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-6 h-6 text-white"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M9 14a5 5 0 0 0 6 0" />
        </svg>
      </Button>
      
      {/* Back to Top Button - only visible when scrolled down */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="rounded-full w-12 h-12 bg-heartfelt-burgundy hover:bg-heartfelt-dark flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 transition-opacity animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </Button>
      )}
    </div>
  );
};

export default FloatingButtons;

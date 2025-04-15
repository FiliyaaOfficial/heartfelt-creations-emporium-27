
import React, { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

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
    
    if (isMobile) {
      // Direct WhatsApp link for mobile devices
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    } else {
      // Web WhatsApp for desktop
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-30">
      {/* WhatsApp Button */}
      <Button
        onClick={openWhatsApp}
        className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
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

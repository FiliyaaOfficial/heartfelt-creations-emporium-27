
import React, { useState, useEffect } from 'react';
import { Copy, X, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const promoCode = "INDIA50";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    toast.success("Promo code copied!", {
      description: "Paste it at checkout to get your discount"
    });
  };

  const hidePromoBar = () => {
    setIsVisible(false);
    localStorage.setItem('promoBarHidden', 'true');
  };

  useEffect(() => {
    const isHidden = localStorage.getItem('promoBarHidden') === 'true';
    setIsVisible(!isHidden);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-heartfelt-burgundy text-white py-2 px-4 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left">
        <div className="mb-2 sm:mb-0">
          <p className="text-sm font-medium">
            Get Flat 50% OFF on your First Order
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline text-xs sm:text-sm">Min Order of <IndianRupee size={12} className="inline" /> 799</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Use Code</span>
          <div 
            className="border border-dashed border-white/70 px-2 py-1 rounded flex items-center cursor-pointer group"
            onClick={copyToClipboard}
          >
            <span className="text-sm font-bold mr-1">{promoCode}</span>
            <Copy size={14} className="group-hover:text-heartfelt-cream transition-colors" />
          </div>
          
          <button 
            onClick={hidePromoBar}
            className="ml-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close promo banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBar;

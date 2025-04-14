
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CartNotification = () => {
  const { totalItems, cartItems } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [lastTotal, setLastTotal] = useState(totalItems);
  
  useEffect(() => {
    if (totalItems > 0 && totalItems > lastTotal) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    setLastTotal(totalItems);
  }, [totalItems, lastTotal]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white shadow-md rounded-lg border border-heartfelt-burgundy/10 p-3 max-w-[240px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-heartfelt-burgundy" />
                <span className="text-sm font-medium">Item added to cart</span>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600" 
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification;

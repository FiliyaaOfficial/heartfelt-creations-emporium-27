
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const CartNotification = () => {
  const { totalItems, totalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [lastTotal, setLastTotal] = useState(totalItems);

  useEffect(() => {
    if (totalItems > 0 && totalItems > lastTotal) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white shadow-lg rounded-lg border border-heartfelt-burgundy/20 p-4 w-80">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-heartfelt-burgundy/10 p-2 rounded-full">
                  <ShoppingCart size={20} className="text-heartfelt-burgundy" />
                </div>
                <h3 className="font-medium">Cart Updated!</h3>
              </div>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700" 
                aria-label="Close notification"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="mt-3 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items in cart:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total price:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="pt-2 flex gap-2">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Link to="/cart">
                    View Cart
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  size="sm" 
                  className="flex-1 bg-heartfelt-burgundy hover:bg-heartfelt-dark"
                >
                  <Link to="/checkout" className="flex items-center justify-center">
                    Checkout <ArrowRight size={14} className="ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification;

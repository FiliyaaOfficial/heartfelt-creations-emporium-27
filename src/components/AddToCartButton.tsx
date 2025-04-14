
import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  showQuantity?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  quantity = 1,
  className = "",
  showQuantity = false,
  variant = "default",
  size = "default"
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.3, y: 0.7 },
      colors: ['#ff6b6b', '#ffa5a5', '#ffd3d3']
    });

    fire(0.2, {
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#8a2be2', '#ba55d3', '#e6e6fa']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.7, y: 0.7 },
      colors: ['#ffd700', '#ffffe0', '#fafad2']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.7 },
      colors: ['#ff1493', '#ff69b4', '#ffb6c1']
    });
  };

  const handleAddToCart = async () => {
    if (isAdding) return;

    try {
      setIsAdding(true);
      
      await addToCart(product, currentQuantity);
      
      triggerConfetti();
      
      toast.success(
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-green-100 p-1 rounded-full">
            <Check size={16} className="text-green-600" />
          </div>
          <span>Added to cart!</span>
        </div>,
        {
          description: `${product.name} has been added to your cart`,
          action: {
            label: "View Cart",
            onClick: () => window.location.href = "/cart"
          },
          duration: 5000,
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add to cart", {
        description: "There was a problem adding this item to your cart"
      });
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentQuantity > 1) {
      setCurrentQuantity(prev => prev - 1);
    }
  };

  return (
    <div className={`flex ${showQuantity ? 'w-full items-center gap-2' : ''}`}>
      {showQuantity && (
        <div className="flex items-center border border-heartfelt-burgundy/30 rounded-md">
          <button 
            onClick={decrementQuantity}
            disabled={currentQuantity <= 1 || isAdding}
            className="px-2 py-1 text-heartfelt-burgundy hover:bg-heartfelt-cream/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-1 text-center">{currentQuantity}</span>
          <button 
            onClick={incrementQuantity}
            disabled={isAdding}
            className="px-2 py-1 text-heartfelt-burgundy hover:bg-heartfelt-cream/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
      
      <Button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`${className} ${showQuantity ? 'flex-1' : ''}`}
        variant={variant}
        size={size}
      >
        {isAdding ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Adding...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingBag size={18} />
            Add to Cart
          </span>
        )}
      </Button>
    </div>
  );
};

export default AddToCartButton;

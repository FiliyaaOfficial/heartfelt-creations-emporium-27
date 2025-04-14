
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-md mx-auto">
        <ShoppingBag className="mx-auto h-12 w-12 text-heartfelt-burgundy/40 mb-4" />
        <h1 className="text-2xl font-serif font-medium mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to your cart before checking out</p>
        <Button asChild>
          <a href="/categories">Browse Products</a>
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;

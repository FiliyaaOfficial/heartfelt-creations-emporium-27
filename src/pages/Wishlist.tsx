
import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";

const Wishlist = () => {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-heartfelt-burgundy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-heartfelt-cream/30 rounded-2xl -z-10"></div>
        <div className="py-10 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save your favorite items to come back to them later or add them to your cart
          </p>
        </div>
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-heartfelt-cream">
          <div className="bg-heartfelt-cream/30 inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
            <Heart size={40} className="text-heartfelt-burgundy" />
          </div>
          <h2 className="text-2xl font-serif font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Add items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link to="/categories">
            <Button className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
              <ShoppingBag size={18} className="mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item.product} />
              <button
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-heartfelt-cream transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart size={18} className="text-heartfelt-pink fill-heartfelt-pink" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

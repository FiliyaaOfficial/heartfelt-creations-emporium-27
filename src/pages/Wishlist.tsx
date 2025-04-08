
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
        <div className="animate-spin h-8 w-8 border-4 border-filiyaa-peach-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-semibold mb-6">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Add items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link to="/categories">
            <Button>
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
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart size={18} className="text-filiyaa-peach-500 fill-filiyaa-peach-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

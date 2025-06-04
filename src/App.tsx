
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useKeepAlive } from "@/hooks/useKeepAlive";
import CheckoutProtection from "@/components/CheckoutProtection";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Custom from "./pages/Custom";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Support from "./pages/Support";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Search from "./pages/Search";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShippingInfo from "./pages/ShippingInfo";
import BestSellers from "./pages/BestSellers";
import NewArrivals from "./pages/NewArrivals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  useKeepAlive();
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={
          <CheckoutProtection>
            <Checkout />
          </CheckoutProtection>
        } />
        <Route path="/order-confirmation" element={
          <CheckoutProtection>
            <OrderConfirmation />
          </CheckoutProtection>
        } />
        <Route path="/order-confirmation/:orderId" element={
          <CheckoutProtection>
            <OrderConfirmation />
          </CheckoutProtection>
        } />
        <Route path="/custom" element={<Custom />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/support" element={<Support />} />
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/search" element={<Search />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster />
                <Sonner />
                <AppContent />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

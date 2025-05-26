
import { StrictMode, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import Account from '@/pages/Account';
import Categories from '@/pages/Categories';
import CategoryPage from '@/pages/CategoryPage';
import Custom from '@/pages/Custom';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Support from '@/pages/Support';
import Wishlist from '@/pages/Wishlist';
import Search from '@/pages/Search';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ShippingInfo from '@/pages/ShippingInfo';
import NotFound from '@/pages/NotFound';
import { initGA } from '@/utils/analytics';
import './App.css';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize Google Analytics on app load
    initGA();
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/custom" element={<Custom />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/shipping" element={<ShippingInfo />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;

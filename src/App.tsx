
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import Custom from "./pages/Custom";
import Support from "./pages/Support";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Layout from "./components/Layout";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShippingInfo from "./pages/ShippingInfo";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { initGA, pageview } from "@/utils/analytics";

const queryClient = new QueryClient();

// Google Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);
  
  useEffect(() => {
    // Track page views when route changes
    pageview(location.pathname + location.search);
  }, [location]);
  
  return null;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-heartfelt-burgundy"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/categories" element={<Layout><Categories /></Layout>} />
              <Route path="/categories/:categoryName" element={<Layout><Categories /></Layout>} />
              <Route path="/category/:categoryName" element={<Layout><CategoryPage /></Layout>} />
              <Route path="/custom" element={<Layout><Custom /></Layout>} />
              <Route path="/support" element={<Layout><Support /></Layout>} />
              <Route path="/auth" element={<Layout><Auth /></Layout>} />
              <Route path="/auth/callback" element={<Layout><AuthCallback /></Layout>} />
              <Route path="/checkout" element={
                <Layout>
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <Layout>
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/search" element={<Layout><Search /></Layout>} />
              <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
              <Route path="/account" element={
                <Layout>
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
              <Route path="/shipping" element={<Layout><ShippingInfo /></Layout>} />
              <Route path="/new-arrivals" element={<Layout><Shop /></Layout>} />
              <Route path="/best-sellers" element={<Layout><Shop /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

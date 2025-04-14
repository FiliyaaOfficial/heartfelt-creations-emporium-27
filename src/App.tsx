
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShippingInfo from "./pages/ShippingInfo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/categories/:categoryName" element={<Layout><Categories /></Layout>} />
            <Route path="/category/:categoryName" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/custom" element={<Layout><Custom /></Layout>} />
            <Route path="/support" element={<Layout><Support /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/order-confirmation/:orderId" element={<Layout><OrderConfirmation /></Layout>} />
            <Route path="/search" element={<Layout><Search /></Layout>} />
            <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
            <Route path="/account" element={<Layout><Account /></Layout>} />
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
  </QueryClientProvider>
);

export default App;

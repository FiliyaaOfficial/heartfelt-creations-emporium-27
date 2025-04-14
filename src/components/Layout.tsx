
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import PromoBar from './PromoBar';
import CartNotification from './CartNotification';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <PromoBar />
      <Navbar />
      <main className="px-4">{children}</main>
      <Footer />
      <CartNotification />
    </>
  );
};

export default Layout;

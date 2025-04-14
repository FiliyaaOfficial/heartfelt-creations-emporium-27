
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NoticeBar from './NoticeBar';
import ScrollToTop from './ScrollToTop';
import PromoBar from './PromoBar';
import CartNotification from './CartNotification';
import CategoryCircles from './CategoryCircles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <PromoBar />
      <NoticeBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartNotification />
    </>
  );
};

export default Layout;

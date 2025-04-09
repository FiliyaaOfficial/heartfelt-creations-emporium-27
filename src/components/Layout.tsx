
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoticeBar from '@/components/NoticeBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NoticeBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

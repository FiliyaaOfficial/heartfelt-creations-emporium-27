
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, pageview, event } from '@/utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  const trackEvent = (action: string, category: string, label: string, value?: number) => {
    event({ action, category, label, value });
  };

  const trackPurchase = (transactionId: string, value: number, items: any[]) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'INR',
        items: items.map(item => ({
          item_id: item.product_id,
          item_name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          price: item.product.price
        }))
      });
    }
  };

  const trackAddToCart = (item: any) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: item.product.price,
        items: [{
          item_id: item.product_id,
          item_name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          price: item.product.price
        }]
      });
    }
  };

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart
  };
};

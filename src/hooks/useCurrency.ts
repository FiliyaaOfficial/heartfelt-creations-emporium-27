
import { useState, useEffect } from 'react';

interface CurrencyConfig {
  currency: string;
  locale: string;
  symbol: string;
}

const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  IN: { currency: 'INR', locale: 'en-IN', symbol: '₹' },
  US: { currency: 'USD', locale: 'en-US', symbol: '$' },
  GB: { currency: 'GBP', locale: 'en-GB', symbol: '£' },
  EU: { currency: 'EUR', locale: 'en-EU', symbol: '€' },
  // Add more countries as needed
};

export const useCurrency = () => {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    CURRENCY_CONFIG.IN // Default to India
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Try to get country from localStorage first (for caching)
        const cachedCountry = localStorage.getItem('userCountry');
        if (cachedCountry && CURRENCY_CONFIG[cachedCountry]) {
          setCurrencyConfig(CURRENCY_CONFIG[cachedCountry]);
          setIsLoading(false);
          return;
        }

        // Try to detect from browser locale
        const browserLocale = navigator.language || navigator.languages[0];
        if (browserLocale.includes('en-US')) {
          setCurrencyConfig(CURRENCY_CONFIG.US);
          localStorage.setItem('userCountry', 'US');
        } else if (browserLocale.includes('en-GB')) {
          setCurrencyConfig(CURRENCY_CONFIG.GB);
          localStorage.setItem('userCountry', 'GB');
        } else {
          // Default to India
          setCurrencyConfig(CURRENCY_CONFIG.IN);
          localStorage.setItem('userCountry', 'IN');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        setCurrencyConfig(CURRENCY_CONFIG.IN);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return {
    formatCurrency,
    currencyConfig,
    isLoading
  };
};

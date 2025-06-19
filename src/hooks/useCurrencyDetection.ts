
import { useState, useEffect } from 'react';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  'US': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'IN': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'CA': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  'AU': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'EU': { code: 'EUR', symbol: '€', name: 'Euro' },
  'DE': { code: 'EUR', symbol: '€', name: 'Euro' },
  'FR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'IT': { code: 'EUR', symbol: '€', name: 'Euro' },
  'ES': { code: 'EUR', symbol: '€', name: 'Euro' },
  'JP': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'CN': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'SG': { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  'HK': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
};

export const useCurrencyDetection = () => {
  const [currency, setCurrency] = useState<CurrencyInfo>({ 
    code: 'INR', 
    symbol: '₹', 
    name: 'Indian Rupee' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState<string>('IN');

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // First check if we have stored currency preference
        const storedCurrency = localStorage.getItem('user-currency');
        if (storedCurrency) {
          const parsed = JSON.parse(storedCurrency);
          setCurrency(parsed);
          setIsLoading(false);
          return;
        }

        // Try to get user's location using IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const countryCode = data.country_code || 'IN';
        setCountry(countryCode);
        
        const detectedCurrency = CURRENCY_MAP[countryCode] || CURRENCY_MAP['IN'];
        setCurrency(detectedCurrency);
        
        // Store the detected currency
        localStorage.setItem('user-currency', JSON.stringify(detectedCurrency));
        localStorage.setItem('user-country', countryCode);
        
      } catch (error) {
        console.log('Could not detect currency, using default INR:', error);
        // Default to INR if detection fails
        const defaultCurrency = CURRENCY_MAP['IN'];
        setCurrency(defaultCurrency);
        localStorage.setItem('user-currency', JSON.stringify(defaultCurrency));
      } finally {
        setIsLoading(false);
      }
    };

    detectCurrency();
  }, []);

  const changeCurrency = (currencyCode: string) => {
    const newCurrency = Object.values(CURRENCY_MAP).find(c => c.code === currencyCode) || CURRENCY_MAP['IN'];
    setCurrency(newCurrency);
    localStorage.setItem('user-currency', JSON.stringify(newCurrency));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
    }).format(price);
  };

  return {
    currency,
    country,
    isLoading,
    changeCurrency,
    formatPrice,
    availableCurrencies: Object.values(CURRENCY_MAP),
  };
};

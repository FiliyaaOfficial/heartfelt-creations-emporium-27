
import { useState, useEffect } from 'react';

interface CurrencyRate {
  currency_code: string;
  rate_to_inr: number;
  symbol: string;
}

interface CurrencyConfig {
  currency: string;
  locale: string;
  symbol: string;
  rate: number;
}

// Mock currency data until database is set up
const MOCK_CURRENCIES: CurrencyRate[] = [
  { currency_code: 'INR', rate_to_inr: 1.0, symbol: '₹' },
  { currency_code: 'USD', rate_to_inr: 0.012, symbol: '$' },
  { currency_code: 'EUR', rate_to_inr: 0.011, symbol: '€' },
  { currency_code: 'GBP', rate_to_inr: 0.0095, symbol: '£' }
];

export const useCurrency = () => {
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
    currency: 'INR',
    locale: 'en-IN',
    symbol: '₹',
    rate: 1.0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyRate[]>([]);

  useEffect(() => {
    const detectUserLocationAndCurrency = async () => {
      try {
        // Set mock currencies
        setAvailableCurrencies(MOCK_CURRENCIES);

        // Try to get cached currency first
        const cachedCurrency = localStorage.getItem('userCurrency');
        
        if (cachedCurrency) {
          const rate = MOCK_CURRENCIES.find(r => r.currency_code === cachedCurrency);
          if (rate) {
            setCurrencyConfig({
              currency: rate.currency_code,
              locale: getLocaleForCurrency(rate.currency_code),
              symbol: rate.symbol,
              rate: rate.rate_to_inr
            });
            setIsLoading(false);
            return;
          }
        }

        // Detect from browser locale
        let detectedCurrency = 'INR';
        const browserLocale = navigator.language || navigator.languages[0];
        
        if (browserLocale.includes('en-US')) {
          detectedCurrency = 'USD';
        } else if (browserLocale.includes('en-GB')) {
          detectedCurrency = 'GBP';
        } else if (browserLocale.includes('de') || browserLocale.includes('fr') || browserLocale.includes('it')) {
          detectedCurrency = 'EUR';
        }

        const selectedRate = MOCK_CURRENCIES.find(r => r.currency_code === detectedCurrency) || 
                           MOCK_CURRENCIES.find(r => r.currency_code === 'INR');
        
        if (selectedRate) {
          setCurrencyConfig({
            currency: selectedRate.currency_code,
            locale: getLocaleForCurrency(selectedRate.currency_code),
            symbol: selectedRate.symbol,
            rate: selectedRate.rate_to_inr
          });
          localStorage.setItem('userCurrency', selectedRate.currency_code);
        }
      } catch (error) {
        console.error('Error detecting currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLocationAndCurrency();
  }, []);

  const getLocaleForCurrency = (currency: string) => {
    const localeMap: Record<string, string> = {
      INR: 'en-IN',
      USD: 'en-US',
      GBP: 'en-GB',
      EUR: 'en-EU'
    };
    return localeMap[currency] || 'en-US';
  };

  const formatCurrency = (amountInINR: number) => {
    const convertedAmount = amountInINR * currencyConfig.rate;
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  };

  const convertFromINR = (amountInINR: number) => {
    return amountInINR * currencyConfig.rate;
  };

  const convertToINR = (amount: number) => {
    return amount / currencyConfig.rate;
  };

  const changeCurrency = (newCurrency: string) => {
    const rate = availableCurrencies.find(r => r.currency_code === newCurrency);
    if (rate) {
      setCurrencyConfig({
        currency: rate.currency_code,
        locale: getLocaleForCurrency(rate.currency_code),
        symbol: rate.symbol,
        rate: rate.rate_to_inr
      });
      localStorage.setItem('userCurrency', rate.currency_code);
    }
  };

  return {
    formatCurrency,
    convertFromINR,
    convertToINR,
    currencyConfig,
    availableCurrencies,
    changeCurrency,
    isLoading
  };
};


import { useCurrencyDetection } from './useCurrencyDetection';

export const useCurrency = () => {
  const { currency, formatPrice, changeCurrency, isLoading } = useCurrencyDetection();

  const convertPrice = (basePrice: number, fromCurrency = 'INR') => {
    // Simple conversion rates - in production, you'd use a real-time API
    const conversionRates: Record<string, number> = {
      'INR': 1,
      'USD': 0.012,
      'EUR': 0.011,
      'GBP': 0.0095,
      'CAD': 0.016,
      'AUD': 0.018,
      'JPY': 1.8,
      'CNY': 0.087,
      'SGD': 0.016,
      'HKD': 0.094,
    };

    if (currency.code === fromCurrency) {
      return basePrice;
    }

    // Convert from base currency to target currency
    const rate = conversionRates[currency.code] || 1;
    return Math.round(basePrice * rate * 100) / 100;
  };

  return {
    currency: currency.code,
    symbol: currency.symbol,
    formatPrice,
    convertPrice,
    changeCurrency,
    isLoading,
  };
};

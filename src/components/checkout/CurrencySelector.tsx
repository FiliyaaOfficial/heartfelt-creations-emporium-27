
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const CurrencySelector: React.FC = () => {
  const { currencyConfig, availableCurrencies, changeCurrency, isLoading } = useCurrency();

  if (isLoading) return null;

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-gray-500" />
      <Select value={currencyConfig.currency} onValueChange={changeCurrency}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((currency) => (
            <SelectItem key={currency.currency_code} value={currency.currency_code}>
              {currency.symbol} {currency.currency_code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;

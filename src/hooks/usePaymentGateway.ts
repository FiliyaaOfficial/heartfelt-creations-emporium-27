
import { useState, useEffect } from 'react';

interface PaymentGateway {
  name: string;
  supported_currencies: string[];
  active: boolean;
}

// Mock payment gateway data
const MOCK_GATEWAYS: PaymentGateway[] = [
  {
    name: 'razorpay',
    supported_currencies: ['INR'],
    active: true
  },
  {
    name: 'stripe',
    supported_currencies: ['USD', 'EUR', 'GBP'],
    active: true
  }
];

export const usePaymentGateway = (currency: string) => {
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        // Filter gateways based on currency support
        const supportedGateways = MOCK_GATEWAYS.filter(gateway => 
          gateway.supported_currencies.includes(currency) && gateway.active
        );
        
        setAvailableGateways(supportedGateways);
        
        // Auto-select the first available gateway
        if (supportedGateways.length > 0) {
          setSelectedGateway(supportedGateways[0].name);
        }
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentGateways();
  }, [currency]);

  const getGatewayForCurrency = (currency: string) => {
    if (currency === 'INR') return 'razorpay';
    return 'stripe';
  };

  return {
    availableGateways,
    selectedGateway: selectedGateway || getGatewayForCurrency(currency),
    setSelectedGateway,
    loading
  };
};

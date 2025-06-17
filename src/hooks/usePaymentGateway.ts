
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentGateway {
  name: string;
  supported_currencies: string[];
  active: boolean;
}

export const usePaymentGateway = (currency: string) => {
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        const { data: gateways } = await supabase
          .from('payment_gateways')
          .select('name, supported_currencies, active')
          .eq('active', true);

        if (gateways) {
          const supportedGateways = gateways.filter(gateway => 
            gateway.supported_currencies.includes(currency)
          );
          setAvailableGateways(supportedGateways);
          
          // Auto-select the first available gateway
          if (supportedGateways.length > 0) {
            setSelectedGateway(supportedGateways[0].name);
          }
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

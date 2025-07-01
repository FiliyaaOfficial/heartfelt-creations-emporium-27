
import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Shipping Information', description: 'Enter your delivery details' },
    { id: 2, title: 'Review & Payment', description: 'Confirm your order and pay' },
    { id: 3, title: 'Confirmation', description: 'Order placed successfully' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep > step.id 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.id 
                    ? 'bg-heartfelt-burgundy text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > step.id ? <Check size={16} /> : step.id}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 
                ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
  locale?: 'fr' | 'ar';
}

export function CheckoutProgress({ currentStep, locale = 'fr' }: CheckoutProgressProps) {
  const steps = {
    fr: [
      { number: 1, title: 'Adresse' },
      { number: 2, title: 'Livraison' },
      { number: 3, title: 'Confirmation' }
    ],
    ar: [
      { number: 1, title: 'العنوان' },
      { number: 2, title: 'التوصيل' },
      { number: 3, title: 'تأكيد' }
    ]
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {steps[locale].map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
            ${currentStep >= step.number 
              ? 'bg-bellat-red text-white' 
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            {step.number}
          </div>
          <span className={`
            ml-2 text-sm font-medium
            ${currentStep >= step.number 
              ? 'text-bellat-red' 
              : 'text-gray-500'
            }
          `}>
            {step.title}
          </span>
          
          {index < steps[locale].length - 1 && (
            <div className={`
              h-0.5 w-16 mx-4
              ${currentStep > step.number 
                ? 'bg-bellat-red' 
                : 'bg-gray-200'
              }
            `} />
          )}
        </div>
      ))}
    </div>
  );
}
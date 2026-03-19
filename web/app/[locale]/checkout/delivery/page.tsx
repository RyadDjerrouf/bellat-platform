"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { clsx } from 'clsx';

// Static data for the delivery slots, as per the functional specification.
const deliveryOptions = [
  {
    date: 'Demain (05/01/2026)',
    slots: [
      { time: 'Matin (8h - 12h)', price: 0 },
      { time: 'Après-midi (12h - 17h)', price: 0 },
      { time: 'Soir (17h - 21h)', price: 200 },
    ],
  },
  {
    date: 'Après-demain (06/01/2026)',
    slots: [
      { time: 'Matin (8h - 12h)', price: 0 },
      { time: 'Après-midi (12h - 17h)', price: 0 },
    ],
  },
];

// This is the second step of the checkout: delivery slot selection.
export default function DeliveryPage() {
  const router = useRouter();
  const { slot, setSlot } = useCheckout();

  // State to manage the currently selected slot.
  // The format 'date|time' is used as a unique identifier for the radio button group.
  // Pre-fill with context data if it exists.
  const [selectedSlot, setSelectedSlot] = useState(slot ? `${slot.date}|${slot.time}` : '');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      // This is a fallback, as the button is disabled if nothing is selected.
      alert('Veuillez sélectionner un créneau de livraison.');
      return;
    }
    const [date, time] = selectedSlot.split('|');
    setSlot({ date, time }); // Save the selected slot to the context
    router.push('/checkout/review'); // Navigate to the final review step
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Date de livraison</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {deliveryOptions.map((option) => (
              <div key={option.date}>
                <h3 className="font-semibold mb-2">{option.date}</h3>
                <div className="space-y-2">
                  {option.slots.map((slotOption) => {
                    const slotId = `${option.date}|${slotOption.time}`;
                    return (
                      <label
                        key={slotId}
                        htmlFor={slotId}
                        className={clsx(
                          'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                          {
                            'bg-bellat-red/10 border-bellat-red ring-2 ring-bellat-red': selectedSlot === slotId,
                            'bg-white hover:bg-gray-50': selectedSlot !== slotId,
                          }
                        )}
                      >
                        <div>
                          <span>{slotOption.time}</span>
                          {slotOption.price > 0 && (
                            <span className="text-sm text-bellat-red ml-2">
                              +{slotOption.price} DZD
                            </span>
                          )}
                        </div>
                        <input
                          type="radio"
                          id={slotId}
                          name="deliverySlot"
                          value={slotId}
                          checked={selectedSlot === slotId}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="sr-only" // Hide the actual radio button
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!selectedSlot}>
              Continuer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

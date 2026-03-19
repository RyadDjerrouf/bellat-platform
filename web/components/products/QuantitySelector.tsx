'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantitySelector({ 
  value, 
  min = 1, 
  max = 99, 
  onChange,
  className = ''
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="secondary"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-10 w-10 p-0 rounded-md"
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span className="min-w-12 text-center font-semibold text-lg">
        {value}
      </span>

      <Button
        variant="secondary"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-10 w-10 p-0 rounded-md"
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
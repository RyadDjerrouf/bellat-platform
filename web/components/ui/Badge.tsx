import * as React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800', // Delivered
    warning: 'bg-yellow-100 text-yellow-800', // Pending, Low Stock
    danger: 'bg-red-100 text-red-800', // Cancelled
    info: 'bg-blue-100 text-blue-800', // Confirmed
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Badge };

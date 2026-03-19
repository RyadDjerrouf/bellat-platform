import React from 'react';
import { clsx } from 'clsx';

// Define the props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';

    const variantClasses = {
      primary:
        'bg-bellat-red text-white hover:bg-bellat-red-dark focus:ring-bellat-red',
      secondary:
        'bg-white text-bellat-red border-2 border-bellat-red hover:bg-bellat-gray-light focus:ring-bellat-red',
      icon: 'bg-white border border-gray-200 rounded-full w-11 h-11 hover:bg-bellat-gray-light focus:ring-gray-400',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-6 py-3 min-h-[48px]',
      lg: 'px-8 py-4 text-lg min-h-[56px]',
    };

    return (
      <button
        className={clsx(
          baseClasses,
          variantClasses[variant],
          variant !== 'icon' && sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

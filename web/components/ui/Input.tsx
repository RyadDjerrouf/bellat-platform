import * as React from 'react';
import { clsx } from 'clsx';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900',
          'placeholder:text-gray-400',
          'focus:outline-none focus:border-2 focus:border-bellat-red',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-[10px] font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-black text-white hover:bg-black/90': variant === 'primary',
            'bg-gray-100 text-black hover:bg-gray-200': variant === 'secondary',
            'border border-black bg-white hover:bg-black hover:text-white': variant === 'outline',
            'hover:bg-gray-100 hover:text-black': variant === 'ghost',
            'h-9 px-4 text-[10px]': size === 'sm',
            'h-11 px-6 text-xs': size === 'md',
            'h-14 px-8 text-sm': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

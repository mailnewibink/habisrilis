import * as React from 'react';
import { cn } from '../../lib/utils';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} ref={ref} {...props} />
        <div
          className={cn(
            "peer h-6 w-11 bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black",
            className
          )}
        ></div>
      </label>
    );
  }
);
Toggle.displayName = 'Toggle';

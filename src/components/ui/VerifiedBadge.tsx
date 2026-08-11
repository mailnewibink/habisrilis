import React from 'react';
import { cn } from '../../lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  iconClassName?: string;
}

export const VerifiedBadge = ({ className, iconClassName }: VerifiedBadgeProps) => {
  return (
    <div title="Verified Artist" className={cn("flex items-center justify-center bg-black rounded-full flex-shrink-0 shadow-sm", className)}>
      <svg viewBox="0 0 24 24" className={cn("text-white", iconClassName)} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};

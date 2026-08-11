import React from 'react';
import { ReleaseStatus as StatusType } from '../../types';
import { cn } from '../../lib/utils';

export const ReleaseStatus = ({ status }: { status: StatusType }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border",
      {
        'border-green-200 bg-green-50': status === 'live',
        'border-yellow-200 bg-yellow-50': status === 'draft',
        'border-gray-200 bg-gray-50': status === 'archived',
      }
    )}>
      <div
        className={cn('h-1.5 w-1.5 rounded-full', {
          'bg-green-500': status === 'live',
          'bg-yellow-500': status === 'draft',
          'bg-gray-400': status === 'archived',
        })}
      />
      <span className={cn('text-[9px] font-bold uppercase tracking-widest', {
        'text-green-600': status === 'live',
        'text-yellow-600': status === 'draft',
        'text-gray-500': status === 'archived',
      })}>
        {status}
      </span>
    </div>
  );
};

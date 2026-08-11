import React from 'react';
import { Disc3 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
        <Disc3 className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-[#111111] uppercase tracking-tight">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 font-light leading-relaxed">{description}</p>
      {action}
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[14px] border border-gray-200 bg-white mb-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:bg-gray-50 hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-bold tracking-widest text-black uppercase">{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="border-t border-gray-200 px-6 py-6">
          {children}
        </div>
      )}
    </div>
  );
};

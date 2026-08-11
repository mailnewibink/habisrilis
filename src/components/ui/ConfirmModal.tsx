import React from 'react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isConfirming }: ConfirmModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[14px] p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-bold mb-2 text-black">{title}</h3>
        <p className="text-gray-500 mb-6 text-sm">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={isConfirming}>
            Cancel
          </Button>
          <Button variant="outline" className="!border-red-200 !text-red-500 hover:!bg-red-500 hover:!text-white" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isConfirming ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

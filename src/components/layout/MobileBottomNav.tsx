import React from 'react';
import { NavLink } from 'react-router-dom';
import { Disc, Plus, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-100 bg-white pb-safe pt-2 md:hidden rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around px-6 pb-2">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center space-y-1 transition-colors',
              isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            )
          }
        >
          <Disc className="h-5 w-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Releases</span>
        </NavLink>

        <NavLink
          to="/app/new"
          className={({ isActive }) =>
            cn(
              'flex h-12 w-12 items-center justify-center rounded-[14px] bg-black text-white shadow-sm transition-transform active:scale-95 hover:bg-black/90',
              isActive && 'bg-gray-900'
            )
          }
        >
          <Plus className="h-6 w-6" />
        </NavLink>

        <NavLink
          to="/app/account"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center space-y-1 transition-colors',
              isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            )
          }
        >
          <User className="h-5 w-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Account</span>
        </NavLink>
      </div>
    </div>
  );
};

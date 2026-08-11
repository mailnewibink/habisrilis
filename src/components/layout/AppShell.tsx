import { useLanguage } from '../../contexts/LanguageContext';
import React from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Disc, User, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ArtistSwitcher } from './ArtistSwitcher';
import { useAuth } from '../../auth/AuthContext';

export const AppShell = () => {
  const { t } = useLanguage();

  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 md:pb-0 text-[#111111] font-sans selection:bg-gray-200">
      <header className="sticky top-0 z-40 hidden w-full border-b border-gray-100 bg-white/90 backdrop-blur-md md:block">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="https://res.cloudinary.com/dvy4znkvy/image/upload/v1786332080/h_4_sxrvod.png" alt="habisrilis.web.id logo" className="h-6 w-auto object-contain" />
              <span className="font-bold text-lg tracking-tighter hidden lg:inline-block">habisrilis<span className="text-gray-600">.web.id</span></span>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <ArtistSwitcher />
          </div>
          
          <nav className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            {user?.email === 'mailnewibink@gmail.com' && (
              <>
                <NavLink
                  to="/app/admin/claims"
                  className={({ isActive }) =>
                    cn('transition-opacity hover:opacity-50', isActive ? 'text-blue-600' : 'text-gray-400')
                  }
                >
                  Admin Claims
                </NavLink>
                <NavLink
                  to="/app/admin/super"
                  className={({ isActive }) =>
                    cn('transition-opacity hover:opacity-50', isActive ? 'text-blue-600' : 'text-gray-400')
                  }
                >
                  Super Admin
                </NavLink>
              </>
            )}
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                cn('transition-opacity hover:opacity-50', isActive ? 'text-black' : 'text-gray-400')
              }
            >
              Releases
            </NavLink>
            <NavLink
              to="/app/account"
              className={({ isActive }) =>
                cn('transition-opacity hover:opacity-50', isActive ? 'text-black' : 'text-gray-400')
              }
            >
              Account
            </NavLink>
            <NavLink
              to="/app/new"
              className="px-6 py-2 border border-black rounded-[10px] hover:bg-black hover:text-white transition-all"
            >
              Create Release
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md md:hidden flex h-16 items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-2">
           <img src="https://res.cloudinary.com/dvy4znkvy/image/upload/v1786332080/h_4_sxrvod.png" alt="habisrilis.web.id logo" className="h-6 w-auto object-contain" />
           <span className="font-bold text-lg tracking-tighter">habisrilis<span className="text-gray-600">.web.id</span></span>
        </Link>
        <ArtistSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <Outlet />
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

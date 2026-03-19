import React, { useEffect } from 'react';
import { Settings, Home as HomeIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Router } from './Router';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminMode = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) return;
    
    if (location.pathname === '/cart') {
      link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>';
    } else {
      link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💎</text></svg>';
    }
  }, [location.pathname]);

  return (
    <>
      <button 
        onClick={() => {
          if (isAdminMode) {
            navigate('/');
          } else {
            navigate('/admin');
          }
        }}
        className="fixed top-4 right-4 z-[100] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
      >
        {isAdminMode ? <HomeIcon className="w-4 h-4 text-primary" /> : <Settings className="w-4 h-4 text-primary" />}
        <span className="hidden sm:inline">{isAdminMode ? 'Tienda' : 'Admin'}</span>
      </button>

      <Router />
    </>
  );
}

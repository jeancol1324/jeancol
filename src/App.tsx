import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Router } from './Router';
import { usePageLoading } from './hooks/usePageLoading';
import { useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';
import { MaintenanceScreen } from './pages/MaintenanceScreen';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMaintenanceMode } = useStore();
  const { isAdmin, isLoading, signOut } = useAuth();
  const isAdminMode = location.pathname.startsWith('/admin');
  const isMaintenance = isMaintenanceMode() && !isAdminMode;
  usePageLoading();

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

  if (isLoading) {
    return null;
  }

  if (isMaintenance) {
    return (
      <>
        <MaintenanceScreen />
      </>
    );
  }

  return (
    <>
      <Router />
    </>
  );
}

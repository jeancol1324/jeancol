import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

export const usePageLoading = () => {
  const { showLoading, hideLoading, isLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    showLoading('Cargando...');
    const timeout = setTimeout(() => {
      hideLoading();
    }, 800);
    return () => clearTimeout(timeout);
  }, [location.pathname, showLoading, hideLoading]);

  return { isLoading };
};

export default usePageLoading;

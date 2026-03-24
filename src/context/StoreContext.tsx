import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface StoreSettings {
  name: string;
  logo: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  currency: string;
  currencySymbol: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEndDate: string;
  heroSection: {
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
  };
}

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  getLogo: () => string;
  getStoreName: () => string;
  isMaintenanceMode: () => boolean;
  getMaintenanceTimeLeft: () => { days: number; hours: number; minutes: number; seconds: number; total: number } | null;
  loading: boolean;
}

const DEFAULT_SETTINGS: StoreSettings = {
  name: 'JEANCOL Professional',
  logo: '',
  tagline: 'Estilo Colombiano',
  email: 'contacto@jeancol.com',
  phone: '+57 300 123 4567',
  address: 'Colombia',
  socialMedia: {
    instagram: '',
    facebook: '',
    whatsapp: '',
  },
  currency: 'COP',
  currencySymbol: '$',
  maintenanceMode: false,
  maintenanceMessage: 'Estamos realizando mejoras en nuestra tienda. Pronto estaremos de vuelta.',
  maintenanceEndDate: '',
  heroSection: {
    title: 'Define tu Legado',
    subtitle: 'Explora nuestra curaduría de piezas icónicas y colecciones maestras que definen la nueva era de la moda.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    buttonText: 'Explorar Colección',
  },
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch settings from DB on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'store')
          .maybeSingle();

        if (error) throw error;

        if (data?.value) {
          setSettings(prev => ({ ...prev, ...data.value }));
        } else {
          // If no settings exist in DB, create default
          // This might fail if RLS prevents public insert, but admin should see this
          // Ideally, this is done via seed script, but we can try
          try {
            await supabase.from('settings').insert({
              key: 'store',
              value: DEFAULT_SETTINGS
            });
          } catch (e) {
            console.warn('Could not initialize settings in DB (expected if not admin)', e);
          }
        }
      } catch (err) {
        console.error('Error fetching store settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Sync maintenance timer locally
  useEffect(() => {
    if (settings.maintenanceMode && settings.maintenanceEndDate) {
      const checkMaintenanceEnd = () => {
        const now = new Date().getTime();
        const endTime = new Date(settings.maintenanceEndDate).getTime();
        if (now >= endTime) {
          setSettings(prev => ({ ...prev, maintenanceMode: false }));
          // Optionally update DB here, but RLS might block if not admin
        }
      };

      checkMaintenanceEnd();
      const interval = setInterval(checkMaintenanceEnd, 1000);
      return () => clearInterval(interval);
    }
  }, [settings.maintenanceMode, settings.maintenanceEndDate]);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated); // Optimistic update

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'store',
          value: updated,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) {
        setSettings(settings); // Revert on error
        throw error;
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      alert('Error al guardar configuración: ' + error.message);
    }
  };

  const getLogo = () => {
    if (settings.logo) {
      return settings.logo;
    }
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="20" fill="#4200dc"/>
        <text x="50" y="70" font-family="Arial Black" font-size="60" font-weight="900" fill="white" text-anchor="middle">J</text>
      </svg>
    `)}`;
  };

  const getStoreName = () => settings.name;

  const isMaintenanceMode = useCallback(() => {
    if (!settings.maintenanceMode) return false;
    if (settings.maintenanceEndDate) {
      const now = new Date().getTime();
      const endTime = new Date(settings.maintenanceEndDate).getTime();
      return now < endTime;
    }
    return true;
  }, [settings.maintenanceMode, settings.maintenanceEndDate]);

  const getMaintenanceTimeLeft = useCallback(() => {
    if (!settings.maintenanceEndDate) return null;
    const now = new Date().getTime();
    const endTime = new Date(settings.maintenanceEndDate).getTime();
    const total = endTime - now;

    if (total <= 0) return null;

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((total % (1000 * 60)) / 1000),
      total,
    };
  }, [settings.maintenanceEndDate]);

  return (
    <StoreContext.Provider value={{ settings, updateSettings, getLogo, getStoreName, isMaintenanceMode, getMaintenanceTimeLeft, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './StoreContext';
import { useTheme } from './ThemeContext';
import { Loader2, CheckCircle } from 'lucide-react';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Cargando...');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showLoading = useCallback((message: string = 'Cargando...') => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setLoadingMessage(message);
    setIsLoading(true);
  }, [timeoutId]);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const id = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      setTimeoutId(id);
      return () => clearTimeout(id);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading, loadingMessage }}>
      {children}
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  );
};

const LoadingOverlay: React.FC<{ isLoading: boolean; message: string }> = ({ isLoading, message }) => {
  const { getLogo, getStoreName, settings } = useStore();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92vw] max-w-[380px]"
          >
            <div className={`relative overflow-hidden rounded-3xl ${
              isDark 
                ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50' 
                : 'bg-gradient-to-br from-white via-zinc-50 to-white border border-zinc-200/80'
            } shadow-2xl`}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className={`absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
                    isDark ? 'bg-orange-500/20' : 'bg-orange-400/10'
                  }`}
                />
              </div>

              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col items-center gap-5 sm:gap-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 20px 50px -15px rgba(66, 0, 220, 0.3)',
                          '0 25px 60px -20px rgba(66, 0, 220, 0.5)',
                          '0 20px 50px -15px rgba(66, 0, 220, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-white shadow-2xl"
                    >
                      <img src={getLogo()} alt={getStoreName()} className="w-full h-full object-cover" />
                    </motion.div>

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white"
                    >
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                  </motion.div>

                  <div className="text-center space-y-1">
                    <h3 className={`font-black text-2xl sm:text-3xl tracking-tight ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {getStoreName()}
                    </h3>
                    {settings.tagline && (
                      <p className={`text-xs sm:text-sm font-medium ${
                        isDark ? 'text-zinc-400' : 'text-zinc-500'
                      }`}>
                        {settings.tagline}
                      </p>
                    )}
                  </div>

                  <div className="w-full space-y-3">
                    <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl ${
                      isDark ? 'bg-zinc-800/50' : 'bg-zinc-100/80'
                    }`}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5"
                      >
                        <Loader2 className={`w-5 h-5 ${isDark ? 'text-primary-light' : 'text-primary'}`} />
                      </motion.div>
                      <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                        isDark ? 'text-zinc-300' : 'text-zinc-600'
                      }`}>
                        {message}
                      </span>
                    </div>

                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDark ? 'bg-zinc-800/50' : 'bg-zinc-200'
                    }`}>
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
                        initial={{ width: '0%', opacity: 0.5 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                        }}
                        className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-zinc-600' : 'bg-zinc-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoadingProvider;

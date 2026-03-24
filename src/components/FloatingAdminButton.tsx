import React, { useState, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const FloatingAdminButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user, signOut, isLoading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const isAdminMode = location.pathname.startsWith('/admin');

  useEffect(() => {
    console.log('FloatingAdminButton - isAdmin:', isAdmin, 'user:', !!user, 'isLoading:', isLoading);
  }, [isAdmin, user, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!user || isAdminMode) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-16 right-0 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-2xl p-2 min-w-[200px] shadow-2xl"
          >
            <div className="px-3 py-2 border-b border-zinc-700 mb-2">
              <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                navigate('/admin');
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Panel Admin</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        <Settings className="w-6 h-6 text-primary" />
      </motion.button>
    </div>
  );
};

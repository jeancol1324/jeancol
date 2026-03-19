import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { items } = useCart();

  const suggestions = [
    { id: '1', name: 'Zapatillas Premium', category: 'Calzado', popular: true },
    { id: '2', name: 'Jeans Slim Fit', category: 'Pantalones', popular: true },
    { id: '3', name: 'Camisa Blanca', category: 'Camisetas', popular: false },
    { id: '4', name: 'Sudadera Oversize', category: 'Sudaderas', popular: true },
    { id: '5', name: 'Gorra Snapback', category: 'Accesorios', popular: false },
  ];

  const filteredSuggestions = query
    ? suggestions.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions.filter(s => s.popular);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, filteredSuggestions.length, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl mx-4 bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-4 p-6 border-b border-zinc-100 dark:border-zinc-800">
              <Search className="w-6 h-6 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent text-xl font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                autoFocus
              />
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 px-2">
                {query ? 'Resultados' : 'Populares'}
              </p>
              
              <div className="space-y-2">
                {filteredSuggestions.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl transition-all',
                      index === selectedIndex
                        ? 'bg-primary text-white'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      index === selectedIndex ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-900'
                    )}>
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className={cn(
                        'font-black uppercase tracking-tight',
                        index === selectedIndex ? 'text-white' : 'text-zinc-900 dark:text-white'
                      )}>
                        {item.name}
                      </h4>
                      <p className={cn(
                        'text-xs',
                        index === selectedIndex ? 'text-white/70' : 'text-zinc-500'
                      )}>
                        {item.category}
                      </p>
                    </div>
                    <span className={cn(
                      'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full',
                      index === selectedIndex ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800'
                    )}>
                      Ver
                    </span>
                  </Link>
                ))}
              </div>

              {filteredSuggestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-400 font-medium">No se encontraron resultados para "{query}"</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded">↑↓</kbd>
                  Navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded">Enter</kbd>
                  Seleccionar
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded">Esc</kbd>
                Cerrar
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

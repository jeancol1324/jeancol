import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Sparkles },
  { id: 'calzado', name: 'Calzado', icon: Sparkles },
  { id: 'pantalones', name: 'Pantalones', icon: Sparkles },
  { id: 'camisetas', name: 'Camisetas', icon: Sparkles },
  { id: 'sudaderas', name: 'Sudaderas', icon: Sparkles },
  { id: 'accesorios', name: 'Accesorios', icon: Sparkles },
];

const POPULAR_SEARCHES = [
  'Zapatillas Premium',
  'Jeans Slim Fit',
  'Camisa Blanca',
  'Sudadera Oversize',
  'Gorra Snapback',
];

export const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');

  const allProducts = [
    { id: '1', name: 'Zapatillas Premium Urbanas', category: 'calzado', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', popular: true },
    { id: '2', name: 'Jeans Slim Fit Elite', category: 'pantalones', price: 59.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200', popular: true },
    { id: '3', name: 'Camisa Blanca Clásica', category: 'camisetas', price: 39.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200', popular: false },
    { id: '4', name: 'Sudadera Oversize Premium', category: 'sudaderas', price: 69.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200', popular: true },
    { id: '5', name: 'Gorra Snapback Urbana', category: 'accesorios', price: 29.99, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200', popular: false },
    { id: '6', name: 'Zapatillas Running Pro', category: 'calzado', price: 129.99, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200', popular: true },
    { id: '7', name: 'Pantalones Cargo Tech', category: 'pantalones', price: 79.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200', popular: false },
    { id: '8', name: 'Camiseta Básica Premium', category: 'camisetas', price: 24.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', popular: true },
  ];

  const filteredProducts = query
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : selectedCategory === 'all'
      ? allProducts.filter(p => p.popular)
      : allProducts.filter(p => p.category === selectedCategory);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('all');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
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
  }, [isOpen, filteredProducts.length, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-4 md:pt-[10vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl md:max-w-2xl mx-4 bg-white dark:bg-zinc-950 rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3 p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base md:text-xl font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              )}
            </div>

            {!query && (
              <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-zinc-100 dark:border-zinc-800">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                        selectedCategory === cat.id
                          ? "bg-primary text-white"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Búsquedas populares
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-all"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 px-2">
                  {query ? `Resultados (${filteredProducts.length})` : selectedCategory === 'all' ? 'Populares' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </p>
                
                <div className="space-y-2">
                  {filteredProducts.map((item, index) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all',
                        index === selectedIndex
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      )}
                    >
                      <div className={cn(
                        'w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl overflow-hidden',
                        index === selectedIndex ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-900'
                      )}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          'font-bold uppercase tracking-tight text-sm md:text-base truncate',
                          index === selectedIndex ? 'text-white' : 'text-zinc-900 dark:text-white'
                        )}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            'text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                            index === selectedIndex ? 'bg-white/20 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          )}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'text-sm md:text-base font-black italic',
                          index === selectedIndex ? 'text-white' : 'text-primary'
                        )}>
                          ${formatCOP(item.price)}
                        </p>
                        <span className={cn(
                          'text-[9px] md:text-[10px] uppercase tracking-wider',
                          index === selectedIndex ? 'text-white/70' : 'text-emerald-500'
                        )}>
                          Ver producto
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 md:py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                      <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 font-medium">No se encontraron resultados</p>
                    <p className="text-zinc-400 text-sm mt-1">para "{query}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex p-4 border-t border-zinc-100 dark:border-zinc-800 items-center justify-between text-[10px] text-zinc-400">
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

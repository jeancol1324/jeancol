import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  ShoppingBag,
  Menu, 
  Moon, 
  Sun, 
  X, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShoppingCart,
  ShoppingBag,
  Search,
  Moon,
  Sun,
};

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems, freeShippingProgress } = useCart();
  const { products } = useProducts();
  const { getLogo, settings } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeScreen = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const navItems = [
    { id: 'home', label: 'Inicio', path: '/' },
    { id: 'categories', label: 'Categorías', path: '/categories' },
    { id: 'offers', label: 'Ofertas', path: '/offers' }
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.id === 'home') return location.pathname === '/';
    if (item.id === 'categories') return location.pathname.includes('category') || location.pathname === '/categories';
    if (item.id === 'offers') return location.pathname === '/offers';
    return activeScreen === item.id;
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800 py-2" 
            : "bg-transparent py-6"
        )}
      >
        {/* Free Shipping Progress Bar */}
        {totalItems > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100/20 dark:bg-zinc-900/20 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingProgress}%` }}
              className={cn(
                "h-full transition-all duration-1000 ease-out relative",
                freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-primary"
              )}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </motion.div>
          </div>
        )}

        <div className="w-full px-4 lg:px-6 xl:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12 xl:gap-16">
            <Link 
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0">
                <img src={getLogo()} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300 dark:from-orange-300 dark:via-amber-300 dark:to-yellow-400">
                {settings.name}
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <Link 
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-all py-2 relative",
                    isActive(item)
                      ? "text-primary" 
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive(item) && (
                    <motion.div layoutId="headerNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 xl:gap-6">
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              <button 
                onClick={() => navigate('/products')}
                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group relative"
              >
                <Search className="w-5 h-5 xl:w-6 xl:h-6" />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-y-2 group-hover:translate-y-0">Buscar /</span>
              </button>

              <button 
                onClick={toggleTheme}
                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <Link 
              to="/cart"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openSideCart'));
              }}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all relative group"
            >
              <motion.div
                animate={totalItems > 0 ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform" />
              </motion.div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950 shadow-lg animate-bounce-soft">
                  {totalItems}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center text-zinc-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl w-full shadow-2xl border-b border-zinc-100/50 dark:border-zinc-800/50"
            >
              <div className="max-w-6xl mx-auto p-4 lg:p-8">
                <div className="flex items-center gap-3 lg:gap-6 mb-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Search className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      ref={searchInputRef}
                      autoFocus
                      type="text" 
                      placeholder="Buscar productos..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-xl lg:text-3xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 outline-none px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-primary transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> Populares
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Zapatillas', 'Jeans', 'Camisas', 'Accesorios', 'Ofertas'].map(tag => (
                          <button 
                            key={tag} 
                            onClick={() => setSearchQuery(tag)}
                            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white hover:scale-105 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Recientes
                      </h4>
                      <div className="space-y-2">
                        {['Zapatillas Pro', 'Gafas de Sol'].map(item => (
                          <div 
                            key={item} 
                            onClick={() => setSearchQuery(item)}
                            className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">{item}</span>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button 
                        onClick={() => {
                          navigate('/products');
                          setIsSearchOpen(false);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-primary to-orange-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      >
                        Ver todos los productos
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-4">
                    {searchQuery.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        <span>{searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span>presiona Enter para ver todos</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-4">
                      {searchResults.length > 0 ? (
                        searchResults.slice(0, 6).map(prod => (
                          <Link 
                            key={prod.id} 
                            to={`/product/${prod.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-sm border border-transparent hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                          >
                            <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                              <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{prod.category}</p>
                              <h5 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight line-clamp-2">{prod.name}</h5>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">${formatCOP(prod.price)}</p>
                            </div>
                            {prod.originalPrice && prod.originalPrice > prod.price && (
                              <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                -{Math.round((1 - prod.price / prod.originalPrice) * 100)}%
                              </span>
                            )}
                          </Link>
                        ))
                      ) : searchQuery.length > 1 ? (
                        <div className="col-span-2 md:col-span-3 py-12 text-center">
                          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-zinc-300" />
                          </div>
                          <p className="text-zinc-400 font-bold">No se encontraron resultados para "{searchQuery}"</p>
                          <button 
                            onClick={() => {
                              navigate('/products');
                              setIsSearchOpen(false);
                            }}
                            className="mt-4 text-primary font-bold text-sm uppercase tracking-wider hover:underline"
                          >
                            Ver todos los productos
                          </button>
                        </div>
                      ) : (
                        <div className="col-span-2 md:col-span-3 py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                          <Sparkles className="w-8 h-8 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
                          <p className="text-zinc-300 dark:text-zinc-600 font-bold">Escribe para buscar productos</p>
                        </div>
                      )}
                    </div>

                    {searchResults.length > 6 && (
                      <div className="text-center pt-4">
                        <button 
                          onClick={() => {
                            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                            setIsSearchOpen(false);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-primary transition-all"
                        >
                          Ver todos los {searchResults.length} resultados
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-zinc-950 flex flex-col p-8 pt-24"
          >
            <div className="space-y-8">
              {navItems.map((item) => (
                <Link 
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-5xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-8">
              <div className="flex gap-4">
                <button 
                  onClick={toggleTheme}
                  className="flex-1 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  Modo {theme === 'light' ? 'Noche' : 'Día'}
                </button>
              </div>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                {settings.name} © {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

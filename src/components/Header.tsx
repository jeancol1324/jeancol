import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  ArrowLeft, 
  Moon, 
  Sun, 
  X, 
  TrendingUp, 
  Clock, 
  User, 
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Package,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems, freeShippingProgress, remainingForFreeShipping } = useCart();
  const location = useLocation();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

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
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchItemClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    // Navigation is handled by Link component
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveMegaMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', path: '/' },
    { id: 'categories', label: 'Colecciones', path: '/categories', hasMega: true },
    { id: 'offers', label: 'Ofertas', path: '/offers' },
    { id: 'new', label: 'Novedades', path: '/categories' }
  ];

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
              className="text-2xl lg:text-3xl font-black tracking-tighter cursor-pointer text-zinc-900 dark:text-white uppercase italic flex items-center gap-1 group"
            >
              <span className="group-hover:text-primary transition-colors">JEAN</span>
              <span className="text-primary group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">COL</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item) => (
                <div 
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => item.hasMega && setActiveMegaMenu(item.id)}
                >
                  <Link 
                    to={item.path}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-1 py-2",
                      activeScreen === item.id || (item.id === 'categories' && location.pathname.includes('categories'))
                        ? "text-primary" 
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                    {item.hasMega && <ChevronDown className={cn("w-3 h-3 transition-transform", activeMegaMenu === item.id && "rotate-180")} />}
                  </Link>
                  {(activeScreen === item.id || (item.id === 'categories' && location.pathname.includes('categories'))) && (
                    <motion.div layoutId="headerNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 xl:gap-6">
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group relative"
              >
                <Search className="w-5 h-5 xl:w-6 xl:h-6" />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-y-2 group-hover:translate-y-0">Buscar /</span>
              </button>

              <button 
                onClick={toggleTheme}
                className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button className="w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                <User className="w-5 h-5" />
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

        {/* Mega Menu Overlay */}
        <AnimatePresence>
          {activeMegaMenu === 'categories' && (
            <motion.div 
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden"
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-4 gap-12">
                <div className="col-span-1 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Categorías</h4>
                  <div className="space-y-4">
                    {CATEGORIES.map(cat => (
                      <Link 
                        key={cat.id}
                        to={`/categories?type=${cat.id}`}
                        className="flex items-center justify-between group"
                        onClick={() => setActiveMegaMenu(null)}
                      >
                        <span className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white group-hover:text-primary transition-colors italic">{cat.name}</span>
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Destacados</h4>
                  <div className="space-y-6">
                    {[
                      { label: 'Nuevos Arribos', icon: Sparkles },
                      { label: 'Más Vendidos', icon: Zap },
                      { label: 'Edición Limitada', icon: Package },
                      { label: 'Favoritos', icon: Heart }
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-4 group w-full text-left">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {[
                    { title: 'Summer Drop 2024', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80', badge: 'Nuevo' },
                    { title: 'Streetwear Essentials', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80', badge: 'Trending' }
                  ].map((banner, i) => (
                    <div key={i} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer">
                      <img src={banner.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={banner.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{banner.badge}</span>
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <h5 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">{banner.title}</h5>
                        <button className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 group/btn">
                          Explorar <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="relative bg-white dark:bg-zinc-950 w-full p-8 lg:p-16 shadow-2xl border-b border-white/10"
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-8 mb-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <input 
                    ref={searchInputRef}
                    autoFocus
                    type="text" 
                    placeholder="¿QUÉ ESTÁS BUSCANDO?" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none text-4xl lg:text-7xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white placeholder:text-zinc-100 dark:placeholder:text-zinc-900 outline-none"
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-primary hover:text-white transition-all hover:rotate-90"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                  <div className="lg:col-span-1 space-y-12">
                    <div className="space-y-6">
                      <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                        <TrendingUp className="w-4 h-4" /> Tendencias
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {['Zapatillas Pro', 'Jeans Slim', 'Accesorios Cuero', 'Edición Limitada', 'Ofertas'].map(tag => (
                          <button key={tag} className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-white transition-all">
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                        <Clock className="w-4 h-4" /> Recientes
                      </h4>
                      <div className="space-y-4">
                        {['Zapatillas Dark', 'Gafas de Sol'].map(item => (
                          <div key={item} className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            <span className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{item}</span>
                            <X className="w-4 h-4 text-zinc-300 hover:text-red-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">Resultados Sugeridos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.length > 0 ? (
                        searchResults.map(prod => (
                          <Link 
                            key={prod.id} 
                            to={`/product/${prod.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-6 p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 group cursor-pointer border border-transparent hover:border-primary transition-all"
                          >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shrink-0">
                              <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prod.name} referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{prod.category}</p>
                              <h5 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-none italic">{prod.name}</h5>
                              <p className="text-zinc-900 dark:text-white font-black mt-2 tracking-tighter">${prod.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        ))
                      ) : searchQuery.length > 1 ? (
                        <div className="col-span-2 py-20 text-center">
                          <p className="text-zinc-400 text-xl font-black uppercase italic">No se encontraron productos para "{searchQuery}"</p>
                        </div>
                      ) : (
                        <div className="col-span-2 py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem]">
                          <p className="text-zinc-300 dark:text-zinc-700 text-xl font-black uppercase italic">Escribe algo para ver sugerencias...</p>
                        </div>
                      )}
                    </div>
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
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  Modo {theme === 'light' ? 'Noche' : 'Día'}
                </button>
                <button className="flex-1 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                  <User className="w-5 h-5" />
                  Perfil
                </button>
              </div>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">JEANCOL © 2024</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


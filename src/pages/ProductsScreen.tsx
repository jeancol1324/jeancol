import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Sparkles, Search, X, ArrowLeft, ArrowUpDown, Clock, TrendingUp } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

type SortOption = 'random' | 'price-low' | 'price-high' | 'newest' | 'popular';

export const ProductsScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products: allProducts } = useProducts();
  const { categories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>('random');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category))];
    return cats.sort();
  }, [allProducts]);

  const priceStats = useMemo(() => {
    const prices = allProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allProducts]);

  useEffect(() => {
    if (priceStats.min > 0) {
      setPriceRange([priceStats.min, priceStats.max]);
    }
  }, [priceStats]);

  const products = useMemo(() => {
    let filtered = allProducts;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query)) ||
        (p.brand?.toLowerCase().includes(query)) ||
        (p.sizes?.some(s => s.toLowerCase().includes(query))) ||
        (p.material?.toLowerCase().includes(query)) ||
        (p.sku?.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'random':
        return [...filtered].sort(() => Math.random() - 0.5);
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'newest':
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'popular':
      default:
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [allProducts, searchQuery, sortBy, selectedCategory, priceRange]);

  const searchPreview = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return allProducts
      .filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query)) ||
        (p.brand?.toLowerCase().includes(query)) ||
        (p.sizes?.some(s => s.toLowerCase().includes(query))) ||
        (p.material?.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [allProducts, searchQuery]);

  const trendingSearches = [
    { label: 'Jeans', query: 'jeans', icon: TrendingUp },
    { label: 'Camisetas', query: 'camiseta', icon: TrendingUp },
    { label: 'Vestidos', query: 'vestido', icon: TrendingUp },
    { label: 'Zapatos', query: 'zapatos', icon: TrendingUp },
    { label: 'Ofertas', query: 'oferta', icon: TrendingUp },
    { label: 'Nuevos', query: 'nuevo', icon: Clock },
  ];

  const quickFilters = [
    { label: 'En oferta', query: 'oferta', filter: (p: any) => p.discount || p.offerPrice },
    { label: 'Nuevos', query: 'nuevo', filter: (p: any) => p.isNew },
    { label: 'Tendencia', query: 'tendencia', filter: (p: any) => p.isTrending },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'random', label: 'Aleatorio' },
    { value: 'popular', label: 'Más populares' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'price-low', label: 'Precio: menor' },
    { value: 'price-high', label: 'Precio: mayor' },
  ];

  const filteredCount = searchQuery ? products.length : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Helmet>
        <title>Todos Los Productos | JEANCOL</title>
        <meta name="description" content="Descubre las últimas tendencias en moda." />
      </Helmet>

      {/* Header */}
      <div className="relative bg-zinc-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 rounded-full blur-[150px]"
          />
        </div>

        <div className="relative px-4 lg:px-8 py-8 lg:py-12">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Volver</span>
          </motion.button>

          {/* Title & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 text-xs font-bold uppercase tracking-wider">Nueva Colección 2026</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                Todos Los Productos
              </h1>
              <p className="text-zinc-400 text-sm">
                {allProducts.length} productos disponibles
              </p>
            </div>

              {/* Smart Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full md:w-96 lg:w-[450px]"
              >
                <div className={`
                  relative group transition-all duration-300
                  ${isSearchFocused ? 'ring-2 ring-violet-500' : ''}
                `}>
                  <Search className={`
                    absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                    transition-colors duration-200
                    ${isSearchFocused ? 'text-violet-400' : 'text-zinc-500'}
                  `} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="
                      w-full pl-12 pr-20 py-3.5 
                      bg-zinc-800/70 backdrop-blur-sm 
                      border border-zinc-700 
                      rounded-xl 
                      text-white placeholder:text-zinc-500 
                      focus:outline-none 
                      transition-all duration-200
                      text-sm md:text-base
                    "
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1 hover:bg-zinc-700 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-zinc-400" />
                      </button>
                    )}
                    <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                      ⌘K
                    </span>
                  </div>
                </div>
                
                {/* Search Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-50"
                    >
                      {/* Recent Searches */}
                      {!searchQuery && recentSearches.length > 0 && (
                        <div className="p-3 border-b border-zinc-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-500 uppercase font-semibold">Búsquedas recientes</span>
                            <button onClick={clearRecentSearches} className="text-xs text-violet-400 hover:text-violet-300">
                              Limpiar
                            </button>
                          </div>
                          <div className="space-y-1">
                            {recentSearches.map((search, i) => (
                              <button
                                key={i}
                                onClick={() => handleSearch(search)}
                                className="w-full flex items-center gap-2 p-2 hover:bg-zinc-700/50 rounded-lg text-left text-zinc-300 text-sm"
                              >
                                <Clock className="w-4 h-4 text-zinc-500" />
                                {search}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Preview */}
                      {searchQuery && searchPreview.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs text-zinc-400 px-2 py-1">
                            {searchPreview.length} {searchPreview.length === 1 ? 'resultado' : 'resultados'} rápido{searchPreview.length > 1 ? 's' : ''}
                          </div>
                          <div className="space-y-1">
                            {searchPreview.map(product => (
                              <button
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="w-full flex items-center gap-3 p-2 hover:bg-zinc-700/50 rounded-lg transition-colors text-left"
                              >
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-medium truncate">{product.name}</div>
                                  <div className="text-zinc-400 text-xs">{product.category}</div>
                                </div>
                                <div className="text-violet-400 text-sm font-bold">
                                  ${product.price.toLocaleString('es-CO')}
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {}}
                            className="w-full py-2 text-center text-sm text-violet-400 hover:text-violet-300 border-t border-zinc-700 mt-1"
                          >
                            Ver todos los resultados →
                          </button>
                        </div>
                      )}

                      {/* No Results */}
                      {searchQuery && searchPreview.length === 0 && (
                        <div className="p-4 text-center text-zinc-400 text-sm">
                          Sin resultados para "{searchQuery}"
                        </div>
                      )}

                      {/* Trending Searches (when no query) */}
                      {!searchQuery && (
                        <div className="p-3">
                          <div className="text-xs text-zinc-500 uppercase font-semibold mb-2">Tendencias</div>
                          <div className="flex flex-wrap gap-2">
                            {trendingSearches.map(tag => (
                              <button
                                key={tag.query}
                                onClick={() => handleSearch(tag.query)}
                                className="px-3 py-1.5 text-xs font-medium bg-zinc-700/50 hover:bg-violet-600/50 text-zinc-400 hover:text-violet-300 border border-zinc-600 hover:border-violet-500/50 rounded-full transition-all"
                              >
                                <tag.icon className="w-3 h-3 inline mr-1" />
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[80px]">
            <path d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" fill="currentColor" className="text-zinc-50 dark:text-zinc-950" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-zinc-50 dark:bg-zinc-950">
        {/* Filter Bar */}
        <div className="sticky top-0 z-30 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
          <div className="px-4 lg:px-8 py-3 space-y-3">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all
                  ${!selectedCategory 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                `}
              >
                Todos
              </button>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all
                    ${selectedCategory === cat
                      ? 'bg-violet-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Sort and Count */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {products.length} {products.length === 1 ? 'producto' : 'productos'}
                </span>
                
                {sortBy === 'random' && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                    Aleatorio
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="
                    pl-4 pr-10 py-2 rounded-lg 
                    border border-zinc-200 dark:border-zinc-700 
                    bg-white dark:bg-zinc-900 
                    text-zinc-700 dark:text-zinc-300 
                    text-sm font-medium outline-none 
                    focus:border-violet-500 
                    cursor-pointer appearance-none
                    transition-colors
                  "
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="w-4 h-4 text-zinc-400 -ml-8 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 lg:px-8 py-6">
          {products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-zinc-500 mb-6">
                No hay productos que coincidan con "{searchQuery}"
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-500 transition-colors"
              >
                Limpiar búsqueda
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02, duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsScreen;

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X, Sparkles, Star, Filter } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { Helmet } from 'react-helmet-async';

export const CategoriesScreen = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let result = categories;
    if (searchQuery.trim()) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      result = result.filter(c => c.name === selectedCategory);
    }
    return result;
  }, [categories, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Helmet>
        <title>Categorías | JEANCOL</title>
        <meta name="description" content="Explora nuestras categorías de moda: ropa, accesorios, calzado y más." />
      </Helmet>

      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <span className="bg-white/10 backdrop-blur-xl text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] border border-white/20 shadow-2xl">
                Explora Nuestras Colecciones
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl"
            >
              Categorías
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/70 md:text-white/80 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-medium"
            >
              Descubre nuestra amplia selección de productos organizados por categoría
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
            >
              <button 
                onClick={() => navigate('/products')}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-zinc-900 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-2xl"
              >
                Ver Novedades
              </button>
              <button 
                onClick={() => navigate('/offers')}
                className="px-6 md:px-8 py-3 md:py-4 bg-primary/20 backdrop-blur-md border border-primary/30 text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-primary/30 transition-all"
              >
                Ver Ofertas
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[80px]">
            <path d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" fill="currentColor" className="text-white dark:text-zinc-900" />
          </svg>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                {searchQuery || selectedCategory ? 'Resultados' : 'Todas las Categorías'}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría encontrada' : 'categorías encontradas'}
              </p>
            </div>
            
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Categories */}
          <AnimatePresence mode="wait">
            {filteredCategories.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
              >
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/category/${category.name}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          Ver colección
                        </span>
                        <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight mb-1">
                          {category.name}
                        </h3>
                        <p className="text-xs text-white/60 mb-3">
                          {category.count} productos
                        </p>
                        <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                          <span className="text-sm font-medium">Explorar</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Hover Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Sin resultados
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  No encontramos categorías con "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="pb-16 lg:pb-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-purple-600">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80" 
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 lg:p-12">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Nueva Colección</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tight mb-2">
                  Descubre lo Nuevo
                </h2>
                <p className="text-white/80 max-w-md">
                  Explora nuestra última colección con las tendencias más actuales del mercado.
                </p>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-4 bg-white text-zinc-900 rounded-xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-2xl whitespace-nowrap"
              >
                Ver Productos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesScreen;

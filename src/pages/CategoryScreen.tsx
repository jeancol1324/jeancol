import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  SlidersHorizontal
} from 'lucide-react';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export const CategoryScreen = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { getCategoryByName } = useCategories();
  const { products: allProducts } = useProducts();
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categoryName = categoryId || 'Categoría';
  const category = getCategoryByName(categoryName);

  const products = useMemo(() => {
    let filtered = allProducts.filter(p => 
      p.category.toLowerCase() === categoryName.toLowerCase()
    );

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'popular':
      default:
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [allProducts, categoryName, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Más populares' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'price-low', label: 'Precio: menor a mayor' },
    { value: 'price-high', label: 'Precio: mayor a menor' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-full px-4 lg:px-8 py-8">
          <button 
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver a categorías</span>
          </button>
          
          <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
            {categoryName}
          </h1>
          <p className="text-zinc-500 mt-2">
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <div className="w-full px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Sort */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  showFilters 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Ordenar</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm font-medium outline-none focus:border-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - Full Width */}
      <div className="w-full px-4 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No hay productos en esta categoría</p>
            <button 
              onClick={() => navigate('/categories')}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-bold"
            >
              Ver todas las categorías
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;

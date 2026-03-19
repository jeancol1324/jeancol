import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Footer } from '../components/Footer';

const CartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M52.5 9.16667H45.8333M52.5 9.16667V47.5C52.5 48.8818 51.6318 50 50.25 50H41.5M52.5 9.16667L46.5833 2.5H13.4167M13.4167 2.5L5.83333 18.3333V47.5C5.83333 48.8818 6.7012 50 8.08333 50H41.5M13.4167 2.5H46.5833M41.5 50C43.433 46.2278 44.5 41.6189 44.5 36.6667C44.5 31.7144 43.433 27.1056 41.5 23.3333C39.567 27.1056 38.5 31.7144 38.5 36.6667C38.5 41.6189 39.567 46.2278 41.5 50ZM19.5 36.6667C19.5 40.2389 17.071 43.1667 14.125 43.1667C11.179 43.1667 8.75 40.2389 8.75 36.6667C8.75 33.0944 11.179 30.1667 14.125 30.1667C17.071 30.1667 19.5 33.0944 19.5 36.6667ZM50.25 43.1667C52.196 40.2389 53.25 36.4744 53.25 32.5C53.25 28.5256 52.196 24.7611 50.25 21.8333C48.304 24.7611 47.25 28.5256 47.25 32.5C47.25 36.4744 48.304 40.2389 50.25 43.1667Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const categoryProducts = {
  hombres: [
    { id: 'h1', name: 'Sudadera Premium', price: 89.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.8, isNew: true },
    { id: 'h2', name: 'Chaqueta Bomber', price: 179.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.5, isNew: true },
    { id: 'h3', name: 'Camisa Formal', price: 79.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.4 },
    { id: 'h4', name: 'Pantalón Cargo', price: 89.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.5, isTrending: true },
    { id: 'h5', name: 'Polo Clásico', price: 49.99, image: 'https://images.unsplash.com/photo-1625910513413-5fc4bd8b3b3e?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.6 },
    { id: 'h6', name: 'Abrigo Lana', price: 199.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.7 },
  ],
  mujeres: [
    { id: 'm1', name: 'Vestido de Seda', price: 249.99, image: 'https://images.unsplash.com/photo-1539008835154-33321e17c76a?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.9, isNew: true },
    { id: 'm2', name: 'Falda Midi', price: 99.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj7d?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.7, isNew: true },
    { id: 'm3', name: 'Top Deportivo', price: 59.99, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.8 },
    { id: 'm4', name: 'Blusa Elegante', price: 89.99, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.6 },
    { id: 'm5', name: 'Jeans Premium', price: 109.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.5, isTrending: true },
    { id: 'm6', name: 'Abrigo Largo', price: 229.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.8 },
  ],
  accesorios: [
    { id: 'a1', name: 'Reloj Cronógrafo', price: 399.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.7, isTrending: true },
    { id: 'a2', name: 'Bolso de Cuero', price: 129.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.8, isTrending: true },
    { id: 'a3', name: 'Gafas Aviador', price: 149.99, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.9 },
    { id: 'a4', name: 'Cartera Minimal', price: 79.99, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.6 },
    { id: 'a5', name: 'Bufanda Premium', price: 59.99, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.5, isNew: true },
    { id: 'a6', name: 'Cinturón Cuero', price: 69.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.7 },
  ],
  calzado: [
    { id: 'c1', name: 'Zapatillas Pro', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.6 },
    { id: 'c2', name: 'Botas Chelsea', price: 219.99, image: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.6, isTrending: true },
    { id: 'c3', name: 'Sneakers Urban', price: 129.99, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.8, isNew: true },
    { id: 'c4', name: 'Mocasines', price: 99.99, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.5 },
    { id: 'c5', name: 'Sandalias', price: 79.99, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.4, isNew: true },
    { id: 'c6', name: 'Zapatos Formales', price: 189.99, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.7 },
  ],
};

const categories = [
  { id: 'hombres', name: 'Hombres', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80' },
  { id: 'mujeres', name: 'Mujeres', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
  { id: 'accesorios', name: 'Accesorios', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { id: 'calzado', name: 'Calzado', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
];

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const CategoriesScreen = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const renderProducts = (products: any[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="group"
        >
          <div 
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Nuevo</span>
              )}
              {product.isTrending && (
                <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Trending</span>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { 
                e.stopPropagation();
                addItem({ ...product, selectedSize: 'M', quantity: 1 });
                showToast(`${product.name} añadido al carrito`, 'success');
              }}
              className="absolute top-2 right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md text-primary"
            >
              <CartIcon className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>

          <div className="mt-2 md:mt-3 space-y-1">
            <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-wider">{product.category}</span>
            <h3 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">{product.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-black text-zinc-900 dark:text-white">${product.price.toFixed(2)}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-500" />
                <span className="text-[10px] font-black">{product.rating}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 pb-40">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 py-16 md:py-20">
        <div className="w-full px-4 lg:px-8 text-center">
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Colecciones</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">
            Explora por <span className="text-primary">Categoría</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            Encuentra exactamente lo que buscas en nuestra selección curada.
          </p>
        </div>
      </div>

      {/* Category Cards */}
      <section className="py-8 px-4 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                const element = document.getElementById(category.id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">{category.name}</h3>
                <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                  <span>Explorar</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products by Category */}
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="py-8 md:py-12 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="w-full px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{category.name}</h2>
              <button 
                onClick={() => navigate(`/category/${category.id}`)}
                className="text-primary text-xs md:text-sm font-bold uppercase tracking-wider hover:underline"
              >
                Ver todo
              </button>
            </div>
            {renderProducts(categoryProducts[category.id as keyof typeof categoryProducts] || [])}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
};

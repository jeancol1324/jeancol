import React from 'react';
import { 
  Zap, 
  Flame, 
  Star, 
  Gift,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Footer } from '../components/Footer';
import { CountdownBadge } from '../components/CountdownTimer';

const CartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M52.5 9.16667H45.8333M52.5 9.16667V47.5C52.5 48.8818 51.6318 50 50.25 50H41.5M52.5 9.16667L46.5833 2.5H13.4167M13.4167 2.5L5.83333 18.3333V47.5C5.83333 48.8818 6.7012 50 8.08333 50H41.5M13.4167 2.5H46.5833M41.5 50C43.433 46.2278 44.5 41.6189 44.5 36.6667C44.5 31.7144 43.433 27.1056 41.5 23.3333C39.567 27.1056 38.5 31.7144 38.5 36.6667C38.5 41.6189 39.567 46.2278 41.5 50ZM19.5 36.6667C19.5 40.2389 17.071 43.1667 14.125 43.1667C11.179 43.1667 8.75 40.2389 8.75 36.6667C8.75 33.0944 11.179 30.1667 14.125 30.1667C17.071 30.1667 19.5 33.0944 19.5 36.6667ZM50.25 43.1667C52.196 40.2389 53.25 36.4744 53.25 32.5C53.25 28.5256 52.196 24.7611 50.25 21.8333C48.304 24.7611 47.25 28.5256 47.25 32.5C47.25 36.4744 48.304 40.2389 50.25 43.1667Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const productsWithOffers = [
  { id: '1', name: 'Sudadera Premium Oversize', price: 89.99, offerPrice: 45.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.8, offerEndDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
  { id: '2', name: 'Vestido de Seda Nocturno', price: 249.99, offerPrice: 129.99, image: 'https://images.unsplash.com/photo-1539008835154-33321e17c76a?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.9, offerEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', name: 'Reloj Cronógrafo Elite', price: 399.99, offerPrice: 199.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.7, offerEndDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() },
  { id: '4', name: 'Zapatillas de Running Pro', price: 159.99, offerPrice: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.6, offerEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', name: 'Chaqueta Bomber', price: 179.99, offerPrice: 89.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.5, offerEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', name: 'Bolso de Cuero', price: 129.99, offerPrice: 64.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.8, offerEndDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '7', name: 'Camisa Formal', price: 79.99, offerPrice: 39.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.4, offerEndDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() },
  { id: '8', name: 'Falda Midi', price: 99.99, offerPrice: 49.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj7d?auto=format&fit=crop&w=800&q=80', category: 'Mujeres', rating: 4.7, offerEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '9', name: 'Gafas Aviador', price: 149.99, offerPrice: 74.99, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', category: 'Accesorios', rating: 4.9, offerEndDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() },
  { id: '10', name: 'Botas Chelsea', price: 219.99, offerPrice: 109.99, image: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?auto=format&fit=crop&w=800&q=80', category: 'Calzado', rating: 4.6, offerEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '11', name: 'Pantalón Cargo', price: 89.99, offerPrice: 44.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', category: 'Hombres', rating: 4.5, offerEndDate: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString() },
  { id: '12', name: 'Top Deportivo', price: 59.99, offerPrice: 29.99, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', category: 'Deportes', rating: 4.8, offerEndDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() },
];

const calculateDiscount = (original: number, offer: number) => {
  return Math.round(((original - offer) / original) * 100);
};

export const OffersScreen = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500 pb-40">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-orange-600 py-12 md:py-16">
        <div className="w-full px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-white fill-white" />
            <span className="text-white text-[10px] font-black uppercase tracking-wider">Ofertas por Tiempo Limitado</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">
            Liquidación <span className="text-zinc-950">Exclusiva</span>
          </h1>
          
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Cada producto tiene su propio tiempo de oferta. ¡No te los pierdas!
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-6 md:py-10 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Productos en Oferta</h2>
            </div>
            <span className="text-xs font-medium text-zinc-500">{productsWithOffers.length} productos</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {productsWithOffers.map((product, index) => (
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
                  
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      -{calculateDiscount(product.price, product.offerPrice)}%
                    </span>
                  </div>

                  {/* Add to Cart Button */}
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

                  {/* Countdown Badge */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <CountdownBadge endDate={product.offerEndDate} />
                  </div>
                </div>

                <div className="mt-2 md:mt-3 space-y-1">
                  <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight truncate">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm md:text-base font-black text-primary">${product.offerPrice.toFixed(2)}</span>
                      <span className="text-[10px] md:text-xs text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="text-[10px] font-black">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 px-4 lg:px-8 w-full">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-orange-500 p-6 md:p-10">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-2">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-black uppercase tracking-wider">Código Exclusivo</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-1">
                10% Extra con <span className="text-zinc-950">WELCOME10</span>
              </h2>
              <p className="text-white/80 text-sm">En tu primera compra</p>
            </div>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-950 hover:text-white transition-all shadow-lg whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 inline mr-2" />
              Copiar Código
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

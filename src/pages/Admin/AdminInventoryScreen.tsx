import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Star, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';
import { PRODUCTS } from '../../constants';

export const AdminInventoryScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
          <Container className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">
                INVENTARIO
              </h2>
            </div>
            <button 
              onClick={() => navigate('/admin/new-product')}
              className="bg-primary text-white px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-[10px] lg:text-sm font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </Container>
        </header>

      <main className="py-3 lg:py-8">
        <Container>
          {/* Inventory Stats Quick View */}
          <div className="grid grid-cols-3 gap-1.5 mb-6 lg:hidden">
            {[
              { label: 'Total', val: '42', color: 'text-zinc-900' },
              { label: 'Bajo', val: '3', color: 'text-amber-500' },
              { label: 'Agotado', val: '0', color: 'text-red-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-1.5 rounded-lg border border-zinc-100 text-center">
                <p className="text-[5px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{s.label}</p>
                <p className={`text-[10px] font-black ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-6 mb-4 lg:mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="w-full bg-white border border-zinc-200 rounded-xl py-2 lg:py-3 pl-9 lg:pl-12 pr-4 text-[9px] lg:text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {['Todos', 'Stock', 'Bajo', 'Agotados'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-full text-[8px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 2 Horizontal Rows Section for Mobile */}
          <div className="mb-6 lg:hidden">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-900 mb-3 flex items-center gap-2">
              <Star className="w-3 h-3 text-primary" />
              Productos Destacados (2 Filas)
            </h3>
            <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto no-scrollbar pb-2">
              {PRODUCTS.slice(0, 8).map((prod, i) => (
                <div key={prod.id} className="w-32 bg-white p-1.5 rounded-xl border border-zinc-100 shadow-sm shrink-0">
                  <div className="aspect-square rounded-lg overflow-hidden bg-zinc-50 mb-1.5">
                    <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} referrerPolicy="no-referrer" />
                  </div>
                  <p className="text-[8px] font-black text-zinc-900 truncate">{prod.name}</p>
                  <p className="text-[9px] font-black text-primary">${prod.price}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-[9px] lg:text-lg font-black uppercase tracking-widest text-zinc-900 mb-3 lg:mb-6">Inventario Completo</h3>
          {/* 2-column grid on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
            {PRODUCTS.map((prod, i) => (
              <motion.div 
                key={prod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white p-1.5 lg:p-5 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group flex flex-col gap-1.5 lg:gap-3"
              >
                <div className="aspect-square rounded-lg lg:rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src={prod.image} 
                    alt={prod.name} 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-1 right-1 lg:top-2 lg:right-2">
                    <button className="p-1 lg:p-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm hover:text-primary transition-colors">
                      <Settings2 className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 text-zinc-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[6px] lg:text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5 lg:mb-1">{prod.category}</p>
                    <h3 className="text-[9px] lg:text-sm font-black text-zinc-900 truncate mb-0.5 lg:mb-1">{prod.name}</h3>
                    <p className="text-[10px] lg:text-lg font-black text-primary">${prod.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 lg:mt-3 lg:pt-3 border-t border-zinc-50">
                    <div className="flex items-center gap-1 lg:gap-1.5">
                      <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[6px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest">24 unid.</span>
                    </div>
                    <button className="text-[7px] lg:text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Editar</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </main>
    </div>

    <button 
      onClick={() => navigate('/admin/new-product')}
      className="fixed bottom-24 right-4 lg:hidden w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
    >
      <Plus className="w-7 h-7" />
    </button>
  </div>
  );
};

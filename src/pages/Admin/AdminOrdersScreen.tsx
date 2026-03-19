import React from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, ChevronDown, Package, MapPin, Phone, ChevronRight } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';
import { ORDERS } from '../../constants';

export const AdminOrdersScreen = () => (
  <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
    <AdminNavigation />
    <div className="flex-1">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">
              PEDIDOS
            </h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-zinc-900" />
            </button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-[10px] lg:text-xs border-2 border-primary/20">
              AD
            </div>
          </div>
        </Container>
      </header>

      <main className="py-3 lg:py-8">
        <Container>
          {/* Order Stats Summary */}
          <div className="grid grid-cols-3 gap-1.5 lg:gap-4 mb-4 lg:mb-8">
            {[
              { label: 'Pendientes', count: '12', color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Enviados', count: '45', color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Completados', count: '128', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-1.5 lg:p-5 rounded-lg lg:rounded-2xl border border-zinc-100 text-center`}>
                <p className="text-[5px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5 lg:mb-1">{stat.label}</p>
                <p className={`text-[10px] lg:text-2xl font-black ${stat.color}`}>{stat.count}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-6 mb-4 lg:mb-10">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {['Todos', 'Pendientes', 'Enviados', 'Entregados'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-full text-[8px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-zinc-900 text-white shadow-lg' : 'bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-200 transition-colors">
                <Clock className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" />
                Recientes
                <ChevronDown className="w-2 h-2 lg:w-3 lg:h-3" />
              </button>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-6">
          {ORDERS.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white p-2.5 lg:p-6 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2.5 lg:mb-6">
                <div className="flex items-center gap-2 lg:gap-4">
                  <div className="w-7 h-7 lg:w-14 lg:h-14 rounded-lg lg:rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Package className="w-3.5 h-3.5 lg:w-7 lg:h-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5 lg:mb-1">
                      <span className="text-[10px] lg:text-lg font-black text-zinc-900">#{order.id}</span>
                      <span className={`text-[6px] lg:text-[10px] font-black px-1 py-0.5 rounded-full uppercase tracking-widest ${
                         order.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 
                         order.status === 'Enviado' ? 'bg-blue-50 text-blue-600' : 
                         'bg-emerald-50 text-emerald-600'
                       }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[9px] lg:text-sm font-bold text-zinc-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] lg:text-lg font-black text-zinc-900">$124</p>
                  <p className="text-[6px] lg:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{order.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:gap-4 pt-2.5 lg:pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-1 lg:gap-3 text-zinc-500">
                  <div className="w-4 h-4 lg:w-8 lg:h-8 rounded-md lg:rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-2 h-2 lg:w-4 lg:h-4" />
                  </div>
                  <span className="text-[8px] lg:text-xs font-medium truncate">{order.location}</span>
                </div>
                <div className="flex items-center gap-1 lg:gap-3 text-zinc-500">
                  <div className="w-4 h-4 lg:w-8 lg:h-8 rounded-md lg:rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
                    <Phone className="w-2 h-2 lg:w-4 lg:h-4" />
                  </div>
                  <span className="text-[8px] lg:text-xs font-medium">{order.phone}</span>
                </div>
              </div>
              
              <div className="mt-2.5 lg:mt-6 flex gap-2 lg:gap-3">
                <button className="flex-1 h-8 lg:h-12 bg-zinc-900 text-white rounded-lg lg:rounded-xl text-[7px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                  Gestionar Pedido
                </button>
                <button className="w-8 h-8 lg:w-12 lg:h-12 bg-zinc-50 text-zinc-400 rounded-lg lg:rounded-xl flex items-center justify-center hover:bg-zinc-100 transition-colors">
                  <ChevronRight className="w-3 h-3 lg:w-5 lg:h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </main>
  </div>
</div>
);

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Plus, Package, ShoppingBag, TrendingUp, Users, 
  AlertTriangle, CheckCircle, Handshake, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';
import { PRODUCTS } from '../../constants';

export const AdminDashboardScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
          <Container className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">
                DASHBOARD
              </h2>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5 text-zinc-900" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-[10px] lg:text-xs border-2 border-primary/20">
                AD
              </div>
            </div>
          </Container>
        </header>

        <main className="py-3 lg:py-8">
          <Container>
            <div className="mb-4 lg:mb-10 flex items-end justify-between">
              <div>
                <h1 className="text-lg lg:text-4xl font-black text-zinc-900 tracking-tight mb-0.5">Resumen</h1>
                <p className="text-zinc-500 text-[8px] lg:text-base font-medium uppercase tracking-widest">Estadísticas de hoy</p>
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Última actualización</p>
                <p className="text-xs font-bold text-zinc-900">Hace 2 minutos</p>
              </div>
            </div>

            {/* Quick Actions Mobile */}
            <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
              <button onClick={() => navigate('/admin/new-product')} className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 shadow-lg shadow-primary/20">
                <Plus className="w-3 h-3" /> Nuevo Producto
              </button>
              <button onClick={() => navigate('/admin/inventory')} className="flex items-center gap-2 bg-white border border-zinc-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-600 shrink-0">
                <Package className="w-3 h-3" /> Ver Stock
              </button>
              <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 bg-white border border-zinc-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-600 shrink-0">
                <ShoppingBag className="w-3 h-3" /> Pedidos
              </button>
            </div>
            {/* ... rest of the component ... */}


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-10">
            {[
              { label: 'Ventas Hoy', value: '$1,240', trend: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Pedidos', value: '18', trend: '+5%', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/5' },
              { label: 'Clientes', value: '124', trend: '+8%', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
              { label: 'Stock Bajo', value: '3', trend: 'Alerta', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-2 lg:p-6 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-1 lg:mb-4">
                  <div className={`w-6 h-6 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-3 h-3 lg:w-6 lg:h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-[5px] lg:text-xs font-black px-1 py-0.5 rounded-full ${stat.bg} ${stat.color}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-zinc-400 text-[5px] lg:text-[10px] uppercase font-black tracking-widest mb-0.5 lg:mb-1">{stat.label}</p>
                <p className="text-[10px] lg:text-2xl font-black text-zinc-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 lg:space-y-8">
              {/* Performance Chart */}
              <div className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                  <h3 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest">Rendimiento</h3>
                  <select className="bg-zinc-50 border-none rounded-lg lg:rounded-xl text-[8px] lg:text-xs font-bold px-2 py-1 lg:px-4 lg:py-2 focus:ring-2 focus:ring-primary/20">
                    <option>7 días</option>
                    <option>30 días</option>
                  </select>
                </div>
                <div className="relative h-32 lg:h-64 flex items-end gap-1.5 lg:gap-6 px-1 lg:px-2">
                  {[40, 65, 45, 85, 55, 75, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 lg:gap-4 group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`w-full rounded-md lg:rounded-2xl transition-all relative ${i === 6 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-zinc-100 group-hover:bg-zinc-200'}`}
                      >
                        <div className="absolute -top-5 lg:-top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[7px] lg:text-[10px] font-bold px-1 py-0.5 lg:px-2 lg:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${(h * 15).toFixed(0)}
                        </div>
                      </motion.div>
                      <span className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products Section */}
              <div className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                  <h3 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest">Productos Top</h3>
                  <button className="text-primary text-[8px] lg:text-xs font-black uppercase tracking-widest hover:underline">Ver Todo</button>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {PRODUCTS.slice(0, 4).map((prod, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
                      <img src={prod.image} className="w-8 h-8 lg:w-14 lg:h-14 rounded-lg object-cover" alt={prod.name} />
                      <div className="min-w-0">
                        <p className="text-[9px] lg:text-sm font-black text-zinc-900 truncate">{prod.name}</p>
                        <p className="text-[7px] lg:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{prod.category}</p>
                        <p className="text-[9px] lg:text-xs font-black text-primary mt-0.5">${prod.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-8">
              {/* Activity Feed */}
              <div className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-center mb-4 lg:mb-8">
                  <h3 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest">Actividad</h3>
                  <button className="text-primary text-[8px] lg:text-xs font-black uppercase tracking-widest hover:underline">Ver Todo</button>
                </div>
                <div className="space-y-3 lg:space-y-6">
                  {[
                    { title: 'Pedido #8429', time: '5 min', price: '$120', icon: ShoppingBag, color: 'text-primary' },
                    { title: 'Stock bajo', time: '2h', price: '3 unid.', icon: AlertTriangle, color: 'text-amber-500' },
                    { title: 'Pago recibido', time: '4h', price: '$89', icon: CheckCircle, color: 'text-emerald-500' },
                    { title: 'Nuevo cliente', time: '6h', price: 'ID: 124', icon: Handshake, color: 'text-violet-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 lg:gap-4 group cursor-pointer">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100 transition-colors shrink-0">
                        <item.icon className={`w-3.5 h-3.5 lg:w-5 lg:h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] lg:text-sm font-black text-zinc-900 truncate">{item.title}</p>
                        <p className="text-[7px] lg:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] lg:text-xs font-black text-zinc-900">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Customers */}
              <div className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
                <h3 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest mb-4 lg:mb-8">Clientes</h3>
                <div className="space-y-3">
                  {['Juan Pérez', 'María García', 'Carlos Ruiz'].map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-zinc-100 flex items-center justify-center text-[9px] font-black text-zinc-500">
                        {name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] lg:text-sm font-black text-zinc-900">{name}</p>
                        <p className="text-[7px] lg:text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Premium</p>
                      </div>
                      <button className="p-1 hover:bg-zinc-50 rounded-lg">
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  </div>
  );
};

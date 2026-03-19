import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';
import { cn } from '../../lib/utils';

const data = [
  { name: 'Lun', ventas: 4000, visitas: 2400, pedidos: 24 },
  { name: 'Mar', ventas: 3000, visitas: 1398, pedidos: 18 },
  { name: 'Mie', ventas: 2000, visitas: 9800, pedidos: 45 },
  { name: 'Jue', ventas: 2780, visitas: 3908, pedidos: 29 },
  { name: 'Vie', ventas: 1890, visitas: 4800, pedidos: 22 },
  { name: 'Sab', ventas: 2390, visitas: 3800, pedidos: 31 },
  { name: 'Dom', ventas: 3490, visitas: 4300, pedidos: 38 },
];

const categoryData = [
  { name: 'Calzado', value: 400 },
  { name: 'Ropa', value: 300 },
  { name: 'Accesorios', value: 300 },
  { name: 'Tech', value: 200 },
];

const COLORS = ['#FF6321', '#141414', '#8E9299', '#E6E6E6'];

export const AdminAnalyticsScreen = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50 dark:bg-zinc-950 transition-colors duration-300">
      <AdminNavigation />
      
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 h-14 lg:h-20 flex items-center">
          <Container className="flex items-center justify-between">
            <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">Analítica Avanzada</h2>
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 transition-colors">
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs">AD</div>
            </div>
          </Container>
        </header>

        <main className="py-8">
          <Container className="space-y-8">
            {/* Filters & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                {['7d', '30d', '90d', '1y'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      timeRange === range ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shadow-sm">
                <Filter className="w-4 h-4" /> Filtros Avanzados
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Ventas Totales', value: '$24,892', trend: '+14.2%', icon: DollarSign, color: 'text-emerald-500', up: true },
                { label: 'Visitas Únicas', value: '12,402', trend: '+8.1%', icon: Users, color: 'text-primary', up: true },
                { label: 'Tasa Conversión', value: '3.2%', trend: '-1.4%', icon: TrendingUp, color: 'text-violet-500', up: false },
                { label: 'Ticket Promedio', value: '$84.50', trend: '+4.3%', icon: ShoppingBag, color: 'text-amber-500', up: true },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className={cn("w-7 h-7", stat.color)} />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      stat.up ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                    )}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-[10px] uppercase font-black tracking-widest mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white italic">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Ventas vs Visitas</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Tendencia semanal</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ventas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Visitas</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6321" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8E9299', fontSize: 10, fontWeight: 900 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8E9299', fontSize: 10, fontWeight: 900 }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#141414', 
                          border: 'none', 
                          borderRadius: '16px', 
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Area type="monotone" dataKey="ventas" stroke="#FF6321" strokeWidth={4} fillOpacity={1} fill="url(#colorVentas)" />
                      <Area type="monotone" dataKey="visitas" stroke="#E6E6E6" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-10">Ventas por Categoría</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-10 space-y-4">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{cat.name}</span>
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{((cat.value / 1200) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic mb-10">Pedidos por Día</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8E9299', fontSize: 10, fontWeight: 900 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8E9299', fontSize: 10, fontWeight: 900 }} 
                      />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="pedidos" fill="#FF6321" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-zinc-900 text-white p-10 lg:p-12 rounded-[3rem] shadow-2xl shadow-zinc-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-8 leading-none">Resumen de <br/>Conversión</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Añadido al Carrito', value: '1,240', percent: 85 },
                      { label: 'Checkout Iniciado', value: '890', percent: 62 },
                      { label: 'Compra Completada', value: '450', percent: 32 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                          <span className="text-xl font-black italic">{item.value}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Tasa de Abandono</p>
                    <p className="text-4xl font-black italic text-red-400">68%</p>
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

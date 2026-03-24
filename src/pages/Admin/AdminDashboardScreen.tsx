import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, Package, ShoppingBag, TrendingUp, Users, 
  AlertTriangle, CheckCircle, DollarSign, ArrowUpRight,
  ArrowDownRight, Eye, MoreVertical, ChevronRight, Zap,
  Clock, Star, Truck, CreditCard, ArrowRight, X,
  PieChart as PieChartIcon, Activity, RefreshCw, TrendingDown,
  Package2, ShoppingCart, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useProducts } from '../../context/ProductContext';
import { useOrders, Order } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPriceCOP } from '../../lib/utils';

export const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { orders, getStats, updateOrderStatus } = useOrders();
  const { getLogo, getStoreName } = useStore();
  const { theme } = useTheme();
  const stats = getStats();
  const isDark = theme === 'dark';
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Buenos días', emoji: '☀️' };
    if (hour >= 12 && hour < 18) return { text: 'Buenas tardes', emoji: '🌤️' };
    if (hour >= 18 && hour < 21) return { text: 'Buenas tardes', emoji: '🌅' };
    return { text: 'Buenas noches', emoji: '🌙' };
  };

  const greeting = getGreeting();

  const statsData = useMemo(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + o.total, 0);
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 3).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;
    
    return {
      pendingOrders,
      processingOrders,
      deliveredOrders,
      shippedOrders,
      totalRevenue,
      lowStockProducts,
      outOfStock,
      totalProducts,
      totalOrders,
      averageOrderValue,
      stats,
    };
  }, [orders, products, stats]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [orders]);

  const topProducts = useMemo(() => {
    const productSales: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId] += item.quantity;
        } else {
          productSales[item.productId] = item.quantity;
        }
      });
    });
    
    return products
      .map(p => ({ ...p, sales: productSales[p.id] || 0 }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders, products]);

  const statusDistribution = useMemo(() => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    return statuses.map(status => ({
      status,
      count: orders.filter(o => o.status === status).length,
      percentage: orders.length > 0 ? (orders.filter(o => o.status === status).length / orders.length) * 100 : 0,
    }));
  }, [orders]);

  const pieChartPaths = useMemo(() => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#a855f7',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    const total = statusDistribution.reduce((sum, s) => sum + s.count, 0);
    if (total === 0) return [];
    
    let currentAngle = 0;
    return statusDistribution.map(item => {
      if (item.count === 0) return null;
      
      const angle = (item.count / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const x1 = 100 + 70 * Math.cos(startRad);
      const y1 = 100 + 70 * Math.sin(startRad);
      const x2 = 100 + 70 * Math.cos(endRad);
      const y2 = 100 + 70 * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      return {
        status: item.status,
        color: colors[item.status],
        percentage: item.percentage,
        count: item.count,
        path: `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`,
      };
    }).filter(Boolean);
  }, [statusDistribution]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const floatAnimation = {
    y: [0, -5, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 h-16 lg:h-24 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 lg:gap-5">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl overflow-hidden shadow-xl border-2 border-white dark:border-zinc-700"
              >
                <img src={getLogo()} alt={getStoreName()} className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h2 className="text-primary text-base lg:text-2xl font-black tracking-tight uppercase">
                  {getStoreName()}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest">
                  Panel de Administración
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 lg:p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors relative"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-700 dark:text-zinc-300" />
                <motion.span
                  animate={pulseAnimation}
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-primary rounded-full border-2 border-white dark:border-zinc-900"
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-black text-xs lg:text-sm shadow-lg shadow-primary/30"
              >
                AD
              </motion.button>
            </div>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-4 lg:py-8 px-4 lg:px-8"
        >
          <motion.div variants={itemVariants} className="mb-6 lg:mb-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-2xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {greeting.text}
                </h1>
                <motion.span
                  animate={floatAnimation}
                  className="text-2xl lg:text-5xl"
                >
                  {greeting.emoji}
                </motion.span>
              </motion.div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm lg:text-lg">
                Aquí está el resumen de tu tienda hoy
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/new-product')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl text-xs lg:text-sm font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Nuevo Producto</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-10">
            {[
              {
                label: 'Ingresos Totales',
                value: `$${formatPriceCOP(statsData.totalRevenue)}`,
                trend: '+15.2%',
                trendUp: true,
                icon: DollarSign,
                gradient: 'from-emerald-400 to-teal-600',
              },
              {
                label: 'Pedidos Totales',
                value: statsData.totalOrders.toString(),
                trend: '+8.3%',
                trendUp: true,
                icon: ShoppingBag,
                gradient: 'from-primary to-purple-600',
              },
              {
                label: 'Productos',
                value: statsData.totalProducts.toString(),
                trend: '+5',
                trendUp: true,
                icon: Package2,
                gradient: 'from-violet-400 to-purple-600',
              },
              {
                label: 'Stock Bajo',
                value: statsData.lowStockProducts.toString(),
                trend: statsData.lowStockProducts > 0 ? 'Alerta' : 'OK',
                trendUp: statsData.lowStockProducts === 0,
                icon: AlertTriangle,
                gradient: statsData.lowStockProducts > 0 ? 'from-amber-400 to-orange-500' : 'from-emerald-400 to-teal-500',
              },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative overflow-hidden bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-3xl`} />
                
                <div className="flex flex-col gap-3 lg:gap-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] lg:text-xs font-bold ${
                        stat.trendUp 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : stat.label === 'Stock Bajo' && statsData.lowStockProducts > 0
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}
                    >
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{stat.trend}</span>
                    </motion.div>
                  </div>
                  
                  <div>
                    <p className="text-zinc-400 dark:text-zinc-500 text-[9px] lg:text-[11px] uppercase font-bold tracking-wider">{stat.label}</p>
                    <p className="text-zinc-900 dark:text-white text-xl lg:text-3xl font-black mt-1">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-10">
            <div className="bg-white dark:bg-zinc-900 p-5 lg:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg">
                  <PieChartIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-xl font-black text-zinc-900 dark:text-white">Estado de Pedidos</h3>
                  <p className="text-zinc-400 text-xs font-medium">Distribución actual</p>
                </div>
              </div>

              <div className="relative mb-6">
                <svg className="w-full h-40" viewBox="0 0 200 200">
                  {pieChartPaths.map((item, i) => item && (
                    <motion.path
                      key={item.status}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      d={item.path}
                      fill={item.color}
                      className="drop-shadow-lg"
                    />
                  ))}
                  
                  <circle cx="100" cy="100" r="50" className="fill-white dark:fill-zinc-900" />
                  <text x="100" y="95" textAnchor="middle" className="fill-zinc-900 dark:fill-white text-lg font-black">
                    {orders.length}
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500 text-[10px]">
                    pedidos
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'pending', label: 'Pendientes', color: 'bg-amber-500' },
                  { status: 'processing', label: 'Procesando', color: 'bg-blue-500' },
                  { status: 'shipped', label: 'Enviados', color: 'bg-purple-500' },
                  { status: 'delivered', label: 'Entregados', color: 'bg-emerald-500' },
                ].map((item) => {
                  const count = orders.filter(o => o.status === item.status).length;
                  return (
                    <div key={item.status} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{item.label}</span>
                      <span className="ml-auto text-xs font-black text-zinc-900 dark:text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 lg:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base lg:text-xl font-black text-zinc-900 dark:text-white">Pedidos Recientes</h3>
                  <p className="text-zinc-400 text-xs font-medium">Última actividad</p>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <p className="text-sm text-zinc-400 font-medium">No hay pedidos todavía</p>
                  </div>
                ) : (
                  recentOrders.slice(0, 5).map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        order.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/50' :
                        order.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/50' :
                        order.status === 'shipped' ? 'bg-purple-100 dark:bg-purple-900/50' :
                        order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-900/50' :
                        'bg-red-100 dark:bg-red-900/50'
                      }`}>
                        {order.status === 'pending' ? <Clock className="w-5 h-5 text-amber-500" /> :
                         order.status === 'processing' ? <Package className="w-5 h-5 text-blue-500" /> :
                         order.status === 'shipped' ? <Truck className="w-5 h-5 text-purple-500" /> :
                         order.status === 'delivered' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                         <AlertTriangle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white">#{order.id}</p>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' :
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                          }`}>
                            {order.status === 'pending' ? 'Pendiente' :
                             order.status === 'processing' ? 'Procesando' :
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary">${formatPriceCOP(order.total)}</p>
                        <p className="text-[10px] text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-5 lg:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-xl font-black text-zinc-900 dark:text-white">Productos Más Vendidos</h3>
                    <p className="text-zinc-400 text-xs font-medium">Top rendimiento</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/inventory')}
                  className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                >
                  Ver Todo <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {topProducts.map((prod, i) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer group"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg"
                    >
                      {i + 1}
                    </motion.div>
                    <img src={prod.image} className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl object-cover shadow-md" alt={prod.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-bold text-zinc-900 dark:text-white truncate">{prod.name}</p>
                      <p className="text-xs text-zinc-400 font-medium">{prod.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-primary">${formatPriceCOP(prod.offerPrice || prod.price)}</span>
                        <span className="text-[10px] text-zinc-400">• {prod.sales} ventas</span>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        (prod.stock || 0) > 10 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                          : (prod.stock || 0) > 3 
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                      }`}>
                        Stock: {prod.stock || 0}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="bg-gradient-to-br from-primary via-purple-600 to-pink-600 p-5 lg:p-8 rounded-3xl shadow-2xl shadow-primary/30">
                <div className="flex items-center gap-3 mb-5">
                  <Zap className="w-6 h-6 text-white" />
                  <h3 className="text-base lg:text-xl font-black text-white">Acciones Rápidas</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: Plus, label: 'Nuevo Producto', path: '/admin/new-product' },
                    { icon: Eye, label: 'Ver Pedidos', path: '/admin/orders' },
                    { icon: Package, label: 'Gestionar Stock', path: '/admin/inventory' },
                    { icon: UserPlus, label: 'Agregar Cliente', path: '/admin' },
                  ].map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center gap-3 p-3 bg-white/15 hover:bg-white/25 rounded-xl transition-all text-left group"
                    >
                      <action.icon className="w-5 h-5 text-white" />
                      <span className="text-sm font-bold text-white flex-1">{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 lg:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-xl font-black text-zinc-900 dark:text-white">Métodos de Pago</h3>
                    <p className="text-zinc-400 text-xs font-medium">Distribución</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Efectivo', count: orders.filter(o => o.paymentMethod === 'efectivo').length, icon: DollarSign, color: 'bg-emerald-500' },
                    { label: 'Transferencia', count: orders.filter(o => o.paymentMethod === 'transferencia').length, icon: CreditCard, color: 'bg-blue-500' },
                    { label: 'Contraentrega', count: orders.filter(o => o.paymentMethod === 'contraentrega').length, icon: Truck, color: 'bg-purple-500' },
                  ].map((method) => (
                    <div key={method.label} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className={`w-8 h-8 rounded-lg ${method.color} flex items-center justify-center`}>
                        <method.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex-1">{method.label}</span>
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{method.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.main>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedOrder.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/50' :
                    selectedOrder.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/50' :
                    selectedOrder.status === 'shipped' ? 'bg-purple-100 dark:bg-purple-900/50' :
                    selectedOrder.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-900/50' :
                    'bg-red-100 dark:bg-red-900/50'
                  }`}>
                    {selectedOrder.status === 'pending' ? <Clock className="w-5 h-5 text-amber-500" /> :
                     selectedOrder.status === 'processing' ? <Package className="w-5 h-5 text-blue-500" /> :
                     selectedOrder.status === 'shipped' ? <Truck className="w-5 h-5 text-purple-500" /> :
                     selectedOrder.status === 'delivered' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                     <AlertTriangle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">Pedido #{selectedOrder.id}</h2>
                    <p className="text-xs text-zinc-500">{new Date(selectedOrder.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                    selectedOrder.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' :
                    selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' :
                    selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' :
                    selectedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' :
                    'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                  }`}>
                    {selectedOrder.status === 'pending' ? 'Pendiente' :
                     selectedOrder.status === 'processing' ? 'Procesando' :
                     selectedOrder.status === 'shipped' ? 'Enviado' :
                     selectedOrder.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    selectedOrder.paymentMethod === 'efectivo' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' :
                    selectedOrder.paymentMethod === 'transferencia' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                  }`}>
                    {selectedOrder.paymentMethod === 'efectivo' ? '💵 Efectivo' :
                     selectedOrder.paymentMethod === 'transferencia' ? '💳 Transferencia' : '📦 Contraentrega'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Cliente</h3>
                    <p className="font-bold text-zinc-900 dark:text-white">{selectedOrder.customer}</p>
                    <p className="text-sm text-zinc-500">{selectedOrder.email}</p>
                    <p className="text-sm text-zinc-500">{selectedOrder.phone}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Dirección</h3>
                    <p className="text-sm text-zinc-900 dark:text-white">{selectedOrder.address}</p>
                    <p className="text-sm text-zinc-500">{selectedOrder.city}, {selectedOrder.department}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Productos</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">Talla: {item.size} • Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-black text-primary">${formatPriceCOP(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium text-zinc-900 dark:text-white">${formatPriceCOP(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Envío</span>
                    <span className="font-medium text-zinc-900 dark:text-white">${formatPriceCOP(selectedOrder.shipping)}</span>
                  </div>
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-500">Descuento ({selectedOrder.couponCode})</span>
                      <span className="font-medium text-emerald-500">-${formatPriceCOP(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                    <span className="font-black text-xl text-primary">${formatPriceCOP(selectedOrder.total)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Estado del Pedido</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                      <div
                        key={status}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-default ${
                          selectedOrder.status === status
                            ? status === 'pending' ? 'bg-amber-500 text-white' :
                              status === 'processing' ? 'bg-blue-500 text-white' :
                              status === 'shipped' ? 'bg-purple-500 text-white' :
                              status === 'delivered' ? 'bg-emerald-500 text-white' :
                              'bg-red-500 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
                        }`}
                      >
                        {status === 'pending' ? 'Pendiente' :
                         status === 'processing' ? 'Procesando' :
                         status === 'shipped' ? 'Enviado' :
                         status === 'delivered' ? 'Entregado' : 'Cancelado'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

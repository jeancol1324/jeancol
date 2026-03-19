import React from 'react';
import { Layout, Package, ShoppingBag, Users, BarChart3, Bell, Settings, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'adminDashboard', label: 'Inicio', icon: Layout, path: '/admin' },
    { id: 'adminInventory', label: 'Stock', icon: Package, path: '/admin/inventory' },
    { id: 'adminOrders', label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'adminAnalytics', label: 'Reportes', icon: BarChart3, path: '/admin/analytics' },
    { id: 'adminNotifications', label: 'Alertas', icon: Bell, path: '/admin/notifications' },
    { id: 'adminSettings', label: 'Ajustes', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-zinc-100 h-screen sticky top-0 p-5">
        <div className="mb-8">
          <Link to="/admin" className="text-primary text-xl font-black tracking-tighter uppercase">ADMIN PANEL</Link>
          <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">v2.5.0 Pro</p>
        </div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isActive(item.path) 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-zinc-100">
          <Link 
            to="/admin/profile"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all mb-2 ${
              isActive('/admin/profile') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[8px]">AD</div>
            Perfil
          </Link>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Salir
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-zinc-100 px-0.5 py-0.5 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all min-w-[48px] ${
              isActive(item.path) ? 'text-primary' : 'text-zinc-400'
            }`}
          >
            <item.icon className={`w-3.5 h-3.5 ${isActive(item.path) ? 'scale-110' : ''}`} />
            <span className="text-[6px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
          </Link>
        ))}
        <Link
          to="/admin/profile"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all min-w-[48px] ${
            isActive('/admin/profile') ? 'text-primary' : 'text-zinc-400'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[5px] ${isActive('/admin/profile') ? 'ring-1 ring-primary ring-offset-1' : ''}`}>AD</div>
          <span className="text-[6px] font-black uppercase tracking-tighter leading-none">Perfil</span>
        </Link>
      </nav>
    </>
  );
};

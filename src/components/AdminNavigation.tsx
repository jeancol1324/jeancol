import React from 'react';
import { Layout, Package, ShoppingBag, Bell, Settings, ArrowLeft, Palette, FolderTree, Star, Ticket, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const navItems = [
    { id: 'adminDashboard', label: 'Inicio', icon: Layout, path: '/admin' },
    { id: 'adminHomeEditor', label: 'Editar Home', icon: Home, path: '/admin/home-editor' },
    { id: 'adminCategories', label: 'Categorías', icon: FolderTree, path: '/admin/categories' },
    { id: 'adminInventory', label: 'Stock', icon: Package, path: '/admin/inventory' },
    { id: 'adminOrders', label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'adminReviews', label: 'Reseñas', icon: Star, path: '/admin/reviews' },
    { id: 'adminCoupons', label: 'Cupones', icon: Ticket, path: '/admin/coupons' },
    { id: 'adminNotifications', label: 'Alertas', icon: Bell, path: '/admin/notifications' },
    { id: 'adminTheme', label: 'Tema', icon: Palette, path: '/admin/theme' },
    { id: 'adminSettings', label: 'Config', icon: Settings, path: '/admin/settings' },
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
      <aside className={`hidden lg:flex flex-col w-60 h-screen sticky top-0 p-5 ${
        isDark 
          ? 'bg-zinc-900 border-zinc-800' 
          : 'bg-white border-zinc-100'
      }`}>
        <div className="mb-8">
          <Link to="/admin" className="text-primary text-xl font-black tracking-tighter uppercase">ADMIN PANEL</Link>
          <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>v2.5.0 Pro</p>
        </div>
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isActive(item.path) 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : isDark
                    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={`pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <Link 
            to="/admin/profile"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all mb-2 ${
              isActive('/admin/profile') 
                ? isDark ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
                : isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-400 hover:bg-zinc-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${isDark ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'}`}>AD</div>
            Perfil
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('adminAuthenticated');
              navigate('/admin/login');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isDark 
                ? 'text-red-400 hover:bg-red-900/20' 
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Salir
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 px-0.5 py-0.5 flex justify-around items-center z-50 ${
        isDark 
          ? 'bg-zinc-900/95 border-zinc-800' 
          : 'bg-white/95 backdrop-blur-xl border-zinc-100'
      } ${isDark ? 'shadow-[0_-4px_20px_rgba(0,0,0,0.3)]' : 'shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'}`}>
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all min-w-[48px] ${
              isActive(item.path) ? 'text-primary' : isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            <item.icon className={`w-3.5 h-3.5 ${isActive(item.path) ? 'scale-110' : ''}`} />
            <span className="text-[6px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
          </Link>
        ))}
        <Link
          to="/admin/profile"
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all min-w-[48px] ${
            isActive('/admin/profile') ? 'text-primary' : isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[5px] ${
            isDark 
              ? 'bg-zinc-100 text-zinc-900' 
              : 'bg-zinc-900 text-white'
          } ${isActive('/admin/profile') ? 'ring-1 ring-primary ring-offset-1' : ''}`}>AD</div>
          <span className="text-[6px] font-black uppercase tracking-tighter leading-none">Perfil</span>
        </Link>
      </nav>
    </>
  );
};

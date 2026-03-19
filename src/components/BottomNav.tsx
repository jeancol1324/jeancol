import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Tag, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const { totalItems } = useCart();

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Search, label: 'Buscar', path: '/search' },
    { icon: ShoppingBag, label: 'Carrito', path: '/cart', badge: totalItems },
    { icon: Tag, label: 'Ofertas', path: '/offers' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-4 pb-safe pt-2">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all relative",
              isActive ? "text-primary bg-primary/10" : "text-zinc-500"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-950">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

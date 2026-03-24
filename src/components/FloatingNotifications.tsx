import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, Star, X, Check, Clock, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useReviews } from '../context/ReviewContext';

interface Notification {
  id: string;
  type: 'order' | 'review';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export const FloatingNotifications: React.FC = () => {
  const location = useLocation();
  const { pendingReviews, getPendingCount } = useReviews();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const saved = localStorage.getItem('admin_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications([
        { id: '1', type: 'order', title: 'Nuevo pedido', message: 'Pedido #1234 recibido', time: 'Hace 5 min', read: false, link: '/admin/orders' },
        { id: '2', type: 'review', title: 'Nueva reseña', message: 'María G. dejó una reseña', time: 'Hace 1 hora', read: false, link: '/admin/reviews' },
      ]);
    }
  }, []);

  useEffect(() => {
    const pendingCount = getPendingCount();
    if (pendingCount > 0) {
      const hasPendingNotification = notifications.some(n => n.type === 'review' && n.title === 'Reseña pendiente');
      if (!hasPendingNotification) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'review',
          title: 'Reseña pendiente',
          message: `${pendingCount} reseña(s) esperando aprobación`,
          time: 'Ahora',
          read: false,
          link: '/admin/reviews',
        };
        const updated = [newNotification, ...notifications.filter(n => n.title !== 'Reseña pendiente')];
        setNotifications(updated);
        localStorage.setItem('admin_notifications', JSON.stringify(updated));
      }
    }
  }, [pendingReviews.length]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-32 right-4 z-50 w-80 max-h-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                      {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Marcar todo leído
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.link || '#'}
                      onClick={() => {
                        markAsRead(notification.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800/50 ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'order' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      }`}>
                        {notification.type === 'order' ? (
                          <Package className="w-5 h-5" />
                        ) : (
                          <Star className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{notification.title}</p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{notification.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span className="text-[10px] text-zinc-400">{notification.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-zinc-400" />
                      </button>
                    </Link>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <Link
                  to="/admin/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Ver todas las notificaciones
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

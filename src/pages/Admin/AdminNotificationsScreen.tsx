import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, AlertTriangle, User, Settings } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';

export const AdminNotificationsScreen = () => (
  <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
    <AdminNavigation />
    <div className="flex-1">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
        <Container className="flex items-center justify-between">
          <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">ALERTAS</h2>
          <button className="text-[8px] lg:text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-primary transition-colors">Marcar todo como leído</button>
        </Container>
      </header>
      <main className="py-3 lg:py-8">
        <Container className="max-w-2xl">
          <div className="space-y-2 lg:space-y-4">
            {[
              { title: 'Nuevo pedido recibido', desc: 'El pedido #8429 ha sido pagado y está listo para envío.', time: 'Hace 5 min', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/5', unread: true },
              { title: 'Stock bajo: Jean Slim Fit', desc: 'Quedan menos de 5 unidades en el inventario central.', time: 'Hace 2h', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', unread: true },
              { title: 'Nuevo cliente registrado', desc: 'Carlos Ruiz se ha unido a la plataforma.', time: 'Hace 4h', icon: User, color: 'text-violet-500', bg: 'bg-violet-50', unread: false },
              { title: 'Actualización de sistema', desc: 'Se han aplicado mejoras en el panel de analíticas.', time: 'Ayer', icon: Settings, color: 'text-zinc-400', bg: 'bg-zinc-50', unread: false },
            ].map((notif, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-2.5 lg:p-5 rounded-xl lg:rounded-2xl border ${notif.unread ? 'bg-white border-primary/10 shadow-sm' : 'bg-zinc-50/50 border-zinc-100'} flex gap-2.5 lg:gap-4 relative group cursor-pointer hover:border-primary/20 transition-all`}
              >
                {notif.unread && <div className="absolute top-2.5 right-2.5 w-1 h-1 bg-primary rounded-full"></div>}
                <div className={`w-7 h-7 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl ${notif.bg} flex items-center justify-center shrink-0`}>
                  <notif.icon className={`w-3.5 h-3.5 lg:w-6 lg:h-6 ${notif.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[9px] lg:text-sm font-black text-zinc-900 mb-0.5">{notif.title}</h3>
                  <p className="text-[7px] lg:text-xs font-medium text-zinc-500 leading-tight mb-1">{notif.desc}</p>
                  <span className="text-[6px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{notif.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  </div>
);

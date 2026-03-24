import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';

export const AdminProfileScreen = () => (
  <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
    <AdminNavigation />
    <div className="flex-1">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center px-4 lg:px-8">
        <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">MI PERFIL</h2>
      </header>
      <main className="py-3 lg:py-8 px-4 lg:px-8">
          <div className="bg-white rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="h-20 lg:h-32 bg-zinc-900 relative">
              <div className="absolute -bottom-8 left-6 lg:left-10 w-16 h-16 lg:w-28 lg:h-28 rounded-xl lg:rounded-3xl bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-lg lg:rounded-2xl bg-primary flex items-center justify-center text-white text-xl lg:text-4xl font-black">
                  AD
                </div>
              </div>
            </div>
            <div className="pt-10 lg:pt-20 pb-5 lg:pb-10 px-5 lg:px-10">
              <div className="flex justify-between items-start mb-5 lg:mb-10">
                <div>
                  <h3 className="text-base lg:text-2xl font-black text-zinc-900">Admin JEANSCOL</h3>
                  <p className="text-[8px] lg:text-sm font-bold text-zinc-400 uppercase tracking-widest">Super Administrador</p>
                </div>
                <button className="px-3 py-1 lg:px-6 lg:py-2 bg-zinc-900 text-white rounded-full text-[7px] lg:text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-zinc-900/10">Editar</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-8">
                {[
                  { label: 'Email', val: 'admin@jeanscol.com', icon: Mail },
                  { label: 'Teléfono', val: '+57 300 123 4567', icon: Phone },
                  { label: 'Ubicación', val: 'Medellín, Colombia', icon: MapPin },
                  { label: 'Miembro desde', val: 'Enero 2024', icon: Calendar },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 lg:gap-4 p-2.5 lg:p-4 bg-zinc-50 rounded-xl lg:rounded-2xl">
                    <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <item.icon className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[6px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-[9px] lg:text-sm font-bold text-zinc-900">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </main>
    </div>
  </div>
);

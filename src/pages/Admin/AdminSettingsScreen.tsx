import React from 'react';
import { Layout, ShieldCheck } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { Container } from '../../components/Container';

export const AdminSettingsScreen = () => (
  <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50/50">
    <AdminNavigation />
    <div className="flex-1">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
        <Container>
          <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">AJUSTES</h2>
        </Container>
      </header>
      <main className="py-3 lg:py-8">
        <Container className="max-w-3xl">
          <div className="space-y-3 lg:space-y-6">
            <section className="bg-white p-3 lg:p-6 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
              <h3 className="text-[9px] lg:text-xs font-black text-zinc-900 uppercase tracking-widest mb-3 lg:mb-6 flex items-center gap-2">
                <Layout className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                General
              </h3>
              <div className="space-y-2.5 lg:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-4">
                  <div className="space-y-1">
                    <label className="text-[6px] lg:text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre de la Tienda</label>
                    <input type="text" defaultValue="JEANCOL Professional" className="w-full bg-zinc-50 border-none rounded-lg h-8 lg:h-12 px-2.5 lg:px-4 font-bold text-[8px] lg:text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[6px] lg:text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email de Contacto</label>
                    <input type="email" defaultValue="admin@jeancol.com" className="w-full bg-zinc-50 border-none rounded-lg h-8 lg:h-12 px-2.5 lg:px-4 font-bold text-[8px] lg:text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[6px] lg:text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">Moneda</label>
                  <select className="w-full bg-zinc-50 border-none rounded-lg h-8 lg:h-12 px-2.5 lg:px-4 font-bold text-[8px] lg:text-xs appearance-none">
                    <option>USD ($)</option>
                    <option>COP ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white p-3 lg:p-6 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm">
              <h3 className="text-[9px] lg:text-xs font-black text-zinc-900 uppercase tracking-widest mb-3 lg:mb-6 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                Seguridad
              </h3>
              <div className="space-y-2.5 lg:space-y-4">
                <div className="flex items-center justify-between p-2 lg:p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="text-[8px] lg:text-xs font-black text-zinc-900">Autenticación de dos pasos</p>
                    <p className="text-[6px] lg:text-[10px] font-medium text-zinc-500">Añade una capa extra de seguridad.</p>
                  </div>
                  <div className="w-6 h-3 bg-zinc-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <button className="w-full py-1.5 bg-zinc-900 text-white rounded-lg text-[7px] lg:text-[10px] font-black uppercase tracking-widest">Cambiar Contraseña</button>
              </div>
            </section>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-2.5 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Guardar Cambios</button>
              <button className="px-4 lg:px-6 py-2.5 lg:py-4 bg-zinc-100 text-zinc-500 rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-xs uppercase tracking-widest">Restaurar</button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  </div>
);

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Files, Settings2, Upload, Plus, Tag, Clock, Zap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/Container';
import { CATEGORIES } from '../../constants';

export const AdminNewProductScreen = () => {
  const navigate = useNavigate();
  const [hasOffer, setHasOffer] = useState(false);
  const [offerDuration, setOfferDuration] = useState<number>(24);
  const [offerUnit, setOfferUnit] = useState<'hours' | 'days' | 'weeks' | 'months'>('hours');
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');

  useEffect(() => {
    if (hasOffer) {
      const now = new Date();
      const endDate = new Date(now);
      
      switch (offerUnit) {
        case 'hours':
          endDate.setHours(endDate.getHours() + offerDuration);
          break;
        case 'days':
          endDate.setDate(endDate.getDate() + offerDuration);
          break;
        case 'weeks':
          endDate.setDate(endDate.getDate() + (offerDuration * 7));
          break;
        case 'months':
          endDate.setMonth(endDate.getMonth() + offerDuration);
          break;
      }
      
      setCalculatedEndDate(endDate.toISOString().slice(0, 16));
    }
  }, [hasOffer, offerDuration, offerUnit]);

  const formatEndDate = () => {
    if (!calculatedEndDate) return '';
    const date = new Date(calculatedEndDate);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pb-32 lg:pb-10">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 h-14 lg:h-20 flex items-center">
        <Container className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/inventory')} 
            className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-900" />
          </button>
          <h1 className="text-lg lg:text-2xl font-black text-zinc-900 tracking-tight">Nuevo Producto</h1>
        </Container>
      </header>

    <main className="py-4 lg:py-12">
      <Container className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12">
          <div className="lg:col-span-2 space-y-4 lg:space-y-10">
            <section className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm space-y-4 lg:space-y-8">
              <h2 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 lg:gap-3">
                <Files className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                Información General
              </h2>
              
              <div className="space-y-3 lg:space-y-6">
                <div className="space-y-1">
                  <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nombre del Producto</label>
                  <input 
                    className="w-full bg-zinc-50 border-none rounded-xl h-10 lg:h-16 px-4 lg:px-6 font-bold text-zinc-900 text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Ej. Jean Slim Fit Azul Profundo" 
                    type="text" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Descripción Detallada</label>
                  <textarea 
                    className="w-full bg-zinc-50 border-none rounded-xl p-3 lg:p-6 font-medium text-zinc-600 text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="Describe los materiales, ajuste y detalles técnicos..." 
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </section>

            <section className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm space-y-4 lg:space-y-8">
              <h2 className="text-[10px] lg:text-lg font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 lg:gap-3">
                <Settings2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-primary" />
                Categorización y Precio
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8">
                <div className="space-y-1">
                  <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full bg-zinc-50 border-none rounded-xl h-10 lg:h-16 px-4 lg:px-6 font-bold text-zinc-900 text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                    <option>Seleccionar categoría</option>
                    {CATEGORIES.map(cat => <option key={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Precio de Venta ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-zinc-400">$</span>
                    <input 
                      className="w-full bg-zinc-50 border-none rounded-xl h-10 lg:h-16 pl-8 pr-4 font-black text-zinc-900 text-[10px] lg:text-base focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="0.00" 
                      type="number" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Oferta Section */}
            <section className={`p-4 lg:p-8 rounded-xl lg:rounded-3xl border shadow-sm space-y-4 lg:space-y-8 transition-all ${
              hasOffer 
                ? 'bg-gradient-to-br from-primary/5 to-orange-500/5 border-primary/20' 
                : 'bg-zinc-50 border-zinc-100'
            }`}>
              <h2 className={`text-[10px] lg:text-lg font-black uppercase tracking-widest flex items-center gap-2 lg:gap-3 ${
                hasOffer ? 'text-primary' : 'text-zinc-400'
              }`}>
                <Zap className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                Configurar Oferta
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setHasOffer(!hasOffer)}
                    className={`relative w-12 h-7 rounded-full transition-all ${
                      hasOffer ? 'bg-primary' : 'bg-zinc-300'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        hasOffer ? 'left-6' : 'left-1'
                      }`} 
                    />
                  </button>
                  <label className="text-[10px] lg:text-sm font-bold text-zinc-700">
                    {hasOffer ? 'Oferta activada' : 'Activar oferta para este producto'}
                  </label>
                </div>

                {hasOffer && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
                      <div className="space-y-1">
                        <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Precio en Oferta ($)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                          <input 
                            className="w-full bg-white border-2 border-primary/20 rounded-xl h-10 lg:h-14 pl-8 pr-4 font-black text-primary text-[10px] lg:text-base focus:border-primary focus:ring-0 transition-all" 
                            placeholder="0.00" 
                            type="number" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Duración de la Oferta
                        </label>
                        <div className="flex gap-2">
                          <input 
                            className="w-20 bg-white border-2 border-primary/20 rounded-xl h-10 lg:h-14 px-3 font-black text-zinc-900 text-[10px] lg:text-base focus:border-primary focus:ring-0 transition-all" 
                            type="number"
                            min="1"
                            value={offerDuration}
                            onChange={(e) => setOfferDuration(Math.max(1, parseInt(e.target.value) || 1))}
                          />
                          <select 
                            value={offerUnit}
                            onChange={(e) => setOfferUnit(e.target.value as any)}
                            className="flex-1 bg-white border-2 border-primary/20 rounded-xl h-10 lg:h-14 px-3 font-medium text-zinc-700 text-[10px] lg:text-sm focus:border-primary focus:ring-0 transition-all appearance-none"
                          >
                            <option value="hours">Horas</option>
                            <option value="days">Días</option>
                            <option value="weeks">Semanas</option>
                            <option value="months">Meses</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Duración rápida */}
                    <div className="space-y-2">
                      <label className="text-[7px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Duración rápida
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => { setOfferDuration(24); setOfferUnit('hours'); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            offerDuration === 24 && offerUnit === 'hours'
                              ? 'bg-primary text-white'
                              : 'bg-white border border-zinc-200 text-zinc-600 hover:border-primary'
                          }`}
                        >
                          24 horas
                        </button>
                        <button
                          type="button"
                          onClick={() => { setOfferDuration(3); setOfferUnit('days'); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            offerDuration === 3 && offerUnit === 'days'
                              ? 'bg-primary text-white'
                              : 'bg-white border border-zinc-200 text-zinc-600 hover:border-primary'
                          }`}
                        >
                          3 días
                        </button>
                        <button
                          type="button"
                          onClick={() => { setOfferDuration(1); setOfferUnit('weeks'); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            offerDuration === 1 && offerUnit === 'weeks'
                              ? 'bg-primary text-white'
                              : 'bg-white border border-zinc-200 text-zinc-600 hover:border-primary'
                          }`}
                        >
                          1 semana
                        </button>
                        <button
                          type="button"
                          onClick={() => { setOfferDuration(1); setOfferUnit('months'); }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            offerDuration === 1 && offerUnit === 'months'
                              ? 'bg-primary text-white'
                              : 'bg-white border border-zinc-200 text-zinc-600 hover:border-primary'
                          }`}
                        >
                          1 mes
                        </button>
                      </div>
                    </div>

                    {/* Fecha calculada */}
                    {calculatedEndDate && (
                      <div className="bg-white rounded-xl p-4 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            La oferta expirará el:
                          </span>
                        </div>
                        <p className="text-lg font-black text-primary">
                          {formatEndDate()}
                        </p>
                      </div>
                    )}

                    {/* Preview del descuento */}
                    <div className="bg-white rounded-xl p-4 border border-primary/10">
                      <p className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Vista Previa:</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-zinc-400 line-through text-lg font-bold">$89.99</div>
                        <div className="text-primary text-2xl font-black">$59.99</div>
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-black">-33%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-4 lg:space-y-8">
            <section className="bg-white p-4 lg:p-8 rounded-xl lg:rounded-3xl border border-zinc-100 shadow-sm space-y-3 lg:space-y-6">
              <h2 className="text-[9px] lg:text-sm font-black text-zinc-900 uppercase tracking-widest">Multimedia</h2>
              <div className="border-2 border-dashed border-zinc-100 rounded-xl lg:rounded-3xl p-4 lg:p-8 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 hover:border-primary/30 transition-all cursor-pointer group aspect-square">
                <div className="w-8 h-8 lg:w-16 lg:h-16 rounded-lg lg:rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-2 lg:mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
                <p className="text-[9px] lg:text-xs font-black text-zinc-900 uppercase tracking-widest mb-0.5">Subir Imagen</p>
                <p className="text-[7px] lg:text-[10px] text-zinc-400 font-bold">JPG, PNG (máx. 5MB)</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                    <Plus className="w-3 h-3" />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-2 lg:gap-4">
              <button className="w-full h-10 lg:h-16 bg-primary text-white rounded-xl text-[9px] lg:text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-zinc-900 transition-all">
                Guardar Producto
              </button>
              <button 
                onClick={() => navigate('/admin/inventory')} 
                className="w-full h-10 lg:h-16 bg-zinc-100 text-zinc-500 rounded-xl text-[9px] lg:text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  </div>
  );
};

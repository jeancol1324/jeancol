import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Phone,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const footerLinks = {
  shop: [
    { name: 'Novedades', href: '/categories' },
    { name: 'Hombres', href: '/categories' },
    { name: 'Mujeres', href: '/categories' },
    { name: 'Accesorios', href: '/categories' },
    { name: 'Ofertas', href: '/offers' },
  ],
  support: [
    { name: 'Ayuda & FAQ', href: '#' },
    { name: 'Envíos', href: '#' },
    { name: 'Devoluciones', href: '#' },
    { name: 'Guía de Tallas', href: '#' },
    { name: 'Contacto', href: '#' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '#' },
    { name: 'Sostenibilidad', href: '#' },
    { name: 'Carreras', href: '#' },
    { name: 'Prensa', href: '#' },
    { name: 'Términos', href: '#' },
  ]
};

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-y-1/2" />

      <div className="w-full px-4 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center pb-12 border-b border-white/10">
          <div className="space-y-4">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Newsletter
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter italic leading-none">
              Únete al <span className="text-primary">Inner Circle</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-md">
              Recibe acceso anticipado a drops exclusivos y contenido curado.
            </p>
          </div>

          <div className="relative">
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="Tu email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm"
                />
              </div>
              <button className="bg-white text-zinc-950 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                Unirse
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-zinc-500 mt-3 uppercase tracking-wide font-medium">
              Al suscribirte, aceptas nuestra política de privacidad.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-24">
          <div className="col-span-2 space-y-8">
            <Link to="/" className="text-4xl font-black tracking-tighter italic group">
              LEGA<span className="text-primary group-hover:tracking-[0.2em] transition-all">DO</span>
            </Link>
            <p className="text-zinc-400 max-w-xs leading-relaxed">
              Redefiniendo el lujo contemporáneo a través de piezas atemporales y una visión audaz del futuro.
            </p>
            <div className="flex gap-6">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Tienda</h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Soporte</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Compañía</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-zinc-500">
              <Truck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Envío Global</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Pago Seguro</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">30 Días Devolución</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-6 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-zinc-600" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              © 2024 LEGADO STUDIO. TODOS LOS DERECHOS RESERVADOS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

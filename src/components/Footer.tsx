import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, Youtube, Heart, Phone, Mail, MapPin, Send, MessageCircle, Music } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';

const defaultFooterSettings = {
  logoText: 'JEANCOL',
  tagline: 'Elegancia atemporal para el hombre moderno.',
  showSocial: true,
  showLinks: true,
  showCopyright: true,
  showContact: true,
  showNewsletter: false,
  copyrightText: 'TODOS LOS DERECHOS RESERVADOS.',
  backgroundStyle: 'dark',
  socialLinks: {
    instagram: '#',
    twitter: '#',
    facebook: '#',
    youtube: '#',
    whatsapp: '',
    tiktok: '',
  },
  contactInfo: {
    email: 'contacto@jeancob.store',
    phone: '+57 300 123 4567',
    address: 'Bogotá, Colombia',
  },
  quickLinks: [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/products' },
    { name: 'Categorías', href: '/categories' },
    { name: 'Ofertas', href: '/offers' },
    { name: 'Contacto', href: '#' },
  ],
  columns: {
    brand: true,
    navigation: true,
    contact: true,
    newsletter: false,
  },
};

export const Footer = () => {
  const { getStoreName } = useStore();
  const storeName = getStoreName();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [heartClicks, setHeartClicks] = useState(0);
  const [showSecretHint, setShowSecretHint] = useState(false);

  const getFooterSettings = () => {
    const saved = localStorage.getItem('footerSettings');
    return saved ? { ...defaultFooterSettings, ...JSON.parse(saved) } : defaultFooterSettings;
  };

  const settings = getFooterSettings();
  
  const bgStyles: Record<string, string> = {
    dark: isDark ? 'bg-zinc-950' : 'bg-zinc-100',
    neutral: isDark ? 'bg-zinc-900' : 'bg-zinc-50',
    gradient: isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black' : 'bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100',
  };
  
const textStyles: Record<string, { main: string; muted: string; border: string; hover: string }> = {
    dark: { main: 'text-white', muted: 'text-zinc-400', border: 'border-white/5', hover: 'hover:text-white' },
    neutral: { main: 'text-white', muted: 'text-zinc-300', border: 'border-white/10', hover: 'hover:text-white' },
    gradient: { main: 'text-white', muted: 'text-zinc-300', border: 'border-white/10', hover: 'hover:text-white' },
  };

  const bgStyle = bgStyles[settings.backgroundStyle] || bgStyles.dark;
  const currentTextStyle = isDark 
    ? (textStyles[settings.backgroundStyle] || textStyles.dark)
    : { main: 'text-zinc-900', muted: 'text-zinc-600', border: 'border-zinc-200', hover: 'hover:text-primary' };
  const txtStyle = { ...currentTextStyle, ...(isDark ? {} : { hover: 'hover:text-primary' }) };

  const socialIcons = [
    { Icon: Instagram, key: 'instagram', label: 'Instagram', show: settings.socialLinks.instagram && settings.socialLinks.instagram !== '#' },
    { Icon: Twitter, key: 'twitter', label: 'Twitter/X', show: settings.socialLinks.twitter && settings.socialLinks.twitter !== '#' },
    { Icon: Facebook, key: 'facebook', label: 'Facebook', show: settings.socialLinks.facebook && settings.socialLinks.facebook !== '#' },
    { Icon: Youtube, key: 'youtube', label: 'YouTube', show: settings.socialLinks.youtube && settings.socialLinks.youtube !== '#' },
    { Icon: MessageCircle, key: 'whatsapp', label: 'WhatsApp', show: settings.socialLinks.whatsapp && settings.socialLinks.whatsapp !== '' },
    { Icon: Music, key: 'tiktok', label: 'TikTok', show: settings.socialLinks.tiktok && settings.socialLinks.tiktok !== '' },
  ].filter(s => s.show);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      x: 5,
      color: '#ef4444',
      transition: { duration: 0.2 },
    },
  };

  return (
    <footer className={`${bgStyle} ${txtStyle.main} relative overflow-hidden`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: [0, 0.3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"
        />
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: '-100%', opacity: [0, 0.2, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 4 }}
          className="absolute bottom-1/4 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"
        />
      </div>

      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="py-16 lg:py-20 pt-24 lg:pt-28"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand Column */}
            {settings.columns.brand && (
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <motion.div variants={logoVariants} className="mb-6">
                  <Link to="/" className="inline-block group">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic">
                      {storeName.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i === storeName.split(' ').length - 1 ? 'text-primary group-hover:tracking-[0.3em] transition-all duration-500' : ''}>
                          {word}{i < storeName.split(' ').length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </h2>
                  </Link>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`${txtStyle.muted} text-base leading-relaxed max-w-md mb-8`}
                >
                  {settings.tagline}
                </motion.p>

                {settings.showSocial && socialIcons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    {socialIcons.map(({ Icon, key, label }, index) => (
                      <motion.a
                        key={key}
                        href={settings.socialLinks[key as keyof typeof settings.socialLinks]}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.15, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-11 h-11 rounded-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-200/50 border-zinc-300'} flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group`}
                        title={label}
                      >
                        <Icon className={`w-5 h-5 ${txtStyle.muted} ${txtStyle.hover} transition-colors`} />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Quick Links */}
            {settings.columns.navigation && settings.showLinks && (
              <motion.div variants={itemVariants}>
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mb-6`}>
                  Navegación
                </h3>
                <ul className="space-y-4">
                  {settings.quickLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <Link
                        to={link.href}
                        className={`text-sm ${txtStyle.muted} {txtStyle.hover} transition-colors inline-flex items-center gap-2 group`}
                      >
                        <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Contact Column */}
            {settings.columns.contact && settings.showContact && (
              <motion.div variants={itemVariants}>
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mb-6`}>
                  Contacto
                </h3>
                <div className="space-y-4 text-sm">
                  {settings.contactInfo.phone && (
                    <motion.a
                      href={`tel:${settings.contactInfo.phone}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className={`flex items-center gap-3 ${txtStyle.muted} {txtStyle.hover} transition-colors`}
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      {settings.contactInfo.phone}
                    </motion.a>
                  )}
                  {settings.contactInfo.email && (
                    <motion.a
                      href={`mailto:${settings.contactInfo.email}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                      className={`flex items-center gap-3 ${txtStyle.muted} {txtStyle.hover} transition-colors`}
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      {settings.contactInfo.email}
                    </motion.a>
                  )}
                  {settings.contactInfo.address && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className={`flex items-center gap-3 ${txtStyle.muted}`}
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      {settings.contactInfo.address}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Newsletter Column */}
            {settings.columns.newsletter && settings.showNewsletter && (
              <motion.div variants={itemVariants}>
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} mb-6`}>
                  Newsletter
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className={`text-sm ${txtStyle.muted} mb-4`}
                >
                  Suscríbete para recibir ofertas exclusivas y novedades.
                </motion.p>
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className={`flex-1 px-4 py-3 rounded-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-200 border-zinc-300'} ${isDark ? 'text-white' : 'text-zinc-900'} text-sm ${isDark ? 'placeholder:text-zinc-500' : 'placeholder:text-zinc-400'} focus:outline-none focus:border-primary transition-colors`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        {settings.showCopyright && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={`py-8 border-t ${txtStyle.border}`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-bold uppercase tracking-[0.2em]`}
              >
                © {new Date().getFullYear()} {storeName.toUpperCase()}. {settings.copyrightText}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
              >
                Hecho con{' '}
                <button
                  onClick={() => {
                    const newClicks = heartClicks + 1;
                    setHeartClicks(newClicks);
                    if (newClicks >= 5) {
                      navigate('/admin/login');
                      setHeartClicks(0);
                    } else {
                      setShowSecretHint(true);
                      setTimeout(() => setShowSecretHint(false), 1500);
                    }
                  }}
                  className="relative cursor-pointer hover:scale-110 transition-transform"
                >
                  <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                  {showSecretHint && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold">
                      {5 - heartClicks}...
                    </span>
                  )}
                </button>{' '}
                en Colombia
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </footer>
  );
};

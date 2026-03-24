import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Lock, 
  ArrowRight, 
  Settings, 
  Sun,
  Moon,
  Instagram, 
  Facebook, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Sparkles,
  Star,
  Clock
} from 'lucide-react';

export const MaintenanceScreen = () => {
  const { getLogo, getStoreName, settings, getMaintenanceTimeLeft } = useStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(getMaintenanceTimeLeft());

  useEffect(() => {
    const updateTime = () => {
      const time = getMaintenanceTimeLeft();
      setTimeLeft(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [getMaintenanceTimeLeft]);

  const isDark = theme === 'dark';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const floatAnimation = {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  };

  const rotateSlow = {
    rotate: [0, 360],
    transition: { duration: 25, repeat: Infinity, ease: 'linear' },
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: isDark ? [0.3, 0.5, 0.3] : [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-1/3 -right-1/4 w-[90vw] h-[90vw] rounded-full blur-3xl ${
            isDark 
              ? 'bg-gradient-to-br from-primary/50 via-primary/30 to-transparent' 
              : 'bg-gradient-to-br from-primary/40 via-primary/20 to-transparent'
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: isDark ? [0.25, 0.45, 0.25] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className={`absolute -bottom-1/3 -left-1/4 w-[80vw] h-[80vw] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-tr from-orange-500/40 via-orange-400/20 to-transparent'
              : 'bg-gradient-to-tr from-orange-400/30 via-orange-300/15 to-transparent'
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: isDark ? [0.15, 0.3, 0.15] : [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30'
              : 'bg-gradient-to-r from-purple-400/20 to-pink-400/20'
          }`}
        />
        
        <div className="absolute inset-0" style={{
          backgroundImage: isDark 
            ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`
            : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-4 sm:p-6 md:p-8 ${isDark ? 'bg-zinc-950/50' : 'bg-white/50'}`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden shadow-lg ${
                  isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-zinc-100'
                }`}
              >
                <img src={getLogo()} alt={getStoreName()} className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h1 className={`font-black text-lg sm:text-xl md:text-2xl tracking-tight ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {getStoreName()}
                </h1>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {settings.tagline}
                </p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-primary text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:bg-primary/90 transition-all"
            >
              <span className="hidden xs:inline">Panel Admin</span>
              <span className="xs:hidden">Admin</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        >
          <div className="max-w-2xl w-full text-center">
            <motion.div variants={itemVariants} className="mb-8 sm:mb-10 md:mb-12">
              <div className="relative inline-block">
                <motion.div
                  animate={floatAnimation}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: isDark 
                        ? [
                            '0 25px 50px -12px rgba(66, 0, 220, 0.4)',
                            '0 25px 50px -12px rgba(66, 0, 220, 0.6)',
                            '0 25px 50px -12px rgba(66, 0, 220, 0.4)',
                          ]
                        : [
                            '0 25px 50px -12px rgba(66, 0, 220, 0.15)',
                            '0 25px 50px -12px rgba(66, 0, 220, 0.25)',
                            '0 25px 50px -12px rgba(66, 0, 220, 0.15)',
                          ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 ${
                      isDark ? 'border-zinc-800 bg-zinc-900' : 'border-white bg-white'
                    } mx-auto`}
                  >
                    <img src={getLogo()} alt={getStoreName()} className="w-full h-full object-cover" />
                  </motion.div>
                  
                  <motion.div
                    animate={rotateSlow}
                    className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  >
                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-xl flex items-center justify-center">
                      <Settings className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [0.9, 1, 0.9],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute -bottom-2 -left-3 sm:-bottom-2 sm:-left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center"
                  >
                    <Sparkles className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
                  </motion.div>

                  <motion.div
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      scale: [0.85, 1, 0.85],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 ${
                  isDark 
                    ? 'bg-primary/20 text-primary-light' 
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Modo Mantenimiento
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                Estamos
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  mejorándolo
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-base sm:text-lg md:text-xl max-w-md mx-auto leading-relaxed mb-8 sm:mb-10 ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {settings.maintenanceMessage || 'Estamos trabajando intensamente para mejorar tu experiencia. Vuélve pronto para descubrir las novedades.'}
              </motion.p>
            </motion.div>

            {timeLeft && (
              <motion.div
                variants={itemVariants}
                className="mb-8 sm:mb-10 md:mb-12"
              >
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  Tiempo estimado de regreso
                </p>
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                  {[
                    { value: timeLeft.days, label: 'Días' },
                    { value: timeLeft.hours, label: 'Horas' },
                    { value: timeLeft.minutes, label: 'Min' },
                    { value: timeLeft.seconds, label: 'Seg' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="relative"
                    >
                      <div className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-lg min-w-[55px] sm:min-w-[65px] md:min-w-[80px] ${
                        isDark 
                          ? 'bg-zinc-900 border border-zinc-800' 
                          : 'bg-white border border-zinc-100'
                      }`}>
                        <motion.span
                          key={item.value}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className={`block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black ${
                            isDark ? 'text-white' : 'text-zinc-900'
                          }`}
                        >
                          {String(item.value).padStart(2, '0')}
                        </motion.span>
                        <span className={`text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>{item.label}</span>
                      </div>
                      {i < 3 && (
                        <span className={`absolute -right-1.5 sm:-right-2 top-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl font-black ${
                          isDark ? 'text-zinc-700' : 'text-zinc-300'
                        }`}>:</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl mb-6 sm:mb-8 ${
                isDark 
                  ? 'bg-zinc-900/80 border border-zinc-800' 
                  : 'bg-white/90 border border-zinc-100'
              }`}
            >
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[Heart, Star, Heart].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: isDark ? [0.4, 0.7, 0.4] : [0.5, 0.8, 0.5],
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isDark ? 'text-zinc-500' : 'text-zinc-400'
                    }`} />
                  </motion.div>
                ))}
              </div>
              
              <h3 className={`font-black text-base sm:text-lg md:text-xl mb-4 sm:mb-6 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                Síguenos mientras trabajamos
              </h3>
              
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {settings.socialMedia.instagram && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://instagram.com/${settings.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white shadow-lg"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                )}
                {settings.socialMedia.facebook && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://facebook.com/${settings.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                )}
                {settings.socialMedia.whatsapp && (
                  <motion.a
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://wa.me/${settings.socialMedia.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg"
                  >
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {settings.email && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    href={`mailto:${settings.email}`} 
                    className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{settings.email}</span>
                  </motion.a>
                )}
                {settings.phone && (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    href={`tel:${settings.phone}`} 
                    className="flex items-center gap-1.5 sm:gap-2 hover:text-primary transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{settings.phone}</span>
                  </motion.a>
                )}
              </div>
              {settings.address && (
                <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{settings.address}</span>
                </p>
              )}
            </motion.div>
          </div>
        </motion.main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`p-4 sm:p-6 text-center ${isDark ? 'bg-zinc-950/50' : 'bg-white/50'}`}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
            <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Construyendo el futuro
            </span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
          </motion.div>
          <p className={`text-[10px] sm:text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            © {new Date().getFullYear()} {getStoreName()} • Todos los derechos reservados
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default MaintenanceScreen;

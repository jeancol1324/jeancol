import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloat = () => {
  const { settings, getStoreName } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const storeName = getStoreName();
  const whatsapp = settings.socialMedia?.whatsapp || '';
  const whatsappNumber = whatsapp || '573001234567';
  const customMessage = `Hola ${storeName}! 👋 Estoy interesado/a en conocer más productos de tu tienda. ¿Podrías ayudarme?`;
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(customMessage)}`;

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">¡Escríbenos!</span>
                  <p className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    En línea ahora
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 mb-3">
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                ¡Hola! 👋 Bienvenido a <strong className="text-green-500">{storeName}</strong>. 
                ¿En qué podemos ayudarte hoy? Estamos aquí para resolver tus dudas.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-3">
              <Clock className="w-3 h-3" />
              <span>Respondemos en minutos</span>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30"
            >
              <Send className="w-4 h-4" />
              Chatear ahora
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={hasScrolled ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: hasScrolled ? Infinity : 0, duration: 2 }}
        className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 transition-all"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </span>
      </motion.button>
    </div>
  );
};

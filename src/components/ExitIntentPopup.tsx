import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExitIntentPopupProps {
  discount?: number;
  title?: string;
  description?: string;
  delay?: number;
  cookieDays?: number;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  discount = 15,
  title = '¡Espera! No te vayas con las manos vacías',
  description = 'Suscríbete y obtén un 15% de descuento en tu primera compra.',
  delay = 5000,
  cookieDays = 7
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  const cookieName = 'exit-intent-shown';

  useEffect(() => {
    const checkCookie = localStorage.getItem(cookieName);
    if (checkCookie) {
      setHasSeenPopup(true);
    }
  }, []);

  const showPopup = useCallback(() => {
    if (hasSeenPopup || isVisible) return;
    setIsVisible(true);
    localStorage.setItem(cookieName, 'true');
  }, [hasSeenPopup, isVisible]);

  useEffect(() => {
    const timer = setTimeout(showPopup, delay);
    return () => clearTimeout(timer);
  }, [delay, showPopup]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenPopup) {
        showPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showPopup, hasSeenPopup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      localStorage.setItem(`exit-intent-email-${Date.now()}`, email);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    setHasSeenPopup(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closePopup}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-2xl"
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                    <Percent className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-center text-zinc-900 dark:text-white mb-2">
                  {title}
                </h2>

                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                  {description.replace('{discount}', discount.toString())}
                </p>

                <div className="bg-primary/10 rounded-2xl p-4 mb-6 text-center">
                  <span className="text-4xl font-black text-primary">{discount}%</span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-primary/70 mt-1">
                    Descuento en tu primera compra
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    Obtener Mi Descuento
                  </button>
                </form>

                <p className="text-center text-[10px] text-zinc-400 mt-4">
                  Sin spam. Puedes darte de baja en cualquier momento.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <Percent className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                  ¡Código Activado!
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Tu código <span className="font-black text-primary">BIENVENIDO{discount}</span> está listo.
                  Se ha enviado a tu email.
                </p>
                <button
                  onClick={closePopup}
                  className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-sm uppercase tracking-wider"
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NewsletterPopupProps {
  delay?: number;
  title?: string;
  description?: string;
}

export const NewsletterPopup: React.FC<NewsletterPopupProps> = ({
  delay = 10000,
  title = 'Únete al Club Exclusivo',
  description = 'Sé el primero en conocer nuevas colecciones, ofertas exclusivas y contenido único.'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  useEffect(() => {
    const checkCookie = localStorage.getItem('newsletter-popup-shown');
    if (checkCookie) setHasSeenPopup(true);
  }, []);

  useEffect(() => {
    if (hasSeenPopup || isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem('newsletter-popup-shown', 'true');
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, hasSeenPopup, isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsVisible(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>

            {!isSubmitted ? (
              <>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {description}
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm"
                  >
                    Unirse
                  </button>
                </form>
              </>
            ) : (
              <p className="text-center text-emerald-600 font-bold">
                ¡Gracias por suscribirte!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

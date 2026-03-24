import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { ScrollToTop } from './ScrollToTop';
import { ScrollProgress } from './ScrollProgress';
import { SideCart } from './SideCart';
import { FloatingNotifications } from './FloatingNotifications';
import { WhatsAppFloat } from './WhatsAppFloat';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 bg-primary/20 border-2 border-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%'
      }}
      animate={{ scale: isHovering ? 2.5 : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <motion.div
        className="absolute inset-0 m-auto w-1.5 h-1.5 bg-primary rounded-full"
        animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isProductPath = location.pathname.startsWith('/product');
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  useEffect(() => {
    const handleCartEvent = () => {
      setIsSideCartOpen(true);
    };

    window.addEventListener('openSideCart', handleCartEvent);
    return () => window.removeEventListener('openSideCart', handleCartEvent);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <CustomCursor />
      
      <ScrollProgress height={3} />
      
      {!isAdminPath && !isProductPath && <Header />}
      
      <main className={!isAdminPath && !isProductPath ? "pt-16 lg:pt-20 flex-grow" : "flex-grow"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdminPath && !isProductPath && <Footer />}
      {!isAdminPath && !isProductPath && <BottomNav />}

      <SideCart isOpen={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      {!isAdminPath && <WhatsAppFloat />}
      <FloatingNotifications />
      <ScrollToTop />
    </div>
  );
};

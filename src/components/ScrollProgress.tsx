import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  showSectionIndicator?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  color = '#FF6321',
  height = 3,
  showPercentage = false,
  showSectionIndicator = false
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <>
      <motion.div
        className={cn('fixed top-0 left-0 right-0 z-[9999] origin-left', className)}
        style={{
          scaleX,
          height,
          background: `linear-gradient(90deg, ${color}, #FF9F1C)`
        }}
      />
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-[9999] bg-zinc-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-zinc-900 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
};

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ className }) => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest > 100 && latest < document.documentElement.scrollHeight - window.innerHeight - 200);
    });
  }, [scrollY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className={cn('fixed bottom-28 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none', className)}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Scroll</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-700 flex justify-center"
          animate={{ borderColor: ['rgb(212,212,212)', 'rgb(255,99,33)', 'rgb(212,212,212)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary mt-2"
            animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  speed = 0.5,
  className
}) => {
  const { scrollY } = useScroll();
  const ref = React.useRef<HTMLDivElement>(null);
  const [yValue, setYValue] = useState(0);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setYValue(-rect.top * speed);
      }
    });
  }, [scrollY, speed]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y: yValue }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
};

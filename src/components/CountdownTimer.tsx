import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
  expiredText?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const calculateTimeLeft = (endDate: string): TimeLeft => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const difference = end - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  };
};

const formatTimeUnit = (value: number): string => {
  return value.toString().padStart(2, '0');
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  className = '',
  expiredText = 'Oferta terminada',
  size = 'md'
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.isExpired) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-red-500 text-xs font-bold uppercase tracking-wider">
          {expiredText}
        </span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-[8px] gap-1',
    md: 'text-[10px] gap-2',
    lg: 'text-xs gap-3'
  };

  const boxSizeClasses = {
    sm: 'w-6 h-5 text-[8px]',
    md: 'w-8 h-6 text-[10px]',
    lg: 'w-10 h-8 text-xs'
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
      {timeLeft.days > 0 && (
        <>
          <div className={`${boxSizeClasses[size]} bg-zinc-900 rounded flex items-center justify-center font-black text-white`}>
            {formatTimeUnit(timeLeft.days)}
          </div>
          <span className="text-zinc-400 font-bold">d</span>
        </>
      )}
      <div className={`${boxSizeClasses[size]} bg-primary rounded flex items-center justify-center font-black text-white`}>
        {formatTimeUnit(timeLeft.hours)}
      </div>
      <span className="text-zinc-400 font-bold">:</span>
      <div className={`${boxSizeClasses[size]} bg-primary rounded flex items-center justify-center font-black text-white`}>
        {formatTimeUnit(timeLeft.minutes)}
      </div>
      <span className="text-zinc-400 font-bold">:</span>
      <div className={`${boxSizeClasses[size]} bg-primary rounded flex items-center justify-center font-black text-white`}>
        {formatTimeUnit(timeLeft.seconds)}
      </div>
    </div>
  );
};

interface CountdownBadgeProps {
  endDate: string;
  className?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({ endDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.isExpired) {
    return null;
  }

  const getTimeString = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`;
    }
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  };

  return (
    <div className={`inline-flex items-center gap-1.5 bg-primary text-white px-2 py-1 rounded-full ${className}`}>
      <Clock className="w-3 h-3" />
      <span className="text-[10px] font-black uppercase tracking-wider">
        {getTimeString()}
      </span>
    </div>
  );
};

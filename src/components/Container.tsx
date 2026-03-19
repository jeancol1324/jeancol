import React from 'react';

export const Container = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 lg:px-8 w-full ${className}`}>
    {children}
  </div>
);

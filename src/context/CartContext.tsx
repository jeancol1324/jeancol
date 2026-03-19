import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'shipping' | 'fixed';
  minPurchase: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discount: 10, type: 'percent', minPurchase: 50 },
  { code: 'SAVE20', discount: 20, type: 'percent', minPurchase: 100 },
  { code: 'FREESHIP', discount: 0, type: 'shipping', minPurchase: 75 },
  { code: 'JEANCOL15', discount: 15, type: 'percent', minPurchase: 80 },
];

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  addItem: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  FREE_SHIPPING_THRESHOLD: number;
  progressToFreeShipping: number;
  remainingForFreeShipping: number;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  discount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jeancol_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem('jeancol_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
  };

  const addItem = addToCart;

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId && item.selectedSize === size ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 99;
  const progressToFreeShipping = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (totalPrice * appliedCoupon.discount) / 100
      : appliedCoupon.type === 'fixed'
        ? appliedCoupon.discount
        : 0
    : 0;
  const finalTotal = totalPrice - discount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        FREE_SHIPPING_THRESHOLD,
        progressToFreeShipping,
        remainingForFreeShipping,
        appliedCoupon,
        setAppliedCoupon,
        discount,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

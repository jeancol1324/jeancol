import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { supabase } from '../lib/supabase';

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'shipping' | 'fixed';
  minPurchase: number;
  active: boolean;
  description?: string;
  expiresAt?: string;
}

export const DEFAULT_COUPONS: Coupon[] = [
  { id: '1', code: 'WELCOME10', discount: 10, type: 'percent', minPurchase: 50000, active: true, description: '10% de descuento en tu primera compra' },
  { id: '2', code: 'JEANCOL15', discount: 15, type: 'percent', minPurchase: 100000, active: true, description: '15% de descuento en compras mayores a $100.000' },
  { id: '3', code: 'FREESHIP', discount: 0, type: 'shipping', minPurchase: 80000, active: true, description: 'Envío gratis en compras mayores a $80.000' },
  { id: '4', code: 'SAVE20', discount: 20, type: 'percent', minPurchase: 200000, active: true, description: '20% de descuento en compras mayores a $200.000' },
];

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  items: CartItem[];
  addToCart: (product: Product, size?: string, qty?: number, variations?: Record<string, string>) => void;
  addItem: (product: Product, size?: string, qty?: number, variations?: Record<string, string>) => void;
  removeFromCart: (productId: string, size?: string, variations?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, variations?: Record<string, string>) => void;
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
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jeancol_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('is_active', true)
          .gte('valid_until', new Date().toISOString());

        if (error) throw error;
        if (data && data.length > 0) {
          const mappedCoupons = data.map(c => ({
            id: c.id,
            code: c.code,
            discount: c.value,
            type: c.type === 'percentage' ? 'percent' as const : 'fixed' as const,
            minPurchase: c.min_purchase || 0,
            active: c.is_active,
            description: c.description,
            expiresAt: c.valid_until,
          }));
          setCoupons(mappedCoupons);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jeancol_cart', JSON.stringify(cart));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing cart');
        setCart([]);
      }
    }
  }, [cart]);

  const addToCart = (product: Product, size?: string, qty: number = 1, variations?: Record<string, string>) => {
    const variationKey = variations ? JSON.stringify(variations) : undefined;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size && JSON.stringify(item.selectedVariations) === variationKey);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedSize === size && JSON.stringify(item.selectedVariations) === variationKey) ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty, selectedSize: size, selectedVariations: variations }];
    });
  };

  const addItem = addToCart;

  const removeFromCart = (productId: string, size?: string, variations?: Record<string, string>) => {
    const variationKey = variations ? JSON.stringify(variations) : undefined;
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size && JSON.stringify(item.selectedVariations) === variationKey)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, variations?: Record<string, string>) => {
    const variationKey = variations ? JSON.stringify(variations) : undefined;
    if (quantity <= 0) {
      removeFromCart(productId, size, variations);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId && item.selectedSize === size && JSON.stringify(item.selectedVariations) === variationKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 95000;
  const SHIPPING_COST = 14500;
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
        loading,
        items: cart,
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
        finalTotal,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
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

export const useCoupons = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCart();
  return { coupons, addCoupon, updateCoupon, deleteCoupon };
};

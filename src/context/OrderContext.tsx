import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { ORDERS as INITIAL_ORDERS } from '../constants';
import { supabase } from '../lib/supabase';

export type { Order, OrderStatus };

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id'>) => Promise<string>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  filterByStatus: (status: OrderStatus | 'all') => Order[];
  searchOrders: (query: string) => Order[];
  getStats: () => {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    pendingRevenue: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const addOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setOrders(prev => [data, ...prev]);
        return data.id;
      }
      return '';
    } catch (error) {
      console.error('Error adding order:', error);
      const localOrder: Order = { ...order, id: Date.now().toString() };
      setOrders(prev => [localOrder, ...prev]);
      return localOrder.id;
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    } catch (error) {
      console.error('Error updating order:', error);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await updateOrder(id, { status });
  };

  const filterByStatus = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter(o => o.status === status);
  };

  const searchOrders = (query: string) => {
    const lower = query.toLowerCase();
    return orders.filter(o => 
      o.id.toLowerCase().includes(lower) ||
      o.customer.toLowerCase().includes(lower) ||
      o.email.toLowerCase().includes(lower) ||
      o.phone.includes(query) ||
      o.city.toLowerCase().includes(lower)
    );
  };

  const getStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + (o.total || 0), 0),
    pendingRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (o.total || 0), 0),
  });

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      addOrder,
      updateOrder,
      deleteOrder,
      getOrderById,
      updateOrderStatus,
      filterByStatus,
      searchOrders,
      getStats,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

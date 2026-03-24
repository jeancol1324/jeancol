import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  filterByCategory: (category: string) => Product[];
  filterByStock: (status: 'all' | 'in_stock' | 'low' | 'out') => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (!data || data.length === 0) {
          setProducts([]);
        } else {
          setProducts(data.map(p => ({
            ...p,
            images: p.images || [],
            sizes: p.sizes || [],
            colors: p.colors || {},
            variations: p.variations || [],
          })));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setProducts(prev => [data, ...prev]);
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  const searchProducts = (query: string) => {
    const lower = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower)
    );
  };

  const filterByCategory = (category: string) => {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  };

  const filterByStock = (status: 'all' | 'in_stock' | 'low' | 'out') => {
    switch (status) {
      case 'in_stock':
        return products.filter(p => (p.stock || 0) > 10);
      case 'low':
        return products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
      case 'out':
        return products.filter(p => (p.stock || 0) === 0);
      default:
        return products;
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProductById, searchProducts, filterByCategory, filterByStock }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

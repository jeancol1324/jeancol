import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { supabase, supabaseAdmin } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  image: string;
  count?: number;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from Supabase...');
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*')
          .order('name');

        console.log('Categories response:', { data, error });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const categoriesWithCount = data.map(cat => ({
            ...cat,
            count: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
          }));
          setCategories(categoriesWithCount);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        count: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
      })));
    }
  }, [products]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert([category])
        .select()
        .single();

      console.log('Add category result:', { data, error });
      
      if (error) {
        alert('Error al guardar categoría: ' + error.message);
        throw error;
      }
      if (data) {
        setCategories(prev => [...prev, { ...data, count: 0 }]);
      }
    } catch (error: any) {
      console.error('Error adding category:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .update(updates)
        .eq('id', id);

      console.log('Update category result:', { error });
      
      if (error) {
        alert('Error al actualizar categoría: ' + error.message);
        throw error;
      }
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id);

      console.log('Delete category result:', { error });
      
      if (error) {
        alert('Error al eliminar categoría: ' + error.message);
        throw error;
      }
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert('Error: ' + (error?.message || 'Error desconocido'));
    }
  };

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  const getCategoryByName = (name: string) => 
    categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());

  return (
    <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, getCategoryById, getCategoryByName }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const useCategoryCount = (categoryName: string) => {
  const { products } = useProducts();
  return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).length;
};

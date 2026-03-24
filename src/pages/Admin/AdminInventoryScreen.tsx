import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Pencil, Trash2, Eye, Video, Save, ArrowLeft, Camera, Upload, Sparkles, Loader2, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { Product, ProductVariation } from '../../types';
import { formatPriceCOP } from '../../lib/utils';
import { generateAIDescription, generateAIFeatures, generateVariations } from '../../utils/productGenerator';
import { compressImage, MAX_VIDEO_SIZE } from '../../utils/imageUtils';

type StockFilter = 'all' | 'in_stock' | 'low' | 'out';

export const AdminInventoryScreen = () => {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<'description' | 'features' | null>(null);
  
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleGenerateWithAI = async (field: 'description' | 'features') => {
    if (!editForm.name) {
      showToast('Primero ingresa el nombre del producto', 'error');
      return;
    }

    setIsGenerating(true);
    setGeneratingField(field);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (field === 'description') {
      const description = generateAIDescription(editForm.name);
      setEditForm(prev => ({ ...prev, description }));
      showToast('Descripción generada', 'success');
    } else {
      const features = generateAIFeatures(editForm.name, editForm.features);
      setEditForm(prev => ({ ...prev, features }));
      showToast('Características generadas', 'success');
    }

    setIsGenerating(false);
    setGeneratingField(null);
  };

  const handleUpdateVariation = (id: string, field: keyof ProductVariation, value: any) => {
    setEditForm(prev => ({
      ...prev,
      variations: prev.variations.map((v: ProductVariation) => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleRemoveVariation = (id: string) => {
    setEditForm(prev => ({
      ...prev,
      variations: prev.variations.filter((v: ProductVariation) => v.id !== id)
    }));
  };

  const [newVariationName, setNewVariationName] = useState('');
  const [newVariationValue, setNewVariationValue] = useState('');

  const handleAddVariation = () => {
    if (newVariationName.trim() && newVariationValue.trim()) {
      const newVariation: ProductVariation = {
        id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newVariationName.trim(),
        value: newVariationValue.trim(),
        stock: 10,
        isActive: true
      };
      setEditForm(prev => ({
        ...prev,
        variations: [...(prev.variations || []), newVariation]
      }));
      setNewVariationName('');
      setNewVariationValue('');
      showToast('Variación añadida', 'success');
    }
  };
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Comprimiendo imagen...', 'info');
        const base64 = await compressImage(file);
        setEditForm(prev => ({ ...prev, image: base64 }));
        showToast('Imagen subida correctamente', 'success');
      } catch (error) {
        showToast('Error al subir imagen', 'error');
      }
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        showToast('Comprimiendo imágenes...', 'info');
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const base64 = await compressImage(files[i]);
          newImages.push(base64);
        }
        if (newImages.length > 0) {
          setEditForm(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
          showToast(`${newImages.length} imagen(es) subida(s)`, 'success');
        }
      } catch (error) {
        showToast('Error al subir imágenes', 'error');
      }
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_: string, i: number) => i !== index)
    }));
  };
  
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_VIDEO_SIZE) {
        showToast('El video es muy grande (máx 2MB)', 'error');
        if (videoRef.current) videoRef.current.value = '';
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = () => {
          setEditForm(prev => ({ ...prev, video: reader.result as string }));
          if (videoRef.current) videoRef.current.value = '';
          showToast('Video subido correctamente', 'success');
        };
        reader.onerror = () => showToast('Error al subir video', 'error');
        reader.readAsDataURL(file);
      } catch (error) {
        showToast('Error al subir video', 'error');
      }
    }
  };

  const formatCOP = (amount: number) => amount.toLocaleString('es-CO');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      );
    }

    switch (stockFilter) {
      case 'in_stock':
        result = result.filter(p => (p.stock || 0) > 10);
        break;
      case 'low':
        result = result.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
        break;
      case 'out':
        result = result.filter(p => (p.stock || 0) === 0);
        break;
    }

    return result;
  }, [products, searchQuery, stockFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    low: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length,
    out: products.filter(p => (p.stock || 0) === 0).length,
    inStock: products.filter(p => (p.stock || 0) > 10).length,
  }), [products]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      ...product,
      colors: product.colors || [],
      features: product.features || [],
      images: product.images || [],
      video: product.video || '',
    });
  };

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newSizeName, setNewSizeName] = useState('');

  const handleAddFeature = () => {
    if (newFeatureName.trim() && newFeatureValue.trim()) {
      setEditForm(prev => ({
        ...prev,
        features: [...(prev.features || []), { name: newFeatureName.trim(), value: newFeatureValue.trim() }]
      }));
      setNewFeatureName('');
      setNewFeatureValue('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      features: (prev.features || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setEditForm(prev => ({
        ...prev,
        colors: [...(prev.colors || []), { name: newColorName.trim(), hex: newColorHex }]
      }));
      setNewColorName('');
      setNewColorHex('#000000');
    }
  };

  const handleRemoveColor = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddSize = () => {
    if (newSizeName.trim()) {
      setEditForm(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSizeName.trim()]
      }));
      setNewSizeName('');
    }
  };

  const handleRemoveSize = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      sizes: (prev.sizes || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSaveEdit = () => {
    if (editingProduct && editForm) {
      try {
        const updatedProduct = {
          ...editingProduct,
          ...editForm,
          image: editForm.image || editForm.images?.[0] || editingProduct.image,
        };
        updateProduct(editingProduct.id, updatedProduct);
        setEditingProduct(null);
        showToast('Producto actualizado', 'success');
      } catch (error) {
        showToast('Error al guardar', 'error');
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const getStockStatus = (stock: number = 0) => {
    if (stock === 0) return { color: 'bg-red-500', label: 'Agotado', textColor: 'text-red-500' };
    if (stock <= 10) return { color: 'bg-amber-500', label: 'Bajo', textColor: 'text-amber-500' };
    return { color: 'bg-emerald-500', label: 'En stock', textColor: 'text-emerald-500' };
  };

  return (
    <div className={`pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-zinc-50/50'}`}>
      <AdminNavigation />
      <div className="flex-1">
        <header className={`sticky top-0 z-40 backdrop-blur-xl h-14 lg:h-20 flex items-center px-4 lg:px-8 ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-zinc-100'
        } border-b`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <h2 className="text-primary text-lg lg:text-2xl font-black tracking-tighter uppercase">
                INVENTARIO
              </h2>
            </div>
            <button 
              onClick={() => navigate('/admin/new-product')}
              className="bg-primary text-white px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-[10px] lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </header>

        <main className="py-3 lg:py-8 px-4 lg:px-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: 'Total', val: stats.total, color: isDark ? 'bg-zinc-800' : 'bg-zinc-900', textColor: isDark ? 'text-white' : 'text-white' },
                { label: 'En Stock', val: stats.inStock, color: 'bg-emerald-500', textColor: 'text-white' },
                { label: 'Bajo', val: stats.low, color: 'bg-amber-500', textColor: 'text-white' },
                { label: 'Agotado', val: stats.out, color: 'bg-red-500', textColor: 'text-white' },
              ].map((s, i) => (
                <div key={i} className={`${s.color} p-2 lg:p-4 rounded-xl text-center`}>
                  <p className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest ${s.textColor} opacity-70 mb-0.5`}>{s.label}</p>
                  <p className={`text-sm lg:text-2xl font-black ${s.textColor}`}>{s.val}</p>
                </div>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-6 mb-4 lg:mb-10">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, categoría o SKU..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl py-2 lg:py-3 pl-9 lg:pl-12 pr-4 text-[9px] lg:text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {[
                  { key: 'all', label: 'Todos' },
                  { key: 'in_stock', label: 'En Stock' },
                  { key: 'low', label: 'Bajo' },
                  { key: 'out', label: 'Agotados' },
                ].map((tab, i) => (
                  <button 
                    key={tab.key}
                    onClick={() => setStockFilter(tab.key as StockFilter)}
                    className={`px-3 py-1.5 lg:px-6 lg:py-2.5 rounded-full text-[8px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      stockFilter === tab.key 
                        ? isDark ? 'bg-primary text-white' : 'bg-zinc-900 text-white shadow-lg' 
                        : isDark ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white text-zinc-500 border border-zinc-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <h3 className={`text-[9px] lg:text-lg font-black uppercase tracking-widest mb-3 lg:mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
              {filteredProducts.map((prod, i) => {
                const stockStatus = getStockStatus(prod.stock);
                return (
                  <motion.div 
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col ${
                      isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-100'
                    }`}
                  >
                    <div className={`aspect-square rounded-lg lg:rounded-xl overflow-hidden relative mb-2 lg:mb-3 ${
                      isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-50 border border-zinc-100'
                    }`}>
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        src={prod.image} 
                        alt={prod.name} 
                        referrerPolicy="no-referrer" 
                      />
                      {prod.video && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-[8px] font-bold flex items-center gap-1">
                          <Video className="w-3 h-3" /> VIDEO
                        </div>
                      )}
                      <div className="absolute top-1 right-1 lg:top-2 lg:right-2 flex gap-1">
                        <button 
                          onClick={() => handleEdit(prod)}
                          className={`p-1 lg:p-1.5 backdrop-blur-md rounded-lg shadow-sm transition-colors ${
                            isDark ? 'bg-zinc-800/90 hover:text-primary' : 'bg-white/90 hover:text-primary'
                          }`}
                        >
                          <Pencil className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id)}
                          className={`p-1 lg:p-1.5 backdrop-blur-md rounded-lg shadow-sm transition-colors ${
                            isDark ? 'bg-zinc-800/90 hover:text-red-400' : 'bg-white/90 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className={`text-[6px] lg:text-[8px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{prod.category}</p>
                        <h3 className={`text-[8px] lg:text-sm font-black truncate mb-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{prod.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] lg:text-base font-black text-primary">${formatCOP(prod.price)}</p>
                          {prod.offerPrice && (
                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[6px] lg:text-[10px] font-black">OFERTA</span>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center justify-between mt-2 pt-2 ${isDark ? 'border-t border-zinc-800' : 'border-t border-zinc-50'}`}>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.color}`}></div>
                          <span className={`text-[6px] lg:text-[10px] font-black uppercase tracking-widest ${stockStatus.textColor}`}>
                            {prod.stock || 0}
                          </span>
                        </div>
                        <button 
                          onClick={() => navigate(`/product/${prod.id}`)}
                          className="text-[7px] lg:text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Ver
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className={`text-lg ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No se encontraron productos</p>
              </div>
            )}
        </main>
      </div>

      {/* Edit Modal */}
      <AnimatePresence mode="wait">
        {editingProduct && (
          <div key="edit-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative rounded-3xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
                  >
                    <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-zinc-400' : ''}`} />
                  </button>
                  <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Editar Producto
                  </h2>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
                >
                  <X className={`w-5 h-5 ${isDark ? 'text-zinc-400' : ''}`} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Nombre del Producto</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Categoría</label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-xs font-black uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Descripción</label>
                    <button
                      type="button"
                      onClick={() => handleGenerateWithAI('description')}
                      disabled={isGenerating}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                        isDark 
                          ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isGenerating && generatingField === 'description' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>IA</span>
                    </button>
                  </div>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Precio (COP)</label>
                      <input
                        type="text"
                        value={editForm.price ? formatPriceCOP(editForm.price) : ''}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                          const numValue = parseFloat(rawValue) || 0;
                          setEditForm(prev => ({ ...prev, price: numValue }));
                        }}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Precio Oferta (COP)</label>
                      <input
                        type="text"
                        value={editForm.offerPrice ? formatPriceCOP(editForm.offerPrice) : ''}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                          const numValue = parseFloat(rawValue) || 0;
                          setEditForm(prev => ({ ...prev, offerPrice: numValue }));
                        }}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                    </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Stock</label>
                    <input
                      type="number"
                      value={editForm.stock || 0}
                      onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>SKU</label>
                    <input
                      type="text"
                      value={editForm.sku || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Marca</label>
                    <input
                      type="text"
                      value={editForm.brand || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, brand: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Material</label>
                    <input
                      type="text"
                      value={editForm.material || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, material: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Peso</label>
                    <input
                      type="text"
                      value={editForm.weight || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Dimensiones</label>
                    <input
                      type="text"
                      value={editForm.dimensions || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, dimensions: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Imagen Principal</label>
                    <input
                      type="file"
                      ref={mainImageRef}
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => mainImageRef.current?.click()}
                      className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer ${
                        isDark ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    >
                      {editForm.image ? (
                        <div className="relative w-32 h-32">
                          <img src={editForm.image} alt="" className="w-full h-full object-cover rounded-lg" />
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditForm(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </span>
                        </div>
                      ) : (
                        <>
                          <Camera className={`w-8 h-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                          <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Subir imagen principal</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Galería de Imágenes ({editForm.images?.length || 0})</label>
                    <input
                      type="file"
                      ref={galleryImageRef}
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {(editForm.images || []).map((img: string, i: number) => (
                        <div key={i} className={`relative aspect-square rounded-lg overflow-hidden group ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <span
                            onClick={() => handleRemoveGalleryImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => galleryImageRef.current?.click()}
                        className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                          isDark ? 'border-zinc-700 text-zinc-500 hover:border-primary hover:text-primary' : 'border-zinc-200 text-zinc-300 hover:border-primary hover:text-primary'
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video */}
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Video del Producto</label>
                  <input
                    type="file"
                    ref={videoRef}
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {editForm.video ? (
                    <div className="space-y-3">
                      <div className={`aspect-video rounded-xl overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <video src={editForm.video} controls className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, video: '' }))}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                          isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        Eliminar Video
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoRef.current?.click()}
                      className={`w-full py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors ${
                        isDark ? 'border-zinc-700' : 'border-zinc-200'
                      }`}
                    >
                      <Upload className={`w-8 h-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Subir Video (máx 2MB)</span>
                    </button>
                  )}
                </div>

                {/* Colores */}
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Colores</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editForm.colors || []).map((color: { name: string; hex: string }, i: number) => (
                      <div 
                        key={i}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border group hover:border-primary transition-all ${
                          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border border-zinc-300" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{color.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(i)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isDark ? 'bg-zinc-700 text-zinc-400 hover:bg-red-900 hover:text-red-400' : 'bg-zinc-100 text-zinc-400 hover:bg-red-100 hover:text-red-500'
                          }`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Nombre del color"
                      className={`px-3 py-2 rounded-lg border text-xs font-medium focus:outline-none focus:border-primary w-32 ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-200"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tallas */}
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Tallas</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editForm.sizes || []).map((size: string, i: number) => (
                      <div 
                        key={i}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border group hover:border-primary transition-all ${
                          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{size}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(i)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isDark ? 'bg-zinc-700 text-zinc-400 hover:bg-red-900 hover:text-red-400' : 'bg-zinc-100 text-zinc-400 hover:bg-red-100 hover:text-red-500'
                          }`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      placeholder="Ej. 45, XL, M"
                      className={`px-3 py-2 rounded-lg border text-xs font-medium focus:outline-none focus:border-primary w-32 ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Tipo Guía de Tallas */}
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Tipo de Guía de Tallas</label>
                  <select
                    value={editForm.sizeGuideType || 'shoes'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sizeGuideType: e.target.value as 'shoes' | 'clothing' | 'accessories' }))}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none ${
                      isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="shoes">Zapatos</option>
                    <option value="clothing">Ropa</option>
                    <option value="accessories">Accesorios</option>
                  </select>
                </div>

                {/* Características del Producto */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-xs font-black uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Características del Producto</label>
                    <button
                      type="button"
                      onClick={() => handleGenerateWithAI('features')}
                      disabled={isGenerating}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                        isDark 
                          ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isGenerating && generatingField === 'features' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>IA</span>
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    {(editForm.features || []).map((feature: { name: string; value: string }, i: number) => (
                      <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                        <GripVertical className="w-4 h-4 text-zinc-500" />
                        <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{feature.name}:</span>
                        <span className={`flex-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{feature.value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className={`p-1 rounded-lg hover:bg-red-100 transition-colors ${isDark ? 'text-zinc-400 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureName}
                      onChange={(e) => setNewFeatureName(e.target.value)}
                      placeholder="Nombre (ej. Material)"
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={newFeatureValue}
                      onChange={(e) => setNewFeatureValue(e.target.value)}
                      placeholder="Valor (ej. Algodón 100%)"
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Variations Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className={`block text-xs font-black uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      Variaciones ({editForm.variations?.length || 0})
                    </label>
                  </div>
                  
                  {/* Add Variation Form */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <input
                      type="text"
                      value={newVariationName}
                      onChange={(e) => setNewVariationName(e.target.value)}
                      placeholder="Nombre (ej. Modelo, Peso)"
                      className={`flex-1 min-w-32 px-3 py-2 border rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={newVariationValue}
                      onChange={(e) => setNewVariationValue(e.target.value)}
                      placeholder="Valor (ej. XL, 500g)"
                      className={`flex-1 min-w-32 px-3 py-2 border rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${
                        isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddVariation}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {(editForm.variations?.length || 0) > 0 ? (
                    <div className="space-y-2">
                      {editForm.variations.map((variation: ProductVariation) => (
                        <div key={variation.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                          <button
                            type="button"
                            onClick={() => handleUpdateVariation(variation.id, 'isActive', !variation.isActive)}
                            className={`w-10 h-6 rounded-full transition-all relative ${
                              variation.isActive ? 'bg-primary' : 'bg-zinc-600'
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                              variation.isActive ? 'left-5' : 'left-1'
                            }`} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{variation.name}</span>
                              <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>:</span>
                              <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{variation.value}</span>
                              {!variation.isActive && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-200 text-zinc-400'}`}>
                                  Inactivo
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={variation.stock}
                              onChange={(e) => handleUpdateVariation(variation.id, 'stock', Math.max(0, parseInt(e.target.value) || 0))}
                              className={`w-16 px-2 py-1 border rounded-lg text-center text-xs ${
                                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                              }`}
                              min="0"
                              placeholder="Stock"
                            />
                            <input
                              type="text"
                              value={variation.price ? formatPriceCOP(variation.price) : ''}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '').replace(',', '.');
                                const numValue = parseFloat(rawValue) || undefined;
                                handleUpdateVariation(variation.id, 'price', numValue);
                              }}
                              className={`w-20 px-2 py-1 border rounded-lg text-xs ${
                                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                              }`}
                              placeholder="Precio"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveVariation(variation.id)}
                              className={`p-1.5 rounded-lg hover:bg-red-100 ${isDark ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-4 rounded-xl ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                      <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Añade variaciones como Modelo, Peso, Talla, etc.
                      </p>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-4">
                  <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-white' : 'text-zinc-700'}`}>
                    <input
                      type="checkbox"
                      checked={editForm.isNew || false}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold">Producto Nuevo</span>
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'text-white' : 'text-zinc-700'}`}>
                    <input
                      type="checkbox"
                      checked={editForm.isTrending || false}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isTrending: e.target.checked }))}
                      className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold">Producto Trending</span>
                  </label>
                </div>

                {/* Actions */}
                <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                      isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

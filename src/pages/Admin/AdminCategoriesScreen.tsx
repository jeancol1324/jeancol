import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check, Search, Upload, Camera, Package } from 'lucide-react';
import { useCategories, Category, useCategoryCount } from '../../context/CategoryContext';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useTheme } from '../../context/ThemeContext';

const CategoryCard: React.FC<{
  category: Category;
  isDark: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}> = ({ category, isDark, onEdit, onDelete }) => {
  const productCount = useCategoryCount(category.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border group hover:shadow-xl transition-all duration-300 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'
      }`}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <h3 className="text-sm sm:text-lg lg:text-xl font-black text-white uppercase tracking-tight drop-shadow-lg line-clamp-1">
            {category.name}
          </h3>
        </div>

        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          >
            <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-zinc-700" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 sm:p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
          >
            <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Package className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {productCount} {productCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onEdit(category)}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-primary hover:bg-zinc-800' : 'text-zinc-400 hover:text-primary hover:bg-primary/10'}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-red-400 hover:bg-red-900/20' : 'text-zinc-400 hover:text-red-500 hover:bg-red-50'}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const AdminCategoriesScreen = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData(prev => ({ ...prev, image: base64 }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image: category.image });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      deleteCategory(id);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', image: '' });
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
      <AdminNavigation />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Categorías
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-sm sm:text-base">Nueva</span>
          </button>
        </div>

        <div className="relative mb-6">
          <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              isDark ? 'bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border border-zinc-200 text-zinc-900'
            }`}
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className={`text-center py-16 sm:py-20 rounded-2xl sm:rounded-3xl border-2 border-dashed ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <Package className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 ${isDark ? 'text-zinc-700' : 'text-zinc-300'}`} />
            <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {searchQuery ? 'No se encontraron categorías' : 'No hay categorías'}
            </p>
            {!searchQuery && (
              <p className={`text-sm mt-1 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Crea tu primera categoría
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <AnimatePresence>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CategoryCard
                    category={category}
                    isDark={isDark}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 w-full max-w-md sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto ${
                isDark ? 'bg-zinc-900' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {editingCategory ? 'Editar' : 'Nueva'} Categoría
                </h2>
                <button
                  onClick={resetForm}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  <X className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark ? 'bg-zinc-800 border border-zinc-700 text-white' : 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                    }`}
                    placeholder="Ej: Electrónicos"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Imagen de la Categoría
                  </label>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all ${
                      formData.image 
                        ? 'ring-2 ring-primary' 
                        : `border-2 border-dashed ${isDark ? 'border-zinc-700 hover:border-primary' : 'border-zinc-300 hover:border-primary'}`
                    } ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}
                  >
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-center text-white">
                            <Camera className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm font-bold">Cambiar imagen</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center py-6">
                        <Upload className={`w-8 sm:w-10 h-8 sm:h-10 mb-2 sm:mb-3 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
                        <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Haz clic para subir una imagen
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`flex-1 py-2.5 sm:py-3 rounded-xl font-bold transition-colors text-sm sm:text-base ${
                      isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                    {editingCategory ? 'Guardar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategoriesScreen;

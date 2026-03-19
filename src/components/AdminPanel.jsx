import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiLogOut, FiSave, FiX, FiArrowLeft, FiEyeOff, FiPackage, FiShoppingCart, FiUpload } from 'react-icons/fi';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SalesPanel from './SalesPanel';

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  imageUrl: '',
  gallery: ['', '', '', ''],
  collectionName: '',
  collectionDescription: '',
  categoria: '',
  talles: [],
  colores: [],
  composicion: '',
  fabricacion: '',
  cuidados: '',
  active: true,
  order: 0,
};

const TALLES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CATEGORIAS_OPTIONS = [
  'Blazers', 'Camisas', 'Remeras', 'Tops', 'Vestidos',
  'Pantalones', 'Faldas', 'Shorts', 'Chalecos', 'Sacos',
  'Tapados', 'Camperas', 'Sweaters', 'Buzos', 'Bodys',
  'Monos', 'Accesorios',
];

const formatPrice = (raw) => {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  return '$' + num.toLocaleString('es-AR');
};

const ConfirmModal = ({ title, message, confirmText, confirmColor, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-700 text-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-600 transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 rounded font-medium transition-colors text-sm text-white ${confirmColor}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

const FORM_STORAGE_KEY = 'admin-form-draft';

const ProductForm = ({ product, onSave, onCancel, onDelete, loading, existingCollections, existingCategories, collectionDescriptions, nextOrder }) => {
  const [form, setForm] = useState(() => {
    // Intentar restaurar borrador guardado
    try {
      const saved = sessionStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {}
    const base = { ...EMPTY_PRODUCT, ...product };
    if (base.price) base.price = formatPrice(base.price);
    if (!product && nextOrder != null) base.order = nextOrder;
    return base;
  });

  // Guardar borrador en cada cambio
  useEffect(() => {
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
  }, [form]);
  const [newColor, setNewColor] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const { token } = useAuth();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, target, index) => {
    if (!file) return;
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      setUploadError('Solo se aceptan imágenes en formato JPG/JPEG.');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    try {
      const oldUrl = target === 'main' ? form.imageUrl : form.gallery[index];
      const { url } = await adminApi.uploadImage(token, file, oldUrl, (progress) => {
        setUploadProgress(progress);
      });
      if (target === 'main') {
        setForm(prev => ({ ...prev, imageUrl: url }));
      } else {
        setForm(prev => {
          const gallery = [...prev.gallery];
          gallery[index] = url;
          return { ...prev, gallery };
        });
      }
    } catch (err) {
      setUploadError('Error al subir imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryChange = (index, value) => {
    setForm(prev => {
      const gallery = [...prev.gallery];
      gallery[index] = value;
      return { ...prev, gallery };
    });
  };

  const addGallerySlot = () => {
    setForm(prev => ({ ...prev, gallery: [...prev.gallery, ''] }));
  };

  const removeGallerySlot = async (index) => {
    const urlToDelete = form.gallery[index];
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    // Borrar de Cloudinary si era una imagen subida
    if (urlToDelete && urlToDelete.includes('res.cloudinary.com')) {
      try {
        await adminApi.deleteImage(token, urlToDelete);
      } catch (err) {
        console.warn('No se pudo borrar imagen de Cloudinary:', err.message);
      }
    }
  };

  const toggleTalle = (talle) => {
    setForm(prev => ({
      ...prev,
      talles: prev.talles.includes(talle)
        ? prev.talles.filter(t => t !== talle)
        : [...prev.talles, talle],
    }));
  };

  const addColor = () => {
    const raw = newColor.trim();
    const color = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    if (color && !form.colores.includes(color)) {
      setForm(prev => ({ ...prev, colores: [...prev.colores, color] }));
      setNewColor('');
    }
  };

  const removeColor = (color) => {
    setForm(prev => ({
      ...prev,
      colores: prev.colores.filter(c => c !== color),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanGallery = form.gallery.filter(url => url.trim() !== '');
    const normalizedPrice = formatPrice(form.price);
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    onSave({ ...form, price: normalizedPrice, gallery: cleanGallery });
  };

  const inputClass = 'w-full bg-gray-800 border border-gray-700 text-gray-100 rounded px-3 py-2 focus:outline-none focus:border-purple-500 text-sm';
  const labelClass = 'block text-gray-400 text-sm mb-1 font-medium';

  const isExistingCollection = existingCollections.includes(form.collectionName);

  return (
    <>
    {uploading && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-80 shadow-2xl">
          <p className="text-white text-center font-medium mb-3">Subiendo imagen...</p>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-purple-500 h-4 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-purple-400 text-center text-sm mt-2 font-mono">{uploadProgress}%</p>
        </div>
      </div>
    )}
    {uploadError && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-red-800/50">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300 font-medium">{uploadError}</p>
          </div>
          <button onClick={() => setUploadError('')} className="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    )}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre * <span className="text-gray-600 font-normal">({form.name.length}/60)</span></label>
          <input className={inputClass} value={form.name} onChange={e => handleChange('name', e.target.value)} required maxLength={60} />
        </div>
        <div>
          <label className={labelClass}>Precio *</label>
          <input className={inputClass} value={form.price}
            onChange={e => handleChange('price', formatPrice(e.target.value))}
            required placeholder="$45.200" />
        </div>
        <div>
          <label className={labelClass}>Colección *</label>
          <div className="flex gap-2">
            <select
              className={`${inputClass} w-1/2`}
              value={existingCollections.includes(form.collectionName) ? form.collectionName : ''}
              onChange={e => {
                if (e.target.value) {
                  handleChange('collectionName', e.target.value);
                  if (collectionDescriptions[e.target.value]) {
                    handleChange('collectionDescription', collectionDescriptions[e.target.value]);
                  }
                }
              }}
            >
              <option value="">Seleccionar existente...</option>
              {existingCollections.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <input
              className={`${inputClass} w-1/2`}
              value={form.collectionName}
              onChange={e => handleChange('collectionName', e.target.value)}
              required
              placeholder="O escribir nueva..."
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Descripción de colección <span className="text-gray-600 font-normal">({form.collectionDescription.length}/100)</span></label>
          <input className={`${inputClass} ${isExistingCollection ? 'opacity-50 cursor-not-allowed' : ''}`}
            value={form.collectionDescription}
            onChange={e => handleChange('collectionDescription', e.target.value)}
            maxLength={100}
            disabled={isExistingCollection}
            placeholder={isExistingCollection ? 'Se usa la descripción existente' : 'Descripción de la nueva colección'}
          />
        </div>
        <div>
          <label className={labelClass}>Categoría (tipo de prenda)</label>
          <div className="flex gap-2">
            <select
              className={`${inputClass} w-1/2`}
              value={CATEGORIAS_OPTIONS.includes(form.categoria) ? form.categoria : ''}
              onChange={e => { if (e.target.value) handleChange('categoria', e.target.value); }}
            >
              <option value="">Seleccionar tipo...</option>
              {CATEGORIAS_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {existingCategories
                .filter(c => !CATEGORIAS_OPTIONS.includes(c))
                .map(cat => <option key={cat} value={cat}>{cat}</option>)
              }
            </select>
            <input
              className={`${inputClass} w-1/2`}
              value={form.categoria}
              onChange={e => handleChange('categoria', e.target.value)}
              placeholder="O escribir nueva..."
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Orden</label>
          <input type="number" className={inputClass} value={form.order} onChange={e => handleChange('order', parseInt(e.target.value) || 0)} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => handleChange('active', e.target.checked)} className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
          <span className="text-gray-400 text-sm">Producto activo</span>
        </div>
      </div>

      <div>
        <label className={labelClass}>Imagen principal *</label>
        <div className="flex gap-2 mb-2">
          <input className={inputClass} value={form.imageUrl} onChange={e => handleChange('imageUrl', e.target.value)} required placeholder="URL o subí una foto (solo JPG)" />
          <label className={`flex items-center gap-1 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${uploading ? 'bg-gray-600 text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
            <FiUpload size={14} />
            {uploading ? '...' : 'Subir'}
            <input type="file" accept="image/jpeg" className="hidden" disabled={uploading}
              onChange={e => handleImageUpload(e.target.files[0], 'main')} />
          </label>
        </div>
        {form.imageUrl && (
          <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded border border-gray-700" />
        )}
      </div>

      <div>
        <label className={labelClass}>Galería de imágenes</label>
        {form.gallery.map((url, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            {url && <img src={url} alt={`Gallery ${i + 1}`} className="w-10 h-10 object-cover rounded border border-gray-700 flex-shrink-0" />}
            <input className={inputClass} value={url} onChange={e => handleGalleryChange(i, e.target.value)} placeholder={`Imagen ${i + 1}`} />
            <label className={`flex items-center gap-1 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${uploading ? 'bg-gray-600 text-gray-400' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
              <FiUpload size={14} />
              <input type="file" accept="image/jpeg" className="hidden" disabled={uploading}
                onChange={e => handleImageUpload(e.target.files[0], 'gallery', i)} />
            </label>
            <button type="button" onClick={() => removeGallerySlot(i)} className="text-red-400 hover:text-red-300 p-2">
              <FiX size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addGallerySlot} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mt-1">
          <FiPlus size={14} /> Agregar imagen
        </button>
      </div>

      <div>
        <label className={labelClass}>Talles</label>
        <div className="flex gap-2 flex-wrap">
          {TALLES_OPTIONS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTalle(t)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                form.talles.includes(t)
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Colores</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.colores.map(c => (
            <span key={c} className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              {c}
              <button type="button" onClick={() => removeColor(c)} className="text-gray-500 hover:text-red-400">
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            placeholder="Agregar color..."
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); }}}
          />
          <button type="button" onClick={addColor} className="bg-gray-700 text-gray-300 px-3 py-2 rounded hover:bg-gray-600 text-sm">
            Agregar
          </button>
        </div>
      </div>

      <div>
        <label className={labelClass}>Composición <span className="text-gray-600 font-normal">({form.composicion.length}/120)</span></label>
        <input className={inputClass} value={form.composicion} onChange={e => handleChange('composicion', e.target.value)} maxLength={120} />
      </div>

      <div>
        <label className={labelClass}>Fabricación <span className="text-gray-600 font-normal">({form.fabricacion.length}/300)</span></label>
        <textarea className={`${inputClass} h-20 resize-none`} value={form.fabricacion} onChange={e => handleChange('fabricacion', e.target.value)} maxLength={300} />
      </div>

      <div>
        <label className={labelClass}>Cuidados <span className="text-gray-600 font-normal">({form.cuidados.length}/200)</span></label>
        <textarea className={`${inputClass} h-20 resize-none`} value={form.cuidados} onChange={e => handleChange('cuidados', e.target.value)} maxLength={200} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FiSave size={16} />
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 text-gray-300 px-6 py-2 rounded font-medium hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto bg-red-900/30 text-red-400 px-4 py-2 rounded font-medium hover:bg-red-900/50 transition-colors flex items-center gap-2"
          >
            <FiTrash2 size={16} />
            Eliminar producto
          </button>
        )}
      </div>
    </form>
    </>
  );
};

const AdminPanel = ({ setCurrentSection }) => {
  const { token, logout } = useAuth();
  const [activeTab, setActiveTabState] = useState(() => {
    return sessionStorage.getItem('admin-tab') || 'products';
  });
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    sessionStorage.setItem('admin-tab', tab);
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProductState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('admin-editing');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const setEditingProduct = (value) => {
    setEditingProductState(value);
    if (value) {
      sessionStorage.setItem('admin-editing', JSON.stringify(value));
    } else {
      sessionStorage.removeItem('admin-editing');
      sessionStorage.removeItem(FORM_STORAGE_KEY);
    }
  };
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.getProducts(token);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    try {
      if (editingProduct === 'new') {
        await adminApi.createProduct(token, formData);
        showSuccess('Producto creado correctamente');
      } else {
        await adminApi.updateProduct(token, editingProduct._id, formData);
        showSuccess('Producto actualizado correctamente');
      }
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = (product) => {
    setConfirmModal({
      title: 'Desactivar producto',
      message: `¿Desactivar "${product.name}"? El producto dejará de ser visible pero no se eliminará.`,
      confirmText: 'Desactivar',
      confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await adminApi.deleteProduct(token, product._id);
          showSuccess('Producto desactivado');
          await fetchProducts();
        } catch (err) {
          setError(err.message);
        }
      },
    });
  };

  const handlePermanentDelete = (product) => {
    setConfirmModal({
      title: 'Eliminar permanentemente',
      message: `¿ELIMINAR "${product.name}"? Esta acción no se puede deshacer y se perderán todos los datos del producto.`,
      confirmText: 'Eliminar',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await adminApi.permanentDeleteProduct(token, product._id);
          showSuccess('Producto eliminado permanentemente');
          setEditingProduct(null);
          await fetchProducts();
        } catch (err) {
          setError(err.message);
        }
      },
    });
  };

  const handleRestore = async (product) => {
    try {
      await adminApi.restoreProduct(token, product._id);
      showSuccess('Producto restaurado');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentSection('home');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {confirmModal && (
        <ConfirmModal
          {...confirmModal}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentSection('home')} className="text-gray-400 hover:text-gray-100 flex items-center gap-1">
              <FiArrowLeft size={18} />
              <span className="text-sm">Volver al sitio</span>
            </button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <FiPackage size={14} /> Productos
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm transition-colors ${activeTab === 'sales' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <FiShoppingCart size={14} /> Ventas
            </button>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 flex items-center gap-1 text-sm">
            <FiLogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-900/50 text-red-300 text-sm px-4 py-3 rounded mb-4 flex justify-between items-center">
            {error}
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-200"><FiX size={16} /></button>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-900/50 text-green-300 text-sm px-4 py-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        {activeTab === 'sales' ? (
          <SalesPanel />
        ) : (
        <>
        {/* Form view */}
        {editingProduct !== null ? (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">
              {editingProduct === 'new' ? 'Nuevo Producto' : `Editar: ${editingProduct.name}`}
            </h2>
            <ProductForm
              product={editingProduct === 'new' ? null : editingProduct}
              onSave={handleSave}
              onCancel={() => {
                sessionStorage.removeItem(FORM_STORAGE_KEY);
                setEditingProduct(null);
              }}
              onDelete={editingProduct !== 'new' ? () => handlePermanentDelete(editingProduct) : null}
              loading={saving}
              existingCollections={[...new Set(products.map(p => p.collectionName).filter(Boolean))]}
              existingCategories={[...new Set(products.map(p => p.categoria).filter(Boolean))]}
              collectionDescriptions={Object.fromEntries(
                [...new Set(products.map(p => p.collectionName).filter(Boolean))].map(name => [
                  name,
                  products.find(p => p.collectionName === name && p.collectionDescription)?.collectionDescription || ''
                ])
              )}
              nextOrder={Math.max(0, ...products.map(p => p.order || 0)) + 1}
            />
          </div>
        ) : (
          /* List view */
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">{products.length} productos en total</p>
              <div className="flex gap-3">
                <button onClick={fetchProducts} className="bg-gray-800 text-gray-300 px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2 text-sm">
                  <FiRefreshCw size={14} /> Recargar
                </button>
                <button onClick={() => setEditingProduct('new')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2 text-sm">
                  <FiPlus size={14} /> Nuevo Producto
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">Cargando productos...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="mb-4">No hay productos registrados.</p>
                <button onClick={() => setEditingProduct('new')} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                  Crear primer producto
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {products.map(product => (
                  <div
                    key={product._id}
                    className={`bg-gray-900 border rounded-lg p-4 flex items-center gap-4 ${
                      product.active ? 'border-gray-800' : 'border-red-900/50 opacity-60'
                    }`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        {!product.active && (
                          <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">Inactivo</span>
                        )}
                      </div>
                      <p className="text-purple-400 text-sm">{product.price}</p>
                      <p className="text-gray-600 text-xs">{product.collectionName}{product.categoria ? ` · ${product.categoria}` : ''} · Orden: {product.order}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-gray-800 text-gray-300 p-2 rounded hover:bg-gray-700"
                        title="Editar"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      {product.active ? (
                        <button
                          onClick={() => handleDeactivate(product)}
                          className="bg-gray-800 text-yellow-400 p-2 rounded hover:bg-yellow-900/30"
                          title="Desactivar"
                        >
                          <FiEyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(product)}
                          className="bg-gray-800 text-green-400 p-2 rounded hover:bg-green-900/30"
                          title="Restaurar"
                        >
                          <FiRefreshCw size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handlePermanentDelete(product)}
                        className="bg-gray-800 text-red-400 p-2 rounded hover:bg-red-900/30"
                        title="Eliminar permanentemente"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

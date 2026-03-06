import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { parsePrice } from '../data/products';
import { useTheme } from '../context/ThemeContext';

const INITIAL_FORM = { nombre: '', apellido: '', codigoPostal: '', ciudad: '', provincia: '', email: '', telefono: '' };

const CheckoutForm = ({ cart, cartTotal, onClose, onSuccess }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias')
      .then(res => res.json())
      .then(data => setProvincias(data.provincias || []));
  }, []);

  useEffect(() => {
    if (formData.provincia) {
      setLoadingCiudades(true);
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(formData.provincia)}&max=1000`)
        .then(res => res.json())
        .then(data => setCiudades(data.localidades || []))
        .finally(() => setLoadingCiudades(false));
    } else {
      setCiudades([]);
    }
  }, [formData.provincia]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(c => ({
        title: c.name,
        unit_price: parsePrice(c.price),
        quantity: c.quantity,
      }));
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...formData }),
      });
      const data = await response.json();
      if (data && data.init_point) {
        onSuccess(data.init_point);
      } else {
        alert("Error al iniciar el pago. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-black/50' : 'bg-black/50'}`}>
      <form onSubmit={handleSubmit} className={`${isDark ? 'bg-gray-950' : 'bg-white'} p-8 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto`}>
        <button type="button" onClick={onClose} className={`absolute top-2 right-2 ${isDark ? 'text-gray-600 hover:text-gray-100' : 'text-gray-500 hover:text-black'} text-2xl`}>&times;</button>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : ''}`}>Resumen de compra</h2>

        <div className={`mb-6 border rounded p-3 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50'}`}>
          {cart.map(item => (
            <div key={item.id} className={`flex justify-between text-sm py-1 ${isDark ? 'text-gray-400' : ''}`}>
              <span>{item.name} x{item.quantity}</span>
              <span className="font-medium">${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</span>
            </div>
          ))}
          <div className={`flex justify-between font-bold text-base mt-2 pt-2 ${isDark ? 'border-gray-800 text-gray-100' : 'border-gray-200'} border-t`}>
            <span>Total:</span>
            <span>${cartTotal.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-100' : ''}`}>Datos de envío</h3>
        <div className="grid grid-cols-1 gap-4">
          <input name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre" className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} />
          <input name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Apellido" className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} />
          <input name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} required placeholder="Código Postal" className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} />
          <select name="provincia" value={formData.provincia} onChange={handleInputChange} required className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`}>
            <option value="">Selecciona una provincia</option>
            {provincias.map(prov => <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>)}
          </select>
          <select name="ciudad" value={formData.ciudad} onChange={handleInputChange} required className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} disabled={!formData.provincia || loadingCiudades}>
            <option value="">{loadingCiudades ? 'Cargando ciudades...' : 'Selecciona una ciudad'}</option>
            {ciudades.map(ciudad => <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>)}
          </select>
          <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="Email" className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} />
          <input name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="Teléfono" className={`border p-2 rounded ${isDark ? 'bg-gray-900 border-gray-800 text-gray-100' : ''}`} />
        </div>
        <button type="submit" className={`mt-6 w-full py-2 rounded font-medium transition-colors ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        }`} disabled={loading}>
          {loading ? 'Procesando...' : 'Ir a pagar'}
        </button>
      </form>
    </div>,
    document.body
  );
};

export default CheckoutForm;

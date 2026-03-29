import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { parsePrice } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const INITIAL_FORM = { nombre: '', apellido: '', email: '', telefono: '', direccion: '', pisoDepto: '', codigoPostal: '', provincia: '', ciudad: '' };

const CheckoutForm = ({ cart, cartTotal, onClose, onSuccess }) => {
  const { isDark } = useTheme();
  const { user, userToken } = useUserAuth();
  const { translatedText: orderSummaryText } = useAutoTranslate('Resumen de compra');
  const { translatedText: totalLabel } = useAutoTranslate('Total:');
  const { translatedText: shippingText } = useAutoTranslate('Datos de envío');
  const { translatedText: nameText } = useAutoTranslate('Nombre');
  const { translatedText: lastNameText } = useAutoTranslate('Apellido');
  const { translatedText: zipText } = useAutoTranslate('Código Postal');
  const { translatedText: selectProvinceText } = useAutoTranslate('Selecciona una provincia');
  const { translatedText: loadingCitiesText } = useAutoTranslate('Cargando ciudades...');
  const { translatedText: selectCityText } = useAutoTranslate('Selecciona una ciudad');
  const { translatedText: phoneText } = useAutoTranslate('Teléfono');
  const { translatedText: addressText } = useAutoTranslate('Dirección (calle y número)');
  const { translatedText: floorText } = useAutoTranslate('Piso / Depto (opcional)');
  const { translatedText: errorPaymentText } = useAutoTranslate('Error al iniciar el pago. Intenta de nuevo.');
  const { translatedText: errorConnectionText } = useAutoTranslate('Error de conexión con el servidor.');
  const { translatedText: processingText } = useAutoTranslate('Procesando...');
  const { translatedText: goToPayText } = useAutoTranslate('Ir a pagar');
  const [formData, setFormData] = useState(() => {
    if (user) {
      return {
        ...INITIAL_FORM,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        pisoDepto: user.pisoDepto || '',
        codigoPostal: user.codigoPostal || '',
        provincia: user.provincia || '',
        ciudad: user.ciudad || '',
      };
    }
    return INITIAL_FORM;
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const cap = v => v.replace(/(^|\s)\S/g, c => c.toUpperCase());
  const capFields = ['nombre', 'apellido', 'direccion', 'pisoDepto'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: capFields.includes(name) ? cap(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const items = cart.map(c => ({
        id: c._id || c.name,
        title: c.name,
        description: c.description || c.name,
        category_id: c.category || 'fashion',
        unit_price: parsePrice(c.price),
        quantity: c.quantity,
      }));
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...formData, ...(userToken ? { userToken } : {}) }),
      });
      const data = await response.json();
      if (data && data.init_point) {
        onSuccess(data.init_point);
      } else {
        setErrorMsg(errorPaymentText);
      }
    } catch {
      setErrorMsg(errorConnectionText);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}>
      <form onSubmit={handleSubmit} className={`${isDark ? 'bg-neutral-950' : 'bg-white'} p-4 md:p-8 shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto win-frame`}>
        <button type="button" onClick={onClose} className={`absolute top-2 right-2 ${isDark ? 'text-neutral-600 hover:text-neutral-100' : 'text-gray-500 hover:text-black'} text-2xl`}>&times;</button>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-neutral-100' : ''}`}>{orderSummaryText}</h2>

        <div className={`mb-6 border p-3 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-50'}`}>
          {cart.map(item => (
            <div key={item._id} className={`flex justify-between text-sm py-1 ${isDark ? 'text-neutral-400' : ''}`}>
              <span>{item.name} x{item.quantity}</span>
              <span className="font-medium">${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</span>
            </div>
          ))}
          <div className={`flex justify-between font-bold text-base mt-2 pt-2 ${isDark ? 'border-neutral-800 text-neutral-100' : 'border-gray-200'} border-t`}>
            <span>{totalLabel}</span>
            <span>${cartTotal.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-neutral-100' : ''}`}>{shippingText}</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder={nameText} className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
            <input name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder={lastNameText} className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="Email" className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
            <input name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder={phoneText} className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="direccion" value={formData.direccion} onChange={handleInputChange} required placeholder={addressText} className={`md:col-span-2 border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
            <input name="pisoDepto" value={formData.pisoDepto} onChange={handleInputChange} placeholder={floorText} className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} required placeholder={zipText} className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} />
            <select name="provincia" value={formData.provincia} onChange={handleInputChange} required className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`}>
              <option value="">{selectProvinceText}</option>
              {provincias.map(prov => <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>)}
            </select>
            <select name="ciudad" value={formData.ciudad} onChange={handleInputChange} required className={`border p-3 text-base ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : ''}`} disabled={!formData.provincia || loadingCiudades}>
              <option value="">{loadingCiudades ? loadingCitiesText : selectCityText}</option>
              {ciudades.map(ciudad => <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>)}
            </select>
          </div>
        </div>
        {errorMsg && (
          <div className={`mt-4 flex items-center gap-2 px-4 py-3 text-sm font-medium ${
            isDark ? 'bg-red-900/40 text-red-300 border border-red-800/50' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        )}
        <button type="submit" className={`mt-6 w-full py-3 tracking-widest uppercase text-xs border cursor-pointer transition-colors duration-300 win-btn ${
          isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
        } disabled:opacity-50 disabled:cursor-not-allowed`} disabled={loading}>
          {loading ? processingText : goToPayText}
        </button>
      </form>
    </div>,
    document.body
  );
};

export default CheckoutForm;

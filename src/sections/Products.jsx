
import { motion } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import WhatsAppContact from '../components/WhatsAppContact';

const PRODUCT_IMAGES = {
  blazer: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
  vestido: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  pantalon: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  top: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
  chaleco: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  falda: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
};

const Products = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    email: '',
    telefono: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

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

  const initialFormData = {
    nombre: '',
    apellido: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    email: '',
    telefono: '',
  };

  const handleBuy = (item) => {
    setSelectedItem(item);
    setFormData(initialFormData);
    setShowForm(true);
    setLoadingId(null); 
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingId(selectedItem.id);
    try {
      const unit_price = Number(selectedItem.price.replace(/[^\d]/g, ""));
      const response = await fetch("http://localhost:3000/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedItem.name,
          unit_price,
          quantity: 1,
          ...formData,
        }),
      });
      const data = await response.json();
      if (data && data.init_point) {
        setShowForm(false); 
        setTimeout(() => {
          window.location.href = data.init_point;
        }, 300);
      } else {
        alert("Error al iniciar el pago. Intenta de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoadingId(null);
      setSelectedItem(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const collections = [
    {
      name: "Colección Atemporal",
      description: "Piezas clásicas diseñadas para trascender temporadas",
      items: [
        { id: 1, name: "Blazer Oversize", price: "$50", imageKey: 'blazer' },
        { id: 2, name: "Vestido Midaxi", price: "$18.500", imageKey: 'vestido' },
        { id: 3, name: "Pantalón Wide Leg", price: "$15.200", imageKey: 'pantalon' }
      ]
    },
    {
      name: "Colección Experimental",
      description: "Diseños vanguardistas que desafían convenciones",
      items: [
        { id: 4, name: "Top Asimétrico", price: "$12.800", imageKey: 'top' },
        { id: 5, name: "Chaleco Escultural", price: "$21.300", imageKey: 'chaleco' },
        { id: 6, name: "Falda Capas", price: "$16.700", imageKey: 'falda' }
      ]
    }
  ];

  return (
    <section id="que-vendo" className="py-20 pt-10 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Tesoro</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Piezas exclusivas diseñadas con cuidado artesanal y atención al detalle
          </p>
        </motion.div>

        {collections.map((collection, colIndex) => (
          <motion.div
            key={colIndex}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: colIndex * 0.2, duration: 0.5 }}
            className="mb-20"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-black">{collection.name}</h3>
              <p className="text-gray-600">{collection.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collection.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: itemIndex * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
                >
                  <div className="h-64 overflow-hidden">
                    <motion.img
                      src={PRODUCT_IMAGES[item.imageKey]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-medium text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-purple-600 font-semibold mb-4">{item.price}</p>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "purple-300" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-full bg-black text-white py-2 px-4 rounded-md disabled:opacity-60"
                      onClick={() => handleBuy(item)}
                      disabled={loadingId === item.id}
                    >
                      <FiShoppingCart className="mr-2" />
                      {loadingId === item.id ? 'Redirigiendo...' : 'Comprar ahora'}
                    </motion.button>
                        {showForm && createPortal(
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                              <button type="button" onClick={() => { setShowForm(false); setSelectedItem(null); setFormData(initialFormData); setLoadingId(null); }} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">&times;</button>
                              <h2 className="text-xl font-bold mb-4">Datos para la compra</h2>
                              <div className="grid grid-cols-1 gap-4">
                                <input name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre" className="border p-2 rounded" />
                                <input name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Apellido" className="border p-2 rounded" />
                                <input name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} required placeholder="Código Postal" className="border p-2 rounded" />
                                <select
                                  name="provincia"
                                  value={formData.provincia}
                                  onChange={handleInputChange}
                                  required
                                  className="border p-2 rounded"
                                >
                                  <option value="">Selecciona una provincia</option>
                                  {provincias.map((prov) => (
                                    <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
                                  ))}
                                </select>
                                <select
                                  name="ciudad"
                                  value={formData.ciudad}
                                  onChange={handleInputChange}
                                  required
                                  className="border p-2 rounded"
                                  disabled={!formData.provincia || loadingCiudades}
                                >
                                  <option value="">{loadingCiudades ? 'Cargando ciudades...' : 'Selecciona una ciudad'}</option>
                                  {ciudades.map((ciudad) => (
                                    <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>
                                  ))}
                                </select>
                                <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="Email" className="border p-2 rounded" />
                                <input name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="Teléfono" className="border p-2 rounded" />
                              </div>
                              <button type="submit" className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-purple-700 transition-colors" disabled={loadingId === (selectedItem && selectedItem.id)}>
                                {loadingId === (selectedItem && selectedItem.id) ? 'Procesando...' : 'Ir a pagar'}
                              </button>
                            </form>
                          </div>,
                          document.body
                        )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-purple-50 p-8 rounded-lg text-center"
        >
          <h3 className="text-2xl font-semibold text-black mb-4">¿Buscas algo personalizado?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Cada pieza puede ser adaptada a tus medidas y preferencias. Contáctame para crear algo único para ti.
          </p>
          <motion.a
            href="https://wa.me/5493447552378?text=Hola%20Jess,%20me%20interesa%20un%20diseño%20personalizado"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-black transition-colors"
          >
            Solicitar diseño personalizado
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
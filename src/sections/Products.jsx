
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Carousel from '../components/Carousel';

const PRODUCT_IMAGES = {
  blazer: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
  vestido: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  pantalon: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  top: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
  chaleco: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
  falda: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
};

const PRODUCT_GALLERY = {
  blazer: [
    PRODUCT_IMAGES.blazer,
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1200&q=80',
  ],
  vestido: [
    PRODUCT_IMAGES.vestido,
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
  ],
  pantalon: [
    PRODUCT_IMAGES.pantalon,
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80',
  ],
  top: [
    PRODUCT_IMAGES.top,
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
  ],
  chaleco: [
    PRODUCT_IMAGES.chaleco,
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80',
  ],
  falda: [
    PRODUCT_IMAGES.falda,
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1592301933927-35b597393c0a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=1200&q=80',
  ],
};

const PRODUCT_DETAILS = {
  1: {
    talles: ['S', 'M', 'L', 'XL'],
    colores: ['Negro', 'Gris Oxford', 'Beige'],
    composicion: '70% Lana merino, 30% Poliéster reciclado',
    fabricacion: 'Confección artesanal en taller propio con corte italiano. Forro interior de satén. Terminaciones a mano con hilo de seda. Botones de nácar natural.',
    cuidados: 'Lavado en seco. No usar secadora. Planchar a temperatura media.',
  },
  2: {
    talles: ['XS', 'S', 'M', 'L'],
    colores: ['Negro', 'Borgoña', 'Verde bosque'],
    composicion: '85% Viscosa ecológica, 15% Elastano',
    fabricacion: 'Corte y confección artesanal. Costura francesa en todas las uniones. Ruedo invisible hecho a mano. Tela importada con certificación OEKO-TEX.',
    cuidados: 'Lavar a mano con agua fría. Secar a la sombra. Planchar del revés.',
  },
  3: {
    talles: ['S', 'M', 'L', 'XL', 'XXL'],
    colores: ['Crudo', 'Negro', 'Camel'],
    composicion: '100% Algodón orgánico de alto gramaje',
    fabricacion: 'Pierna wide leg con pinzas delanteras. Cintura alta con pretina forrada. Cierre YKK invisible lateral. Dobladillo con puntada ciega artesanal.',
    cuidados: 'Lavado a máquina en frío. No usar blanqueador. Secar colgado.',
  },
  4: {
    talles: ['XS', 'S', 'M', 'L'],
    colores: ['Blanco roto', 'Negro', 'Terracota'],
    composicion: '60% Algodón pima, 40% Modal',
    fabricacion: 'Diseño asimétrico con corte al bies. Costuras planas para mayor comodidad. Tejido con acabado enzimático para suavidad extra. Etiqueta impresa (sin costuras molestas).',
    cuidados: 'Lavar a máquina en ciclo delicado. No retorcer. Secar en horizontal.',
  },
  5: {
    talles: ['S', 'M', 'L'],
    colores: ['Negro', 'Blanco hueso', 'Gris perla'],
    composicion: '55% Lana virgen, 35% Poliamida, 10% Cashmere',
    fabricacion: 'Estructura escultural con entretela termoadhesiva. Forrado en jacquard de seda. Ojales abiertos a mano. Cada pieza lleva 12 horas de confección artesanal.',
    cuidados: 'Solo lavado en seco. Guardar en percha acolchada. Vaporizar para arrugas.',
  },
  6: {
    talles: ['XS', 'S', 'M', 'L', 'XL'],
    colores: ['Negro', 'Nude', 'Azul noche'],
    composicion: '80% Poliéster reciclado, 20% Viscosa',
    fabricacion: 'Sistema de capas superpuestas con corte láser en los bordes. Cintura elástica oculta con grip de silicona. Largo midi asimétrico. Telas teñidas con pigmentos naturales.',
    cuidados: 'Lavar a máquina en frío con bolsa de red. No usar suavizante. Secar colgado.',
  },
};

const parsePrice = (price) => Number(price.replace(/[^\d]/g, ""));

const Products = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('la-taller-cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', codigoPostal: '', ciudad: '', provincia: '', email: '', telefono: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('la-taller-cart', JSON.stringify(cart));
  }, [cart]);

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

  const initialFormData = { nombre: '', apellido: '', codigoPostal: '', ciudad: '', provincia: '', email: '', telefono: '' };

  // Carrito: agregar producto
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Carrito: cambiar cantidad
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  // Carrito: eliminar producto
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  // Total del carrito
  const cartTotal = cart.reduce((sum, c) => sum + parsePrice(c.price) * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  // Abrir formulario de checkout
  const handleCheckout = () => {
    setShowCart(false);
    setFormData(initialFormData);
    setShowForm(true);
  };

  // Enviar compra al servidor
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(c => ({
        title: c.name,
        unit_price: parsePrice(c.price),
        quantity: c.quantity,
      }));
      const response = await fetch("http://localhost:3000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, ...formData }),
      });
      const data = await response.json();
      if (data && data.init_point) {
        setShowForm(false);
        localStorage.removeItem('la-taller-cart');
        setCart([]);
        setTimeout(() => { window.location.href = data.init_point; }, 300);
      } else {
        alert("Error al iniciar el pago. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const collections = [
    {
      name: "Colección Atemporal",
      description: "Piezas clásicas diseñadas para trascender temporadas",
      items: [
        { id: 1, name: "Blazer Oversize", price: "$5", imageKey: 'blazer' },
        { id: 2, name: "Vestido Midaxi", price: "$18.500", imageKey: 'vestido' },
        { id: 3, name: "Pantalón Wide Leg", price: "$2", imageKey: 'pantalon' }
      ]
    },
    {
      name: "Colección Experimental",
      description: "Diseños vanguardistas que desafían convenciones",
      items: [
        { id: 4, name: "Top Asimétrico", price: "$5", imageKey: 'top' },
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
                  <div className="h-64 overflow-hidden relative group">
                    <motion.img
                      src={PRODUCT_IMAGES[item.imageKey]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                    >
                      <FiEye size={14} />
                      Ver más
                    </button>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-medium text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-purple-600 font-semibold mb-4">{item.price}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-full bg-black text-white py-2 px-4 rounded-md"
                      onClick={() => addToCart(item)}
                    >
                      <FiShoppingCart className="mr-2" />
                      Agregar al carrito
                    </motion.button>
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

      {/* Botón flotante del carrito */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCart(true)}
        className="fixed right-6 bottom-6 z-40 bg-black text-white p-4 rounded-full shadow-lg"
      >
        <FiShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </motion.button>

      {/* Panel lateral del carrito */}
      {createPortal(
        <AnimatePresence>
          {showCart && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Tu carrito ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-black"><FiX size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center mt-10">Tu carrito está vacío</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                      <img src={PRODUCT_IMAGES[item.imageKey]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-purple-600 text-sm font-semibold">{item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded hover:bg-gray-100"><FiMinus size={14} /></button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded hover:bg-gray-100"><FiPlus size={14} /></button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-1"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>${cartTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-purple-700 transition-colors"
                  >
                    Finalizar compra
                  </button>
                </div>
              )}
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal de detalle del producto */}
      {selectedProduct && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProduct(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Carousel */}
            <div className="w-full md:w-1/2 h-72 md:h-auto md:min-h-[500px] relative">
              <Carousel images={PRODUCT_GALLERY[selectedProduct.imageKey]} />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-xl text-purple-600 font-semibold mt-1">{selectedProduct.price}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-black"><FiX size={24} /></button>
              </div>

              {PRODUCT_DETAILS[selectedProduct.id] && (
                <div className="space-y-5 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Talles disponibles</h3>
                    <div className="flex gap-2 flex-wrap">
                      {PRODUCT_DETAILS[selectedProduct.id].talles.map(t => (
                        <span key={t} className="border border-gray-300 rounded px-3 py-1 text-gray-700">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Colores</h3>
                    <div className="flex gap-2 flex-wrap">
                      {PRODUCT_DETAILS[selectedProduct.id].colores.map(c => (
                        <span key={c} className="bg-gray-100 rounded-full px-3 py-1 text-gray-700">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Composición</h3>
                    <p className="text-gray-600">{PRODUCT_DETAILS[selectedProduct.id].composicion}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fabricación</h3>
                    <p className="text-gray-600">{PRODUCT_DETAILS[selectedProduct.id].fabricacion}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cuidados</h3>
                    <p className="text-gray-600">{PRODUCT_DETAILS[selectedProduct.id].cuidados}</p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-md"
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              >
                <FiShoppingCart className="mr-2" />
                Agregar al carrito
              </motion.button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Modal de formulario de checkout */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => { setShowForm(false); setFormData(initialFormData); }} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>

            {/* Resumen de items */}
            <div className="mb-6 border rounded p-3 bg-gray-50">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">${(parsePrice(item.price) * item.quantity).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${cartTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Datos de envío</h3>
            <div className="grid grid-cols-1 gap-4">
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre" className="border p-2 rounded" />
              <input name="apellido" value={formData.apellido} onChange={handleInputChange} required placeholder="Apellido" className="border p-2 rounded" />
              <input name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} required placeholder="Código Postal" className="border p-2 rounded" />
              <select name="provincia" value={formData.provincia} onChange={handleInputChange} required className="border p-2 rounded">
                <option value="">Selecciona una provincia</option>
                {provincias.map(prov => <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>)}
              </select>
              <select name="ciudad" value={formData.ciudad} onChange={handleInputChange} required className="border p-2 rounded" disabled={!formData.provincia || loadingCiudades}>
                <option value="">{loadingCiudades ? 'Cargando ciudades...' : 'Selecciona una ciudad'}</option>
                {ciudades.map(ciudad => <option key={ciudad.id} value={ciudad.nombre}>{ciudad.nombre}</option>)}
              </select>
              <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="Email" className="border p-2 rounded" />
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="Teléfono" className="border p-2 rounded" />
            </div>
            <button type="submit" className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-purple-700 transition-colors" disabled={loading}>
              {loading ? 'Procesando...' : 'Ir a pagar'}
            </button>
          </form>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Products;
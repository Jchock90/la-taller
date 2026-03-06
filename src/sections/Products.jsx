
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { COLLECTIONS, parsePrice } from '../data/products';
import { WHATSAPP_URL } from '../data/constants';
import ProductCard from '../components/ProductCard';
import { CartPanel, CartButton } from '../components/CartPanel';
import ProductDetailModal from '../components/ProductDetailModal';
import CheckoutForm from '../components/CheckoutForm';
import Toast from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const Products = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const { translatedText: titleText } = useAutoTranslate('Tesoro');
  const { translatedText: subtitleText } = useAutoTranslate('Piezas exclusivas diseñadas con cuidado artesanal y atención al detalle');
  const { translatedText: customTitle } = useAutoTranslate('¿Buscas algo personalizado?');
  const { translatedText: customDesc } = useAutoTranslate('Cada pieza puede ser adaptada a tus medidas y preferencias. Contáctame para crear algo único para ti.');
  const { translatedText: customButton } = useAutoTranslate('Solicitar diseño personalizado');
  
  const { translatedText: collection1Name } = useAutoTranslate('Colección Atemporal');
  const { translatedText: collection1Desc } = useAutoTranslate('Piezas clásicas diseñadas para trascender temporadas');
  const { translatedText: collection2Name } = useAutoTranslate('Colección Experimental');
  const { translatedText: collection2Desc } = useAutoTranslate('Diseños vanguardistas que desafían convenciones');
  
  const collectionTranslations = {
    'Colección Atemporal': { name: collection1Name, description: collection1Desc },
    'Colección Experimental': { name: collection2Name, description: collection2Desc }
  };
  
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('la-taller-cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('la-taller-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, selectedSize, selectedColor) => {
    setCart(prev => {
      const itemKey = `${item.id}-${selectedSize || ''}-${selectedColor || ''}`;
      const existing = prev.find(c => 
        c.id === item.id && 
        c.selectedSize === selectedSize && 
        c.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map(c => 
          c.id === item.id && c.selectedSize === selectedSize && c.selectedColor === selectedColor
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1, selectedSize, selectedColor }];
    });

    const sizeText = selectedSize ? ` (${selectedSize})` : '';
    const colorText = selectedColor ? ` - ${selectedColor}` : '';
    setToastMessage(`${item.name}${sizeText}${colorText} agregado al carrito`);
    setShowToast(true);
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => prev.map((c, i) => i === index ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((c, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, c) => sum + parsePrice(c.price) * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCheckout = () => {
    setShowCart(false);
    setShowForm(true);
  };

  const handlePaymentSuccess = (initPoint) => {
    setShowForm(false);
    localStorage.removeItem('la-taller-cart');
    setCart([]);
    setTimeout(() => { window.location.href = initPoint; }, 300);
  };

  return (
    <section id="que-vendo" className={`py-20 pt-10 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-black'} mb-4`}>{titleText}</h2>
          <p className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {subtitleText}
          </p>
        </motion.div>

        {COLLECTIONS.map((collection, colIndex) => (
          <motion.div
            key={colIndex}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: colIndex * 0.2, duration: 0.5 }}
            className="mb-20"
          >
            <div className="mb-8">
              <h3 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-black'}`}>
                {collectionTranslations[collection.name]?.name || collection.name}
              </h3>
              <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
                {collectionTranslations[collection.name]?.description || collection.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collection.items.map((item, itemIndex) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={itemIndex}
                  onAddToCart={addToCart}
                  onViewDetail={setSelectedProduct}
                />
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`${isDark ? 'bg-black' : 'bg-white'} p-8 rounded-lg text-center`}
        >
          <h3 className={`text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-black'} mb-4`}>{customTitle}</h3>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-700'} mb-6 max-w-2xl mx-auto`}>
            {customDesc}
          </p>
          <motion.a
            href={WHATSAPP_URL}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-8 py-3 rounded-full font-medium shadow-lg transition-colors ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {customButton}
          </motion.a>
        </motion.div>
      </div>

      <CartButton cartCount={cartCount} onClick={() => setShowCart(true)} />

      <CartPanel
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        showCart={showCart}
        onClose={() => setShowCart(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {showForm && (
        <CheckoutForm
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowForm(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <Toast 
        message={toastMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </section>
  );
};

export default Products;
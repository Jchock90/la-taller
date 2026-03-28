
import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { parsePrice } from '../data/products';
import { productsApi } from '../services/api';
import { WHATSAPP_URL } from '../data/constants';
import ProductCard from '../components/ProductCard';
import { CartPanel, CartButton } from '../components/CartPanel';
import ProductDetailModal from '../components/ProductDetailModal';
import CheckoutForm from '../components/CheckoutForm';
import Toast from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoTranslate, TranslatedText, TranslatedOption } from '../hooks/useAutoTranslate';

const GAP = 24; // gap-6 = 24px

const CollectionCarousel = ({ items, onViewDetail }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const updateVisibleCount = () => {
    const w = window.innerWidth;
    if (w < 640) setVisibleCount(1);
    else if (w < 1024) setVisibleCount(2);
    else setVisibleCount(4);
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    updateVisibleCount();
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const onResize = () => { updateVisibleCount(); checkScroll(); };
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [items]);

  // Prevent wheel events from being captured by horizontal carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const preventWheelCapture = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      }
    };
    el.addEventListener('wheel', preventWheelCapture, { passive: false });
    return () => el.removeEventListener('wheel', preventWheelCapture);
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const containerWidth = el.clientWidth;
    el.scrollBy({ left: direction * containerWidth, behavior: 'smooth' });
  };

  const cardWidth = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`;

  return (
    <div className="flex items-center gap-3">
      {/* Left arrow — outside */}
      <button
        onClick={() => scroll(-1)}
        disabled={!canScrollLeft}
        className={`flex-shrink-0 w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
          canScrollLeft
            ? 'bg-black/70 hover:bg-black/90 text-white cursor-pointer'
            : 'bg-gray-300/30 text-gray-500 cursor-default opacity-0 pointer-events-none'
        }`}
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Scrollable area */}
      <div
        ref={scrollRef}
        className="flex-1 flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, itemIndex) => (
          <div
            key={item._id}
            className="flex-shrink-0 snap-start"
            style={{ width: cardWidth }}
          >
            <ProductCard
              item={item}
              index={itemIndex}
              onViewDetail={onViewDetail}
            />
          </div>
        ))}
      </div>

      {/* Right arrow — outside */}
      <button
        onClick={() => scroll(1)}
        disabled={!canScrollRight}
        className={`flex-shrink-0 w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
          canScrollRight
            ? 'bg-black/70 hover:bg-black/90 text-white cursor-pointer'
            : 'bg-gray-300/30 text-gray-500 cursor-default opacity-0 pointer-events-none'
        }`}
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
};

const Products = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  
  const { translatedText: titleText } = useAutoTranslate('Tesoro');
  const { translatedText: subtitleText } = useAutoTranslate('Piezas exclusivas diseñadas con cuidado artesanal y atención al detalle');
  const { translatedText: customTitle } = useAutoTranslate('¿Buscas algo personalizado?');
  const { translatedText: customDesc } = useAutoTranslate('Cada pieza puede ser adaptada a tus medidas y preferencias. Contáctame para crear algo único para ti.');
  const { translatedText: customButton } = useAutoTranslate('Solicitar diseño personalizado');
  const { translatedText: loadingText } = useAutoTranslate('Cargando productos...');
  const { translatedText: filterLabel } = useAutoTranslate('Filtrar productos');
  const { translatedText: clearLabel } = useAutoTranslate('Limpiar filtros');
  const { translatedText: allCategories } = useAutoTranslate('Todas las categorías');
  const { translatedText: allCollections } = useAutoTranslate('Todas las colecciones');
  const { translatedText: allSizes } = useAutoTranslate('Todos los talles');
  const { translatedText: allColors } = useAutoTranslate('Todos los colores');
  const { translatedText: noResultsText } = useAutoTranslate('No se encontraron productos con los filtros seleccionados');
  const { translatedText: addedToCartText } = useAutoTranslate('agregado al carrito');
  const { translatedText: sizeLabel } = useAutoTranslate('Talle:');
  const { translatedText: productText } = useAutoTranslate('producto');
  const { translatedText: productsText } = useAutoTranslate('productos');
  
  const [collections, setCollections] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filters, setFilters] = useState({ categoria: '', coleccion: '', talle: '', color: '' });

  useEffect(() => {
    productsApi.getCollections()
      .then(data => setCollections(data))
      .catch(err => console.error('Error cargando productos:', err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Extract all products flat + derive filter options
  const allProducts = useMemo(() => collections.flatMap(c => c.items.map(i => ({ ...i, collectionName: c.name }))), [collections]);
  const filterOptions = useMemo(() => ({
    categorias: [...new Set(allProducts.map(p => p.categoria).filter(Boolean))].sort(),
    colecciones: collections.map(c => c.name),
    talles: [...new Set(allProducts.flatMap(p => p.talles || []))],
    colores: [...new Set(allProducts.flatMap(p => p.colores || []))].sort(),
  }), [allProducts, collections]);

  const hasActiveFilter = Object.values(filters).some(v => v !== '');

  const filteredProducts = useMemo(() => {
    if (!hasActiveFilter) return [];
    return allProducts.filter(p => {
      if (filters.categoria && (p.categoria || '') !== filters.categoria) return false;
      if (filters.coleccion && p.collectionName !== filters.coleccion) return false;
      if (filters.talle && !(p.talles || []).includes(filters.talle)) return false;
      if (filters.color && !(p.colores || []).includes(filters.color)) return false;
      return true;
    });
  }, [allProducts, filters, hasActiveFilter]);

  const clearFilters = () => setFilters({ categoria: '', coleccion: '', talle: '', color: '' });

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

  const addToCart = (item, selectedSize, selectedColor, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(c => 
        c._id === item._id && 
        c.selectedSize === selectedSize && 
        c.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map(c => 
          c._id === item._id && c.selectedSize === selectedSize && c.selectedColor === selectedColor
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      return [...prev, { ...item, quantity, selectedSize, selectedColor }];
    });

    const sizeText = selectedSize ? ` (${selectedSize})` : '';
    const colorText = selectedColor ? ` - ${selectedColor}` : '';
    const qtyText = quantity > 1 ? ` x${quantity}` : '';
    setToastMessage(`${item.name}${sizeText}${colorText}${qtyText} ${addedToCartText}`);
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
          initial={{ opacity: 0, y: 50, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 55, damping: 15 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-neutral-100' : 'text-black'} mb-4`}>{titleText}</h2>
          <p className={`text-lg ${isDark ? 'text-neutral-500' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {subtitleText}
          </p>
        </motion.div>

        {loadingProducts ? (
          <div className={`text-center py-20 ${isDark ? 'text-neutral-500' : 'text-gray-400'}`}>
            <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loadingText}
          </div>
        ) : (
        <>
        {/* Filter bar */}
        <div className={`mb-10 p-4 ${isDark ? 'bg-neutral-900/50 border border-neutral-800' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
              <FiFilter size={16} />
              {filterLabel}
            </span>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-purple-500 hover:text-purple-400"
              >
                <FiX size={14} /> {clearLabel}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.categoria}
              onChange={e => setFilters(f => ({ ...f, categoria: e.target.value }))}
              className={`px-3 py-2 text-sm ${isDark ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="">{allCategories}</option>
              {filterOptions.categorias.map(c => <TranslatedOption key={c} value={c} />)}
            </select>
            <select
              value={filters.coleccion}
              onChange={e => setFilters(f => ({ ...f, coleccion: e.target.value }))}
              className={`px-3 py-2 text-sm ${isDark ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="">{allCollections}</option>
              {filterOptions.colecciones.map(c => <TranslatedOption key={c} value={c} />)}
            </select>
            <select
              value={filters.talle}
              onChange={e => setFilters(f => ({ ...f, talle: e.target.value }))}
              className={`px-3 py-2 text-sm ${isDark ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="">{allSizes}</option>
              {filterOptions.talles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filters.color}
              onChange={e => setFilters(f => ({ ...f, color: e.target.value }))}
              className={`px-3 py-2 text-sm ${isDark ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-white text-gray-800 border-gray-300'} border`}
            >
              <option value="">{allColors}</option>
              {filterOptions.colores.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {hasActiveFilter && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.categoria && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-700/20 text-neutral-200 text-xs win-chip">
                  <TranslatedText text={filters.categoria} />
                  <button onClick={() => setFilters(f => ({ ...f, categoria: '' }))}><FiX size={12} /></button>
                </span>
              )}
              {filters.coleccion && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-700/20 text-neutral-200 text-xs win-chip">
                  <TranslatedText text={filters.coleccion} />
                  <button onClick={() => setFilters(f => ({ ...f, coleccion: '' }))}><FiX size={12} /></button>
                </span>
              )}
              {filters.talle && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-700/20 text-neutral-200 text-xs win-chip">
                  {sizeLabel} {filters.talle}
                  <button onClick={() => setFilters(f => ({ ...f, talle: '' }))}><FiX size={12} /></button>
                </span>
              )}
              {filters.color && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-700/20 text-neutral-200 text-xs win-chip">
                  <TranslatedText text={filters.color} />
                  <button onClick={() => setFilters(f => ({ ...f, color: '' }))}><FiX size={12} /></button>
                </span>
              )}
              <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-gray-400'} self-center`}>
                {filteredProducts.length} {filteredProducts.length !== 1 ? productsText : productText}
              </span>
            </div>
          )}
        </div>

        {/* Filtered grid view */}
        {hasActiveFilter ? (
          filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {filteredProducts.map((item, i) => (
                <ProductCard key={item._id} item={item} index={i} onViewDetail={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 mb-20 ${isDark ? 'text-neutral-500' : 'text-gray-400'}`}>
              {noResultsText}
            </div>
          )
        ) : (
        /* Collection carousels */
        collections.map((collection, colIndex) => (
          <motion.div
            key={colIndex}
            initial={{ opacity: 0, x: colIndex % 2 === 0 ? -60 : 60, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 60, damping: 16 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mb-20"
          >
            <div className="mb-8">
              <h3 className={`text-2xl font-semibold ${isDark ? 'text-neutral-100' : 'text-black'}`}>
                <TranslatedText text={collection.name} />
              </h3>
              <p className={isDark ? 'text-neutral-500' : 'text-gray-600'}>
                <TranslatedText text={collection.description} />
              </p>
            </div>

            <CollectionCarousel
              items={collection.items}
              onViewDetail={setSelectedProduct}
            />
          </motion.div>
        ))
        )}
        </>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          viewport={{ once: true }}
          className={`${isDark ? 'bg-black' : 'bg-white'} p-8 text-center`}
        >
          <h3 className={`text-2xl font-semibold ${isDark ? 'text-neutral-100' : 'text-black'} mb-4`}>{customTitle}</h3>
          <p className={`${isDark ? 'text-neutral-400' : 'text-gray-700'} mb-6 max-w-2xl mx-auto`}>
            {customDesc}
          </p>
          <motion.a
            href={WHATSAPP_URL}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-8 py-2.5 tracking-widest uppercase text-xs border transition-colors duration-300 win-btn ${
              isDark ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
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

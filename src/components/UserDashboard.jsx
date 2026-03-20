import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiLogOut, FiUser, FiChevronDown, FiChevronUp, FiTruck, FiExternalLink } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { userApi } from '../services/userApi';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const STATUS_CONFIG = {
  pending: { icon: FiClock, color: 'text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
  in_process: { icon: FiAlertCircle, color: 'text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
  approved: { icon: FiCheckCircle, color: 'text-neutral-300', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
  rejected: { icon: FiXCircle, color: 'text-neutral-500', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
  refunded: { icon: FiXCircle, color: 'text-neutral-500', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
  shipped: { icon: FiTruck, color: 'text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-900/20' },
};

export default function UserDashboard({ onClose, setCurrentSection }) {
  const { isDark } = useTheme();
  const { user, userToken, logout } = useUserAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const { translatedText: t_myAccount } = useAutoTranslate('Mi cuenta');
  const { translatedText: t_myPurchases } = useAutoTranslate('Mis compras');
  const { translatedText: t_noPurchases } = useAutoTranslate('Aún no tenés compras realizadas');
  const { translatedText: t_exploreProducts } = useAutoTranslate('Explorar productos');
  const { translatedText: t_logout } = useAutoTranslate('Cerrar sesión');
  const { translatedText: t_total } = useAutoTranslate('Total');
  const { translatedText: t_pending } = useAutoTranslate('Pendiente');
  const { translatedText: t_inProcess } = useAutoTranslate('En proceso');
  const { translatedText: t_approved } = useAutoTranslate('Aprobado');
  const { translatedText: t_rejected } = useAutoTranslate('Rechazado');
  const { translatedText: t_refunded } = useAutoTranslate('Reembolsado');
  const { translatedText: t_status } = useAutoTranslate('Estado');
  const { translatedText: t_date } = useAutoTranslate('Fecha');
  const { translatedText: t_details } = useAutoTranslate('Ver detalles');
  const { translatedText: t_loading } = useAutoTranslate('Cargando...');
  const { translatedText: t_shippingTo } = useAutoTranslate('Envío a');
  const { translatedText: t_shipped } = useAutoTranslate('Despachado');
  const { translatedText: t_trackShipment } = useAutoTranslate('Seguir mi envío');

  const STATUS_LABELS = {
    pending: t_pending,
    in_process: t_inProcess,
    approved: t_approved,
    rejected: t_rejected,
    refunded: t_refunded,
    shipped: t_shipped,
  };

  useEffect(() => {
    if (!userToken) return;
    setLoading(true);
    userApi.getMyPurchases(userToken)
      .then(data => setPurchases(data.purchases || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userToken]);

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const bg = isDark ? 'bg-neutral-900' : 'bg-white';
  const text = isDark ? 'text-neutral-100' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-neutral-800' : 'bg-gray-50';
  const borderColor = isDark ? 'border-neutral-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bg} rounded-2xl w-full max-w-lg max-h-[85vh] shadow-2xl overflow-hidden flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 border-b ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-neutral-800' : 'bg-gray-100'} flex items-center justify-center`}>
              <FiUser className={text} size={20} />
            </div>
            <div>
              <h2 className={`font-bold ${text}`}>{t_myAccount}</h2>
              {user && <p className={`text-xs ${subtext}`}>{user.nombre} {user.apellido} — {user.email}</p>}
            </div>
          </div>
          <button onClick={handleLogout} className={`flex items-center gap-1.5 text-sm ${subtext} hover:text-red-500 transition-colors`}>
            <FiLogOut size={16} />
            {t_logout}
          </button>
        </div>

        {/* Purchases */}
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className={`font-semibold ${text} mb-4 flex items-center gap-2`}>
            <FiPackage size={18} />
            {t_myPurchases}
          </h3>

          {loading ? (
            <div className={`text-center py-12 ${subtext}`}>{t_loading}</div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className={`mx-auto mb-3 ${subtext}`} size={40} />
              <p className={subtext}>{t_noPurchases}</p>
              <button
                onClick={() => { onClose?.(); setCurrentSection?.('que-vendo'); }}
                className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t_exploreProducts}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map(purchase => {
                const config = STATUS_CONFIG[purchase.status] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;
                const isExpanded = expandedId === purchase._id;
                const date = new Date(purchase.createdAt).toLocaleDateString('es-AR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                });

                return (
                  <motion.div
                    key={purchase._id}
                    layout
                    className={`${cardBg} rounded-xl overflow-hidden border ${borderColor}`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : purchase._id)}
                      className="w-full p-4 flex items-center gap-3 text-left"
                    >
                      <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={config.color} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${text} truncate`}>
                            {purchase.items?.length === 1
                              ? purchase.items[0].title
                              : `${purchase.items?.length || 0} productos`
                            }
                          </span>
                          <span className={`text-sm font-bold ${text} ml-2`}>
                            ${purchase.total?.toLocaleString('es-AR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${config.color} font-medium`}>
                            {STATUS_LABELS[purchase.status] || purchase.status}
                          </span>
                          <span className={`text-xs ${subtext}`}>·</span>
                          <span className={`text-xs ${subtext}`}>{date}</span>
                        </div>
                      </div>
                      {isExpanded ? <FiChevronUp className={subtext} /> : <FiChevronDown className={subtext} />}
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className={`border-t ${borderColor} px-4 pb-4`}
                      >
                        <div className="pt-3 space-y-2">
                          {purchase.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={subtext}>
                                {item.title} x{item.quantity}
                                {item.talle ? ` · ${item.talle}` : ''}
                                {item.color ? ` · ${item.color}` : ''}
                              </span>
                              <span className={text}>${(item.unit_price * item.quantity).toLocaleString('es-AR')}</span>
                            </div>
                          ))}
                          <div className={`pt-2 border-t ${borderColor} flex justify-between font-semibold text-sm`}>
                            <span className={text}>{t_total}</span>
                            <span className={text}>${purchase.total?.toLocaleString('es-AR')}</span>
                          </div>
                          {(purchase.direccion || purchase.ciudad || purchase.provincia) && (
                            <div className={`text-xs ${subtext} pt-1 space-y-0.5`}>
                              {purchase.direccion && (
                                <p>{t_shippingTo}: {purchase.direccion}{purchase.pisoDepto ? ` (${purchase.pisoDepto})` : ''}</p>
                              )}
                              <p>{purchase.ciudad}, {purchase.provincia} (CP: {purchase.codigoPostal})</p>
                            </div>
                          )}
                          {purchase.status === 'shipped' && purchase.trackingUrl && (
                            <a
                              href={purchase.trackingUrl.startsWith('http') ? purchase.trackingUrl : `https://${purchase.trackingUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-neutral-900/30 text-neutral-300 hover:bg-neutral-900/50' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                            >
                              <FiExternalLink size={14} />
                              {t_trackShipment}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

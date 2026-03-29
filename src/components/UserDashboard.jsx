import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiLogOut, FiUser, FiChevronDown, FiChevronUp, FiTruck, FiExternalLink, FiMapPin, FiSave, FiEdit3 } from 'react-icons/fi';
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
  const { user, userToken, logout, updateUser } = useUserAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('purchases');
  const [profileForm, setProfileForm] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

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
  const { translatedText: t_myProfile } = useAutoTranslate('Mi perfil');
  const { translatedText: t_personalData } = useAutoTranslate('Datos personales');
  const { translatedText: t_shippingAddress } = useAutoTranslate('Dirección de envío');
  const { translatedText: t_name } = useAutoTranslate('Nombre');
  const { translatedText: t_lastName } = useAutoTranslate('Apellido');
  const { translatedText: t_phone } = useAutoTranslate('Teléfono');
  const { translatedText: t_address } = useAutoTranslate('Dirección (calle y número)');
  const { translatedText: t_floor } = useAutoTranslate('Piso / Depto');
  const { translatedText: t_zip } = useAutoTranslate('Código Postal');
  const { translatedText: t_province } = useAutoTranslate('Provincia');
  const { translatedText: t_city } = useAutoTranslate('Ciudad');
  const { translatedText: t_save } = useAutoTranslate('Guardar');
  const { translatedText: t_edit } = useAutoTranslate('Editar');
  const { translatedText: t_cancel } = useAutoTranslate('Cancelar');
  const { translatedText: t_saved } = useAutoTranslate('Datos guardados correctamente');
  const { translatedText: t_savedInfo } = useAutoTranslate('Estos datos se usarán para autocompletar tus próximas compras');
  const { translatedText: t_selectProvince } = useAutoTranslate('Seleccionar provincia');
  const { translatedText: t_selectCity } = useAutoTranslate('Seleccionar ciudad');
  const { translatedText: t_loadingCities } = useAutoTranslate('Cargando ciudades...');

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

  useEffect(() => {
    if (user) {
      setProfileForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        pisoDepto: user.pisoDepto || '',
        codigoPostal: user.codigoPostal || '',
        provincia: user.provincia || '',
        ciudad: user.ciudad || '',
      });
    }
  }, [user]);

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias')
      .then(res => res.json())
      .then(data => setProvincias(data.provincias || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (profileForm.provincia) {
      setLoadingCiudades(true);
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodeURIComponent(profileForm.provincia)}&max=1000`)
        .then(res => res.json())
        .then(data => setCiudades(data.localidades || []))
        .catch(() => {})
        .finally(() => setLoadingCiudades(false));
    } else {
      setCiudades([]);
    }
  }, [profileForm.provincia]);

  const cap = v => v.replace(/\b\w/g, c => c.toUpperCase());
  const capFields = ['nombre', 'apellido', 'direccion', 'pisoDepto'];

  const handleProfileChange = (field, value) => {
    const v = capFields.includes(field) ? cap(value) : value;
    setProfileForm(prev => ({ ...prev, [field]: v }));
    if (field === 'provincia') {
      setProfileForm(prev => ({ ...prev, ciudad: '' }));
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const { user: updated } = await userApi.updateProfile(userToken, profileForm);
      updateUser(updated);
      setEditingProfile(false);
      setProfileMsg('success');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg('error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const bg = isDark ? 'bg-neutral-900' : 'bg-white';
  const text = isDark ? 'text-neutral-100' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-300' : 'text-gray-600';
  const cardBg = isDark ? 'bg-neutral-800' : 'bg-gray-50';
  const borderColor = isDark ? 'border-neutral-700' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bg} w-full max-w-lg md:max-w-xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col mx-2`}
        onClick={e => e.stopPropagation()}
      >
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
            <span className="hidden md:inline">{t_logout}</span>
          </button>
        </div>

        <div className={`flex border-b ${borderColor}`}>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'purchases'
                ? `${text} border-b-2 ${isDark ? 'border-neutral-100' : 'border-black'}`
                : `${subtext} hover:${text}`
            }`}
          >
            <FiPackage size={16} />
            {t_myPurchases}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? `${text} border-b-2 ${isDark ? 'border-neutral-100' : 'border-black'}`
                : `${subtext} hover:${text}`
            }`}
          >
            <FiMapPin size={16} />
            {t_myProfile}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {activeTab === 'purchases' && (
            <>
          {loading ? (
            <div className={`text-center py-12 ${subtext}`}>{t_loading}</div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className={`mx-auto mb-3 ${subtext}`} size={40} />
              <p className={subtext}>{t_noPurchases}</p>
              <button
                onClick={() => { onClose?.(); setCurrentSection?.('que-vendo'); }}
                className={`mt-4 px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
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
                    className={`${cardBg} overflow-hidden border ${borderColor}`}
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

                    <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className={`border-t ${borderColor} overflow-hidden`}
                      >
                        <div className="px-4 pb-4 pt-3 space-y-2">
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
                              className={`mt-2 flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isDark ? 'bg-neutral-900/30 text-neutral-300 hover:bg-neutral-900/50' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                            >
                              <FiExternalLink size={14} />
                              {t_trackShipment}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
            </>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className={`text-xs md:text-sm ${subtext}`}>{t_savedInfo}</p>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className={`flex items-center gap-1.5 text-sm md:text-base ${subtext} hover:${text} transition-colors`}
                  >
                    <FiEdit3 size={14} />
                    {t_edit}
                  </button>
                )}
              </div>

              {profileMsg === 'success' && (
                <div className={`flex items-center gap-2 px-3 py-2 text-sm ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}>
                  <FiCheckCircle size={14} />
                  {t_saved}
                </div>
              )}
              {profileMsg === 'error' && (
                <div className={`flex items-center gap-2 px-3 py-2 text-sm ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
                  <FiXCircle size={14} />
                  Error
                </div>
              )}

              <div>
                <h4 className={`text-xs md:text-sm font-semibold uppercase tracking-wide ${subtext} mb-3`}>{t_personalData}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_name}</label>
                    <input
                      value={profileForm.nombre || ''}
                      onChange={e => handleProfileChange('nombre', e.target.value)}
                      disabled={!editingProfile}
                      className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_lastName}</label>
                    <input
                      value={profileForm.apellido || ''}
                      onChange={e => handleProfileChange('apellido', e.target.value)}
                      disabled={!editingProfile}
                      className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>Email</label>
                    <input
                      value={user?.email || ''}
                      disabled
                      className={`w-full border p-2.5 md:p-3 text-sm md:text-base opacity-50 ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_phone}</label>
                    <input
                      value={profileForm.telefono || ''}
                      onChange={e => handleProfileChange('telefono', e.target.value)}
                      disabled={!editingProfile}
                      placeholder="+54 11 1234-5678"
                      className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-xs md:text-sm font-semibold uppercase tracking-wide ${subtext} mb-3`}>{t_shippingAddress}</h4>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="col-span-2">
                      <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_address}</label>
                      <input
                        value={profileForm.direccion || ''}
                        onChange={e => handleProfileChange('direccion', e.target.value)}
                        disabled={!editingProfile}
                        className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_floor}</label>
                      <input
                        value={profileForm.pisoDepto || ''}
                        onChange={e => handleProfileChange('pisoDepto', e.target.value)}
                        disabled={!editingProfile}
                        className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_zip}</label>
                      <input
                        value={profileForm.codigoPostal || ''}
                        onChange={e => handleProfileChange('codigoPostal', e.target.value)}
                        disabled={!editingProfile}
                        className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_province}</label>
                      <select
                        value={profileForm.provincia || ''}
                        onChange={e => handleProfileChange('provincia', e.target.value)}
                        disabled={!editingProfile}
                        className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                      >
                        <option value="">{t_selectProvince}</option>
                        {provincias.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs md:text-sm ${subtext} mb-1 block`}>{t_city}</label>
                      <select
                        value={profileForm.ciudad || ''}
                        onChange={e => handleProfileChange('ciudad', e.target.value)}
                        disabled={!editingProfile || !profileForm.provincia || loadingCiudades}
                        className={`w-full border p-2.5 md:p-3 text-sm md:text-base ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100' : 'bg-gray-50 border-gray-200 text-gray-900'} ${!editingProfile ? 'opacity-70' : ''}`}
                      >
                        <option value="">{loadingCiudades ? t_loadingCities : t_selectCity}</option>
                        {ciudades.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {editingProfile && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm md:text-base font-medium transition-colors disabled:opacity-50 ${isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
                  >
                    <FiSave size={16} />
                    {savingProfile ? t_loading : t_save}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      if (user) {
                        setProfileForm({
                          nombre: user.nombre || '', apellido: user.apellido || '',
                          telefono: user.telefono || '', direccion: user.direccion || '',
                          pisoDepto: user.pisoDepto || '', codigoPostal: user.codigoPostal || '',
                          provincia: user.provincia || '', ciudad: user.ciudad || '',
                        });
                      }
                    }}
                    className={`px-4 py-2.5 text-sm md:text-base ${subtext} hover:${text} transition-colors`}
                  >
                    {t_cancel}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

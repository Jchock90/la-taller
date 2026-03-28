import { useState, useEffect, Fragment } from 'react';
import { FiTrash2, FiSearch, FiMail, FiUsers, FiRefreshCw, FiChevronDown, FiChevronUp, FiShoppingBag, FiPackage, FiTruck, FiExternalLink, FiSend, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/userApi';
import { adminApi } from '../services/api';

const statusLabels = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  in_process: 'En proceso',
  rejected: 'Rechazado',
  refunded: 'Reembolsado',
  shipped: 'Despachado',
};
const statusColors = {
  approved: 'text-green-400',
  pending: 'text-yellow-400',
  in_process: 'text-blue-400',
  rejected: 'text-red-400',
  refunded: 'text-neutral-400',
  shipped: 'text-cyan-400',
};

export default function UsersPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [profileExpanded, setProfileExpanded] = useState(null);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [sendingTracking, setSendingTracking] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    userApi.getUsers(token)
      .then(data => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleDelete = async (userId) => {
    try {
      await userApi.deleteUser(token, userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTracking = async (purchaseId) => {
    if (!trackingUrl.trim()) return;
    setSendingTracking(true);
    try {
      await adminApi.sendTracking(token, purchaseId, trackingUrl.trim());
      setEditingTracking(null);
      setTrackingUrl('');
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingTracking(false);
    }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.apellido?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <FiUsers size={20} className="text-neutral-400" />
          <h2 className="text-base md:text-lg font-semibold text-white">
            Usuarios ({users.length})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="bg-neutral-800 text-neutral-200 text-sm pl-9 pr-3 py-2 rounded-lg border border-neutral-700 w-full md:w-64 focus:outline-none focus:border-neutral-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="text-neutral-400 hover:text-neutral-200 transition-colors flex-shrink-0"
            title="Recargar"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-neutral-500 text-center py-12">Cargando usuarios...</div>
      ) : filtered.length === 0 ? (
        <div className="text-neutral-500 text-center py-12">
          {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
        </div>
      ) : (
        <>
        <div className="md:hidden space-y-3">
          {filtered.map(user => {
            const stats = user.purchaseStats || { totalPurchases: 0, totalSpent: 0 };
            const isExpanded = expanded === user._id;
            return (
              <div key={user._id} className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-neutral-200 font-medium text-sm truncate">{user.nombre} {user.apellido}</p>
                    <p className="text-neutral-500 text-xs flex items-center gap-1 truncate"><FiMail size={11} /> {user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.googleId ? (
                      <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded-full">Google</span>
                    ) : (
                      <span className="text-[10px] bg-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded-full">Email</span>
                    )}
                    {user.emailVerified ? (
                      <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full">Verificado</span>
                    ) : (
                      <span className="text-[10px] bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 rounded-full">No verif.</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProfileExpanded(profileExpanded === user._id ? null : user._id)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                        profileExpanded === user._id
                          ? 'bg-violet-900/50 text-violet-300'
                          : 'bg-violet-900/20 text-violet-400 hover:bg-violet-900/40'
                      }`}
                    >
                      <FiUser size={11} /> Datos
                    </button>
                    {stats.totalPurchases > 0 ? (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : user._id)}
                        className="inline-flex items-center gap-1.5 text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-full hover:bg-emerald-900/50 transition-colors"
                      >
                        <FiShoppingBag size={11} />
                        {stats.totalPurchases} · ${stats.totalSpent.toLocaleString('es-AR')}
                        {isExpanded ? <FiChevronUp size={11} /> : <FiChevronDown size={11} />}
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-600">Sin compras</span>
                    )}
                    <span className="text-xs text-neutral-600">
                      {new Date(user.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  {confirmDelete === user._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">¿Eliminar?</span>
                      <button onClick={() => handleDelete(user._id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Sí</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(user._id)} className="text-neutral-500 hover:text-red-400 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
                {profileExpanded === user._id && (
                  <div className="mt-3 pt-3 border-t border-neutral-800">
                    <p className="text-neutral-500 uppercase font-semibold text-[10px] mb-2">Datos personales</p>
                    <div className="bg-neutral-800/40 rounded-lg p-3 space-y-1.5 text-xs text-neutral-400">
                      {user.telefono ? (
                        <p className="flex items-center gap-1.5"><FiPhone size={11} className="text-neutral-600" /> {user.telefono}</p>
                      ) : (
                        <p className="flex items-center gap-1.5"><FiPhone size={11} className="text-neutral-700" /> <span className="text-neutral-600 italic">Sin teléfono</span></p>
                      )}
                      {user.direccion ? (
                        <p className="flex items-start gap-1.5"><FiMapPin size={11} className="text-neutral-600 mt-0.5 shrink-0" /> {user.direccion}{user.pisoDepto ? ` (${user.pisoDepto})` : ''}</p>
                      ) : (
                        <p className="flex items-center gap-1.5"><FiMapPin size={11} className="text-neutral-700" /> <span className="text-neutral-600 italic">Sin dirección</span></p>
                      )}
                      {(user.ciudad || user.provincia) ? (
                        <p className="pl-5">{[user.ciudad, user.provincia].filter(Boolean).join(', ')}{user.codigoPostal ? ` (CP: ${user.codigoPostal})` : ''}</p>
                      ) : (
                        <p className="pl-5 text-neutral-600 italic">Sin ubicación</p>
                      )}
                    </div>
                  </div>
                )}
                {isExpanded && user.purchases?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 space-y-3 max-h-80 overflow-y-auto">
                    {user.purchases.map(p => (
                      <div key={p._id} className="bg-neutral-800/40 rounded-lg p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] text-neutral-500 font-mono truncate">{p.orderId}</span>
                          <span className={`text-xs font-medium ${statusColors[p.status] || 'text-neutral-400'}`}>
                            {statusLabels[p.status] || p.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-neutral-400 space-y-0.5">
                            <p><span className="text-neutral-600">Dir:</span> {p.direccion}{p.pisoDepto ? ` (${p.pisoDepto})` : ''}, {p.ciudad}, {p.provincia}</p>
                          </div>
                          <div className="space-y-0.5">
                            {p.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-neutral-400 truncate">
                                  {item.quantity}× {item.title}
                                  {item.talle ? ` (${item.talle})` : ''}
                                  {item.color ? ` - ${item.color}` : ''}
                                </span>
                                <span className="text-neutral-500 flex-shrink-0 ml-2">${(item.unit_price * item.quantity)?.toLocaleString('es-AR')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-700">
                          <span className="text-[10px] text-neutral-600">
                            {new Date(p.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="text-sm font-semibold text-neutral-300">${p.total?.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="mt-2">
                          {p.status === 'shipped' && p.trackingUrl ? (
                            <div className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-800/30 rounded p-2">
                              <FiTruck className="text-cyan-400 shrink-0" size={12} />
                              <a href={p.trackingUrl.startsWith('http') ? p.trackingUrl : `https://${p.trackingUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-100 underline flex items-center gap-1 truncate">
                                <FiExternalLink size={10} /> Ver seguimiento
                              </a>
                            </div>
                          ) : editingTracking === p._id ? (
                            <div className="flex gap-2">
                              <input type="url" className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="URL de seguimiento..." />
                              <button onClick={() => handleSendTracking(p._id)} disabled={sendingTracking || !trackingUrl.trim()} className="bg-cyan-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"><FiSend size={10} /></button>
                              <button onClick={() => { setEditingTracking(null); setTrackingUrl(''); }} className="bg-neutral-700 text-neutral-300 px-2 py-1 rounded text-xs">✕</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingTracking(p._id); setTrackingUrl(p.trackingUrl || ''); }} className="text-xs text-neutral-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                              <FiTruck size={11} /> {p.status === 'approved' ? 'Enviar seguimiento' : 'Agregar seguimiento'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden md:block bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-800/50 text-neutral-400 text-xs uppercase">
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-center px-4 py-3">Método</th>
                <th className="text-center px-4 py-3">Verificado</th>
                <th className="text-center px-4 py-3">Compras</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filtered.map(user => {
                const stats = user.purchaseStats || { totalPurchases: 0, totalSpent: 0 };
                const isExpanded = expanded === user._id;
                return (
                  <Fragment key={user._id}>
                    <tr className="hover:bg-neutral-800/30">
                      <td className="px-4 py-3">
                        <span className="text-neutral-200 font-medium">{user.nombre} {user.apellido}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-neutral-400 flex items-center gap-1.5">
                          <FiMail size={13} />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.googleId ? (
                          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full">Google</span>
                        ) : (
                          <span className="text-xs bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">Email</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.emailVerified ? (
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">Sí</span>
                        ) : (
                          <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {stats.totalPurchases > 0 ? (
                          <button
                            onClick={() => setExpanded(isExpanded ? null : user._id)}
                            className="inline-flex items-center gap-1.5 text-xs bg-emerald-900/30 text-emerald-400 px-2.5 py-1 rounded-full hover:bg-emerald-900/50 transition-colors"
                          >
                            <FiShoppingBag size={12} />
                            {stats.totalPurchases} · ${stats.totalSpent.toLocaleString('es-AR')}
                            {isExpanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-600">Sin compras</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setProfileExpanded(profileExpanded === user._id ? null : user._id)}
                            className={`p-1.5 rounded transition-colors ${profileExpanded === user._id ? 'bg-violet-900/50 text-violet-300' : 'text-neutral-500 hover:text-violet-400'}`}
                            title="Ver datos personales"
                          >
                            <FiUser size={14} />
                          </button>
                          {confirmDelete === user._id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-400">¿Eliminar?</span>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded hover:bg-neutral-600"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(user._id)}
                              className="text-neutral-500 hover:text-red-400 transition-colors"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {profileExpanded === user._id && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-violet-950/20 border-l-2 border-violet-800/50">
                          <p className="text-neutral-500 uppercase font-semibold text-[10px] mb-2">Datos personales</p>
                          <div className="grid grid-cols-3 gap-4 text-xs text-neutral-400">
                            <div className="space-y-1">
                              <p className="text-neutral-600 text-[10px] uppercase font-medium">Teléfono</p>
                              {user.telefono ? (
                                <p className="flex items-center gap-1.5"><FiPhone size={12} className="text-neutral-600" /> {user.telefono}</p>
                              ) : (
                                <p className="text-neutral-600 italic">No registrado</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-neutral-600 text-[10px] uppercase font-medium">Dirección</p>
                              {user.direccion ? (
                                <p className="flex items-start gap-1.5"><FiMapPin size={12} className="text-neutral-600 mt-0.5 shrink-0" /> {user.direccion}{user.pisoDepto ? ` (${user.pisoDepto})` : ''}</p>
                              ) : (
                                <p className="text-neutral-600 italic">No registrada</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-neutral-600 text-[10px] uppercase font-medium">Ubicación</p>
                              {(user.ciudad || user.provincia) ? (
                                <p>{[user.ciudad, user.provincia].filter(Boolean).join(', ')}{user.codigoPostal ? ` (CP: ${user.codigoPostal})` : ''}</p>
                              ) : (
                                <p className="text-neutral-600 italic">No registrada</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {isExpanded && user.purchases?.length > 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-neutral-800/40">
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {user.purchases.map(p => (
                              <div key={p._id} className="bg-neutral-900/60 rounded-lg p-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-xs text-neutral-400 font-mono truncate">{p.orderId}</span>
                                  <span className={`text-xs font-medium ${statusColors[p.status] || 'text-neutral-400'}`}>
                                    {statusLabels[p.status] || p.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="text-xs text-neutral-400 space-y-0.5">
                                    <p className="text-neutral-500 uppercase font-semibold text-[10px] mb-1">Datos de envío</p>
                                    <p><span className="text-neutral-600">Nombre:</span> {p.nombre} {p.apellido}</p>
                                    <p><span className="text-neutral-600">Email:</span> {p.email}</p>
                                    <p><span className="text-neutral-600">Teléfono:</span> {p.telefono}</p>
                                    {p.direccion && <p><span className="text-neutral-600">Dirección:</span> {p.direccion}{p.pisoDepto ? ` (${p.pisoDepto})` : ''}</p>}
                                    <p><span className="text-neutral-600">Ubicación:</span> {p.ciudad}, {p.provincia} (CP: {p.codigoPostal})</p>
                                  </div>
                                  <div>
                                    <p className="text-neutral-500 uppercase font-semibold text-[10px] mb-1">Productos</p>
                                    <div className="space-y-0.5">
                                      {p.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                          <span className="text-neutral-400">
                                            {item.quantity}× {item.title}
                                            {item.talle ? ` (${item.talle})` : ''}
                                            {item.color ? ` - ${item.color}` : ''}
                                          </span>
                                          <span className="text-neutral-500">${(item.unit_price * item.quantity)?.toLocaleString('es-AR')}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
                                  <span className="text-xs text-neutral-600">
                                    {new Date(p.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-sm font-semibold text-neutral-300">${p.total?.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="mt-2">
                                  {p.status === 'shipped' && p.trackingUrl ? (
                                    <div className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-800/30 rounded p-2">
                                      <FiTruck className="text-cyan-400 shrink-0" size={13} />
                                      <a href={p.trackingUrl.startsWith('http') ? p.trackingUrl : `https://${p.trackingUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-100 underline flex items-center gap-1 truncate">
                                        <FiExternalLink size={10} />
                                        Ver seguimiento
                                      </a>
                                      {p.shippedAt && <span className="text-[10px] text-neutral-600 ml-auto">Despachado {new Date(p.shippedAt).toLocaleDateString('es-AR')}</span>}
                                    </div>
                                  ) : editingTracking === p._id ? (
                                    <div className="flex gap-2">
                                      <input
                                        type="url"
                                        className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
                                        value={trackingUrl}
                                        onChange={e => setTrackingUrl(e.target.value)}
                                        placeholder="https://tracking.correoargentino.com.ar/..."
                                      />
                                      <button
                                        onClick={() => handleSendTracking(p._id)}
                                        disabled={sendingTracking || !trackingUrl.trim()}
                                        className="bg-cyan-600 text-white px-2.5 py-1 rounded text-xs hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-1"
                                      >
                                        <FiSend size={10} />
                                        {sendingTracking ? 'Enviando...' : 'Enviar'}
                                      </button>
                                      <button
                                        onClick={() => { setEditingTracking(null); setTrackingUrl(''); }}
                                        className="bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded text-xs hover:bg-neutral-600"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setEditingTracking(p._id); setTrackingUrl(p.trackingUrl || ''); }}
                                      className="text-xs text-neutral-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                                    >
                                      <FiTruck size={12} />
                                      {p.status === 'approved' ? 'Enviar link de seguimiento y despachar' : 'Agregar seguimiento'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

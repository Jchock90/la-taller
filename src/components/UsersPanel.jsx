import { useState, useEffect, Fragment } from 'react';
import { FiTrash2, FiSearch, FiMail, FiCheckCircle, FiXCircle, FiUsers, FiRefreshCw, FiChevronDown, FiChevronUp, FiShoppingBag, FiPackage, FiTruck, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/userApi';

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
  refunded: 'text-purple-400',
  shipped: 'text-cyan-400',
};

export default function UsersPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expanded, setExpanded] = useState(null);

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
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiUsers size={20} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-white">
            Usuarios registrados ({users.length})
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="bg-gray-800 text-gray-200 text-sm pl-9 pr-3 py-2 rounded-lg border border-gray-700 w-64 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            title="Recargar"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Cargando usuarios...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-center px-4 py-3">Verificado</th>
                <th className="text-center px-4 py-3">Método</th>
                <th className="text-center px-4 py-3">Compras</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(user => {
                const stats = user.purchaseStats || { totalPurchases: 0, totalSpent: 0 };
                const isExpanded = expanded === user._id;
                return (
                  <Fragment key={user._id}>
                    <tr className="hover:bg-gray-800/30">
                      <td className="px-4 py-3">
                        <span className="text-gray-200 font-medium">{user.nombre} {user.apellido}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <FiMail size={13} />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.emailVerified ? (
                          <FiCheckCircle className="inline text-green-500" size={16} />
                        ) : (
                          <FiXCircle className="inline text-red-400" size={16} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.googleId ? (
                          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full">Google</span>
                        ) : (
                          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Email</span>
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
                          <span className="text-xs text-gray-600">Sin compras</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {confirmDelete === user._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-400">¿Eliminar?</span>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(user._id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                    {/* Expanded purchases row */}
                    {isExpanded && user.purchases?.length > 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-gray-800/40">
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {user.purchases.map(p => (
                              <div key={p._id} className="bg-gray-900/60 rounded-lg p-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-xs text-gray-400 font-mono truncate">{p.orderId}</span>
                                  <span className={`text-xs font-medium ${statusColors[p.status] || 'text-gray-400'}`}>
                                    {statusLabels[p.status] || p.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Buyer & Shipping info */}
                                  <div className="text-xs text-gray-400 space-y-0.5">
                                    <p className="text-gray-500 uppercase font-semibold text-[10px] mb-1">Datos de envío</p>
                                    <p><span className="text-gray-600">Nombre:</span> {p.nombre} {p.apellido}</p>
                                    <p><span className="text-gray-600">Email:</span> {p.email}</p>
                                    <p><span className="text-gray-600">Teléfono:</span> {p.telefono}</p>
                                    {p.direccion && <p><span className="text-gray-600">Dirección:</span> {p.direccion}{p.pisoDepto ? ` (${p.pisoDepto})` : ''}</p>}
                                    <p><span className="text-gray-600">Ubicación:</span> {p.ciudad}, {p.provincia} (CP: {p.codigoPostal})</p>
                                  </div>
                                  {/* Products */}
                                  <div>
                                    <p className="text-gray-500 uppercase font-semibold text-[10px] mb-1">Productos</p>
                                    <div className="space-y-0.5">
                                      {p.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                          <span className="text-gray-400">
                                            {item.quantity}× {item.title}
                                            {item.talle ? ` (${item.talle})` : ''}
                                            {item.color ? ` - ${item.color}` : ''}
                                          </span>
                                          <span className="text-gray-500">${(item.unit_price * item.quantity)?.toLocaleString('es-AR')}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                                  <span className="text-xs text-gray-600">
                                    {new Date(p.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-sm font-semibold text-gray-300">${p.total?.toLocaleString('es-AR')}</span>
                                </div>
                                {p.status === 'shipped' && p.trackingUrl && (
                                  <div className="flex items-center gap-2 mt-2 bg-cyan-900/20 border border-cyan-800/30 rounded p-2">
                                    <FiTruck className="text-cyan-400 shrink-0" size={13} />
                                    <a href={p.trackingUrl.startsWith('http') ? p.trackingUrl : `https://${p.trackingUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-100 underline flex items-center gap-1 truncate">
                                      <FiExternalLink size={10} />
                                      Ver seguimiento
                                    </a>
                                    {p.shippedAt && <span className="text-[10px] text-gray-600 ml-auto">Despachado {new Date(p.shippedAt).toLocaleDateString('es-AR')}</span>}
                                  </div>
                                )}
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
      )}
    </div>
  );
}

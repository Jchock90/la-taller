import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight, FiMessageSquare, FiX, FiTrendingUp, FiDollarSign, FiShoppingBag, FiBarChart2, FiTrash2 } from 'react-icons/fi';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_process: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  refunded: 'Reembolsada',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-900/50 text-yellow-400',
  in_process: 'bg-blue-900/50 text-blue-400',
  approved: 'bg-green-900/50 text-green-400',
  rejected: 'bg-red-900/50 text-red-400',
  refunded: 'bg-orange-900/50 text-orange-400',
};

const SalesPanel = () => {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedSale, setExpandedSale] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'stats'
  const [confirmModal, setConfirmModal] = useState(null);

  const fetchSales = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 15 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;

      const data = await adminApi.getSales(token, params);
      setSales(data.sales);
      setTotalPages(data.pages);
      setTotalCount(data.total);
      setPage(data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = {};
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const data = await adminApi.getSalesStats(token, params);
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSales(1);
    fetchStats();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchSales(1);
    fetchStats();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
    setTimeout(() => { fetchSales(1); fetchStats(); }, 0);
  };

  const handleStatusChange = async (sale, newStatus) => {
    try {
      await adminApi.updateSaleStatus(token, sale._id, newStatus);
      fetchSales();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotes) return;
    try {
      await adminApi.updateSaleNotes(token, editingNotes, notesText);
      setEditingNotes(null);
      fetchSales();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSale = (sale) => {
    setConfirmModal({
      title: 'Eliminar venta',
      message: `¿Eliminar la venta de ${sale.nombre} ${sale.apellido} por ${formatMoney(sale.total)}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await adminApi.deleteSale(token, sale._id);
          fetchSales();
          fetchStats();
        } catch (err) {
          setError(err.message);
        }
      },
    });
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatMoney = (n) => `$${Number(n).toLocaleString('es-AR')}`;

  const inputClass = 'bg-gray-800 border border-gray-700 text-gray-100 rounded px-3 py-2 focus:outline-none focus:border-purple-500 text-sm';

  return (
    <div>
      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-2">{confirmModal.title}</h3>
            <p className="text-gray-400 text-sm mb-6">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-600 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded font-medium transition-colors text-sm text-white ${confirmModal.confirmColor}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <FiShoppingBag size={14} /> VENTAS TOTALES
            </div>
            <p className="text-2xl font-bold text-gray-100">{stats.totalSales}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <FiDollarSign size={14} /> INGRESOS
            </div>
            <p className="text-2xl font-bold text-green-400">{formatMoney(stats.totalRevenue)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <FiTrendingUp size={14} /> TICKET PROMEDIO
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {stats.totalSales > 0 ? formatMoney(Math.round(stats.totalRevenue / stats.totalSales)) : '$0'}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <FiBarChart2 size={14} /> TOP PRODUCTO
            </div>
            <p className="text-sm font-semibold text-gray-100 truncate">
              {stats.topProducts?.[0]?._id || '—'}
            </p>
            <p className="text-xs text-gray-500">{stats.topProducts?.[0]?.qty || 0} vendidos</p>
          </div>
        </div>
      )}

      {/* View Toggle + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Ventas
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'stats' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Estadísticas
          </button>
        </div>

        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" size={14} />
            <input
              className={`${inputClass} pl-9 w-full`}
              placeholder="Buscar por nombre, email, orden..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select className={inputClass} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_process">En revisión</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="refunded">Reembolsadas</option>
          </select>
          <input type="date" className={inputClass} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <input type="date" className={inputClass} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button onClick={handleSearch} className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
            Filtrar
          </button>
          <button onClick={handleClearFilters} className="bg-gray-800 text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-700">
            Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-300 text-sm px-4 py-3 rounded mb-4 flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-200"><FiX size={16} /></button>
        </div>
      )}

      {/* Stats View */}
      {view === 'stats' && stats && (
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-gray-100 mb-4">Productos más vendidos</h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay datos aún</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => {
                  const maxQty = stats.topProducts[0].qty;
                  return (
                    <div key={p._id} className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-6 text-right">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-200 text-sm truncate">{p._id}</span>
                          <span className="text-gray-400 text-xs ml-2">{p.qty} uds · {formatMoney(p.revenue)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sales by Month */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold text-gray-100 mb-4">Ventas por mes</h3>
            {stats.salesByMonth.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay datos aún</p>
            ) : (
              <div className="space-y-2">
                {stats.salesByMonth.map(m => {
                  const maxRev = Math.max(...stats.salesByMonth.map(s => s.revenue));
                  return (
                    <div key={m._id} className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-20">{m._id}</span>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-800 rounded overflow-hidden relative">
                          <div className="h-full bg-green-600/60 rounded" style={{ width: `${(m.revenue / maxRev) * 100}%` }} />
                          <span className="absolute inset-0 flex items-center px-2 text-xs text-gray-200">
                            {m.count} ventas · {formatMoney(m.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sales List View */}
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-sm">{totalCount} ventas encontradas</p>
            <button onClick={() => fetchSales()} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-700 flex items-center gap-1">
              <FiRefreshCw size={12} /> Recargar
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">Cargando ventas...</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No hay ventas registradas.</div>
          ) : (
            <div className="space-y-2">
              {sales.map(sale => (
                <div key={sale._id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                  {/* Sale Row */}
                  <div
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => setExpandedSale(expandedSale === sale._id ? null : sale._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-100">{sale.nombre} {sale.apellido}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[sale.status]}`}>
                          {STATUS_LABELS[sale.status]}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>{sale.email}</span>
                        <span>{formatDate(sale.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-400">{formatMoney(sale.total)}</p>
                      <p className="text-xs text-gray-500">{sale.items.length} producto{sale.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedSale === sale._id && (
                    <div className="border-t border-gray-800 p-4 bg-gray-950/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-xs text-gray-500 uppercase mb-2">Datos del comprador</h4>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><span className="text-gray-500">Nombre:</span> {sale.nombre} {sale.apellido}</p>
                            <p><span className="text-gray-500">Email:</span> {sale.email}</p>
                            <p><span className="text-gray-500">Teléfono:</span> {sale.telefono}</p>
                            <p><span className="text-gray-500">Ubicación:</span> {sale.ciudad}, {sale.provincia} (CP: {sale.codigoPostal})</p>
                            <p><span className="text-gray-500">Orden:</span> <span className="font-mono text-xs">{sale.orderId}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs text-gray-500 uppercase mb-2">Productos</h4>
                          <div className="space-y-1">
                            {sale.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-300">
                                  {item.title} x{item.quantity}
                                  {item.talle && ` · ${item.talle}`}
                                  {item.color && ` · ${item.color}`}
                                </span>
                                <span className="text-gray-400">{formatMoney(item.unit_price * item.quantity)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-semibold border-t border-gray-800 pt-1 mt-1">
                              <span className="text-gray-200">Total</span>
                              <span className="text-green-400">{formatMoney(sale.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-4">
                        <h4 className="text-xs text-gray-500 uppercase mb-2">Notas internas</h4>
                        {editingNotes === sale._id ? (
                          <div className="flex gap-2">
                            <textarea
                              className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 rounded px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:border-purple-500"
                              value={notesText}
                              onChange={e => setNotesText(e.target.value)}
                              placeholder="Agregar notas sobre esta venta..."
                            />
                            <div className="flex flex-col gap-1">
                              <button onClick={handleSaveNotes} className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700">Guardar</button>
                              <button onClick={() => setEditingNotes(null)} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-600">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-sm text-gray-400 cursor-pointer hover:text-gray-200 flex items-center gap-1"
                            onClick={() => { setEditingNotes(sale._id); setNotesText(sale.notes || ''); }}
                          >
                            <FiMessageSquare size={12} />
                            {sale.notes || 'Click para agregar notas...'}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {sale.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(sale, 'refunded')}
                            className="bg-orange-900/30 text-orange-400 px-3 py-1.5 rounded text-xs hover:bg-orange-900/50"
                          >
                            Marcar reembolsada
                          </button>
                        )}
                        {sale.status === 'refunded' && (
                          <button
                            onClick={() => handleStatusChange(sale, 'approved')}
                            className="bg-green-900/30 text-green-400 px-3 py-1.5 rounded text-xs hover:bg-green-900/50"
                          >
                            Volver a aprobada
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSale(sale)}
                          className="ml-auto bg-red-900/30 text-red-400 px-3 py-1.5 rounded text-xs hover:bg-red-900/50 flex items-center gap-1"
                        >
                          <FiTrash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                onClick={() => { setPage(p => p - 1); fetchSales(page - 1); }}
                disabled={page <= 1}
                className="bg-gray-800 text-gray-300 p-2 rounded hover:bg-gray-700 disabled:opacity-30"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-gray-400 text-sm">Página {page} de {totalPages}</span>
              <button
                onClick={() => { setPage(p => p + 1); fetchSales(page + 1); }}
                disabled={page >= totalPages}
                className="bg-gray-800 text-gray-300 p-2 rounded hover:bg-gray-700 disabled:opacity-30"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesPanel;

import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight, FiMessageSquare, FiX, FiTrendingUp, FiDollarSign, FiShoppingBag, FiBarChart2, FiTrash2, FiTruck, FiSend, FiExternalLink } from 'react-icons/fi';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_process: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  refunded: 'Reembolsada',
  shipped: 'Despachada',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-900/50 text-yellow-400',
  in_process: 'bg-blue-900/50 text-blue-400',
  approved: 'bg-green-900/50 text-green-400',
  rejected: 'bg-red-900/50 text-red-400',
  refunded: 'bg-orange-900/50 text-orange-400',
  shipped: 'bg-cyan-900/50 text-cyan-400',
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
  const [view, setView] = useState('list');
  const [confirmModal, setConfirmModal] = useState(null);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [sendingTracking, setSendingTracking] = useState(false);

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

  const handleSendTracking = async (saleId) => {
    if (!trackingUrl.trim()) return;
    setSendingTracking(true);
    try {
      await adminApi.sendTracking(token, saleId, trackingUrl.trim());
      setEditingTracking(null);
      setTrackingUrl('');
      fetchSales();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingTracking(false);
    }
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatMoney = (n) => `$${Number(n).toLocaleString('es-AR')}`;

  const inputClass = 'bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-2 focus:outline-none focus:border-neutral-500 text-sm';

  return (
    <div>
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-xl p-5 md:p-6 w-full max-w-sm shadow-2xl border border-neutral-700">
            <h3 className="text-white text-lg font-semibold mb-2">{confirmModal.title}</h3>
            <p className="text-neutral-400 text-sm mb-6">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="bg-neutral-700 text-neutral-300 px-4 py-2 rounded font-medium hover:bg-neutral-600 transition-colors text-sm"
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
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] md:text-xs mb-1">
              <FiShoppingBag size={14} /> VENTAS TOTALES
            </div>
            <p className="text-xl md:text-2xl font-bold text-neutral-100">{stats.totalSales}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] md:text-xs mb-1">
              <FiDollarSign size={14} /> INGRESOS
            </div>
            <p className="text-xl md:text-2xl font-bold text-green-400">{formatMoney(stats.totalRevenue)}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] md:text-xs mb-1">
              <FiTrendingUp size={14} /> TICKET PROMEDIO
            </div>
            <p className="text-xl md:text-2xl font-bold text-neutral-400">
              {stats.totalSales > 0 ? formatMoney(Math.round(stats.totalRevenue / stats.totalSales)) : '$0'}
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] md:text-xs mb-1">
              <FiBarChart2 size={14} /> TOP PRODUCTO
            </div>
            <p className="text-sm font-semibold text-neutral-100 truncate">
              {stats.topProducts?.[0]?._id || '—'}
            </p>
            <p className="text-xs text-neutral-500">{stats.topProducts?.[0]?.qty || 0} vendidos</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'list' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Ventas
            </button>
            <button
              onClick={() => setView('stats')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${view === 'stats' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Estadísticas
            </button>
          </div>
          <div className="relative flex-1 min-w-0">
            <FiSearch className="absolute left-3 top-2.5 text-neutral-500" size={14} />
            <input
              className={`${inputClass} pl-9 w-full`}
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className={`${inputClass} flex-1 min-w-[120px]`} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_process">En revisión</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="refunded">Reembolsadas</option>
          </select>
          <input type="date" className={`${inputClass} flex-1 min-w-[120px]`} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <input type="date" className={`${inputClass} flex-1 min-w-[120px]`} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          <button onClick={handleSearch} className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded text-sm hover:bg-neutral-300">
            Filtrar
          </button>
          <button onClick={handleClearFilters} className="bg-neutral-800 text-neutral-300 px-3 py-2 rounded text-sm hover:bg-neutral-700">
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

      {view === 'stats' && stats && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="font-semibold text-neutral-100 mb-4">Productos más vendidos</h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-neutral-500 text-sm">No hay datos aún</p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => {
                  const maxQty = stats.topProducts[0].qty;
                  return (
                    <div key={p._id} className="flex items-center gap-3">
                      <span className="text-neutral-500 text-sm w-6 text-right">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-neutral-200 text-sm truncate">{p._id}</span>
                          <span className="text-neutral-400 text-xs ml-2">{p.qty} uds · {formatMoney(p.revenue)}</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-200 rounded-full" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="font-semibold text-neutral-100 mb-4">Ventas por mes</h3>
            {stats.salesByMonth.length === 0 ? (
              <p className="text-neutral-500 text-sm">No hay datos aún</p>
            ) : (
              <div className="space-y-2">
                {stats.salesByMonth.map(m => {
                  const maxRev = Math.max(...stats.salesByMonth.map(s => s.revenue));
                  return (
                    <div key={m._id} className="flex items-center gap-3">
                      <span className="text-neutral-400 text-sm w-20">{m._id}</span>
                      <div className="flex-1">
                        <div className="h-6 bg-neutral-800 rounded overflow-hidden relative">
                          <div className="h-full bg-green-600/60 rounded" style={{ width: `${(m.revenue / maxRev) * 100}%` }} />
                          <span className="absolute inset-0 flex items-center px-2 text-xs text-neutral-200">
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

      {view === 'list' && (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-neutral-400 text-sm">{totalCount} ventas encontradas</p>
            <button onClick={() => fetchSales()} className="bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded text-sm hover:bg-neutral-700 flex items-center gap-1">
              <FiRefreshCw size={12} /> Recargar
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-neutral-500">Cargando ventas...</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">No hay ventas registradas.</div>
          ) : (
            <div className="space-y-2">
              {sales.map(sale => (
                <div key={sale._id} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  <div
                    className="p-3 md:p-4 flex items-center gap-3 md:gap-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => setExpandedSale(expandedSale === sale._id ? null : sale._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-neutral-100 text-sm md:text-base">{sale.nombre} {sale.apellido}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[sale.status]}`}>
                          {STATUS_LABELS[sale.status]}
                        </span>
                        {sale.trackingUrl && <FiTruck className="text-cyan-400" size={14} title="Despachado con seguimiento" />}
                      </div>
                      <div className="flex gap-2 md:gap-4 text-xs text-neutral-500 flex-wrap">
                        <span className="truncate">{sale.email}</span>
                        <span className="flex-shrink-0">{formatDate(sale.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-400">{formatMoney(sale.total)}</p>
                      <p className="text-xs text-neutral-500">{sale.items.length} producto{sale.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {expandedSale === sale._id && (
                    <div className="border-t border-neutral-800 p-3 md:p-4 bg-neutral-950/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-xs text-neutral-500 uppercase mb-2">Datos del comprador</h4>
                          <div className="text-sm text-neutral-300 space-y-1">
                            <p><span className="text-neutral-500">Nombre:</span> {sale.nombre} {sale.apellido}</p>
                            <p><span className="text-neutral-500">Email:</span> {sale.email}</p>
                            <p><span className="text-neutral-500">Teléfono:</span> {sale.telefono}</p>
                            <p><span className="text-neutral-500">Dirección:</span> {sale.direccion || '—'}{sale.pisoDepto ? ` (${sale.pisoDepto})` : ''}</p>
                            <p><span className="text-neutral-500">Ubicación:</span> {sale.ciudad}, {sale.provincia} (CP: {sale.codigoPostal})</p>
                            <p><span className="text-neutral-500">Orden:</span> <span className="font-mono text-xs">{sale.orderId}</span></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs text-neutral-500 uppercase mb-2">Productos</h4>
                          <div className="space-y-1">
                            {sale.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-neutral-300">
                                  {item.title} x{item.quantity}
                                  {item.talle && ` · ${item.talle}`}
                                  {item.color && ` · ${item.color}`}
                                </span>
                                <span className="text-neutral-400">{formatMoney(item.unit_price * item.quantity)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-semibold border-t border-neutral-800 pt-1 mt-1">
                              <span className="text-neutral-200">Total</span>
                              <span className="text-green-400">{formatMoney(sale.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xs text-neutral-500 uppercase mb-2">Notas internas</h4>
                        {editingNotes === sale._id ? (
                          <div className="flex gap-2">
                            <textarea
                              className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:border-neutral-500"
                              value={notesText}
                              onChange={e => setNotesText(e.target.value)}
                              placeholder="Agregar notas sobre esta venta..."
                            />
                            <div className="flex flex-col gap-1">
                              <button onClick={handleSaveNotes} className="bg-neutral-100 text-neutral-900 px-3 py-1 rounded text-xs hover:bg-neutral-300">Guardar</button>
                              <button onClick={() => setEditingNotes(null)} className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded text-xs hover:bg-neutral-600">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-200 flex items-center gap-1"
                            onClick={() => { setEditingNotes(sale._id); setNotesText(sale.notes || ''); }}
                          >
                            <FiMessageSquare size={12} />
                            {sale.notes || 'Click para agregar notas...'}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xs text-neutral-500 uppercase mb-2">Seguimiento de envío</h4>
                        {sale.status === 'shipped' && sale.trackingUrl ? (
                          <div className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-3">
                            <FiTruck className="text-cyan-400 shrink-0" size={16} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-cyan-400 font-medium">Despachado {sale.shippedAt ? `el ${new Date(sale.shippedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}</p>
                              <a href={sale.trackingUrl.startsWith('http') ? sale.trackingUrl : `https://${sale.trackingUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-300 hover:text-cyan-100 underline flex items-center gap-1 truncate">
                                <FiExternalLink size={10} />
                                {sale.trackingUrl}
                              </a>
                            </div>
                          </div>
                        ) : editingTracking === sale._id ? (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                              value={trackingUrl}
                              onChange={e => setTrackingUrl(e.target.value)}
                              placeholder="https://tracking.correoargentino.com.ar/..."
                            />
                            <button
                              onClick={() => handleSendTracking(sale._id)}
                              disabled={sendingTracking || !trackingUrl.trim()}
                              className="bg-cyan-600 text-white px-3 py-1 rounded text-xs hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-1"
                            >
                              <FiSend size={12} />
                              {sendingTracking ? 'Enviando...' : 'Enviar'}
                            </button>
                            <button
                              onClick={() => { setEditingTracking(null); setTrackingUrl(''); }}
                              className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded text-xs hover:bg-neutral-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingTracking(sale._id); setTrackingUrl(sale.trackingUrl || ''); }}
                            className="text-sm text-neutral-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                          >
                            <FiTruck size={13} />
                            {sale.status === 'approved' ? 'Enviar link de seguimiento y despachar' : 'Agregar seguimiento'}
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {sale.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(sale, 'refunded')}
                            className="bg-orange-900/30 text-orange-400 px-3 py-1.5 rounded text-xs hover:bg-orange-900/50"
                          >
                            Marcar reembolsada
                          </button>
                        )}
                        {sale.status === 'shipped' && (
                          <button
                            onClick={() => handleStatusChange(sale, 'approved')}
                            className="bg-green-900/30 text-green-400 px-3 py-1.5 rounded text-xs hover:bg-green-900/50"
                          >
                            Volver a aprobada
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                onClick={() => { setPage(p => p - 1); fetchSales(page - 1); }}
                disabled={page <= 1}
                className="bg-neutral-800 text-neutral-300 p-2 rounded hover:bg-neutral-700 disabled:opacity-30"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-neutral-400 text-sm">Página {page} de {totalPages}</span>
              <button
                onClick={() => { setPage(p => p + 1); fetchSales(page + 1); }}
                disabled={page >= totalPages}
                className="bg-neutral-800 text-neutral-300 p-2 rounded hover:bg-neutral-700 disabled:opacity-30"
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

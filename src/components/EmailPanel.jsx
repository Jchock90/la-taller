import { useState, useEffect, useRef, useCallback } from 'react';
import { FiMail, FiSend, FiUsers, FiUser, FiCheckCircle, FiAlertCircle, FiSearch, FiX, FiRefreshCw, FiBold, FiItalic, FiUnderline, FiLink, FiImage, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList, FiType, FiMinus, FiEye, FiEdit3, FiUpload, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'individual', label: 'Individual', icon: FiUser },
  { id: 'selected', label: 'Seleccionados', icon: FiUsers },
  { id: 'newsletter', label: 'Newsletter', icon: FiMail },
];

// Toolbar button
const ToolBtn = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    className="p-1.5 transition-colors text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
    title={label}
  >
    <Icon size={15} />
  </button>
);

export default function EmailPanel() {
  const { token } = useAuth();
  const [tab, setTab] = useState('individual');
  const [recipients, setRecipients] = useState({ users: [], guests: [], totalVerified: 0 });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [preview, setPreview] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [modal, setModal] = useState(null); // null | 'link' | 'image'
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const editorHtmlRef = useRef('');

  // Form
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const editorRef = useRef(null);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEmailRecipients(token);
      setRecipients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipients(); }, []);

  const fetchSentEmails = async () => {
    setLoadingHistory(true);
    try {
      const data = await adminApi.getSentEmails(token);
      setSentEmails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const allContacts = [
    ...recipients.users.map(u => ({ ...u, label: `${u.nombre} ${u.apellido}`, type: u.googleId ? 'Google' : 'Registrado' })),
    ...recipients.guests.map(g => ({ ...g, label: `${g.nombre} ${g.apellido}`, type: 'Comprador' })),
  ];

  const filtered = allContacts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.label.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const toggleSelect = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const selectAll = () => {
    const emails = filtered.map(c => c.email);
    const allSelected = emails.every(e => selectedEmails.includes(e));
    if (allSelected) {
      setSelectedEmails(prev => prev.filter(e => !emails.includes(e)));
    } else {
      setSelectedEmails(prev => [...new Set([...prev, ...emails])]);
    }
  };

  // Save/restore selection for modals
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) savedSelectionRef.current = sel.getRangeAt(0);
  };
  const restoreSelection = () => {
    const range = savedSelectionRef.current;
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  // Rich text commands
  const exec = useCallback((cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    setLinkText(sel.toString() || '');
    setLinkUrl('');
    setModal('link');
  };

  const confirmLink = () => {
    const url = linkUrl;
    const text = linkText;
    setModal(null);
    if (!url) return;
    setTimeout(() => {
      editorRef.current?.focus();
      restoreSelection();
      if (text && !window.getSelection().toString()) {
        document.execCommand('insertHTML', false, `<a href="${url.replace(/"/g, '&quot;')}">${text}</a>`);
      } else {
        document.execCommand('createLink', false, url);
      }
    }, 0);
  };

  const openImageModal = () => {
    saveSelection();
    setImagePreview(null);
    setModal('image');
  };

  const MAX_IMG_WIDTH = 800;
  const MAX_IMG_HEIGHT = 800;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > MAX_IMG_WIDTH || img.height > MAX_IMG_HEIGHT) {
          const ratio = Math.min(MAX_IMG_WIDTH / img.width, MAX_IMG_HEIGHT / img.height);
          const w = Math.round(img.width * ratio);
          const h = Math.round(img.height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          setImagePreview(canvas.toDataURL(file.type || 'image/png', 0.85));
        } else {
          setImagePreview(ev.target.result);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const confirmImage = () => {
    const src = imagePreview;
    setModal(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (!src) return;
    setTimeout(() => {
      editorRef.current?.focus();
      restoreSelection();
      document.execCommand('insertHTML', false, `<img src="${src}" style="max-width:100%;height:auto;margin:8px 0;" />`);
    }, 0);
  };

  // Extract base64 images from HTML and replace with CID references for email
  const extractImagesForEmail = (html) => {
    const attachments = [];
    const processedHtml = html.replace(
      /src="(data:image\/(png|jpeg|gif|webp);base64,[^"]+)"/g,
      (match, dataUri) => {
        const cid = `img${attachments.length}`;
        attachments.push({ cid, dataUri });
        return `src="cid:${cid}"`;
      }
    );
    return { processedHtml, attachments };
  };

  const insertHeading = () => {
    exec('formatBlock', '<h2>');
  };

  const insertSeparator = () => {
    exec('insertHTML', '<hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">');
  };

  const getEditorHtml = () => editorRef.current?.innerHTML || '';
  const getEditorText = () => editorRef.current?.innerText || '';

  const handleSend = async () => {
    const htmlContent = getEditorHtml();
    const textContent = getEditorText();
    if (!subject.trim() || !textContent.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const { processedHtml, attachments } = extractImagesForEmail(htmlContent);
      let payload;
      if (tab === 'individual') {
        if (!to.trim()) return;
        payload = { to: to.trim(), subject, body: textContent, html: processedHtml, attachments, type: 'individual' };
      } else if (tab === 'selected') {
        if (selectedEmails.length === 0) return;
        payload = { to: selectedEmails, subject, body: textContent, html: processedHtml, attachments, type: 'selected' };
      } else {
        payload = { subject, body: textContent, html: processedHtml, attachments, type: 'newsletter' };
      }
      const data = await adminApi.sendEmail(token, payload);
      setResult(data);
      if (data.sent > 0 && data.failed === 0) {
        setSubject('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setTo('');
      }
      // Refresh history
      if (showHistory) fetchSentEmails();
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setSending(false);
    }
  };

  const inputClass = 'bg-neutral-800 border border-neutral-700 text-neutral-100 px-4 py-2.5 text-sm focus:outline-none focus:border-neutral-500 w-full';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiMail size={20} className="text-neutral-400" />
          <h2 className="text-lg font-semibold text-white">Email</h2>
        </div>
        <button onClick={fetchRecipients} className="text-neutral-400 hover:text-neutral-200 transition-colors" title="Recargar">
          <FiRefreshCw size={16} />
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-neutral-900 p-1 border border-neutral-800 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors ${tab === t.id ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">Componer email</h3>
              <button
                type="button"
                onClick={() => {
                  if (!preview) {
                    editorHtmlRef.current = editorRef.current?.innerHTML || '';
                  }
                  setPreview(p => !p);
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-colors ${preview ? 'border-neutral-500 text-neutral-200 bg-neutral-800' : 'border-neutral-700 text-neutral-400 hover:text-neutral-200'}`}
              >
                {preview ? <FiEdit3 size={12} /> : <FiEye size={12} />}
                {preview ? 'Editar' : 'Vista previa'}
              </button>
            </div>

            {/* Recipient field — individual */}
            {tab === 'individual' && (
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Para</label>
                <input
                  type="email"
                  className={inputClass}
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="email@ejemplo.com"
                  list="email-suggestions"
                />
                <datalist id="email-suggestions">
                  {allContacts.map(c => (
                    <option key={c.email} value={c.email}>{c.label}</option>
                  ))}
                </datalist>
              </div>
            )}

            {/* Selected count */}
            {tab === 'selected' && (
              <div className="text-sm text-neutral-400">
                {selectedEmails.length === 0
                  ? 'Selecciona destinatarios de la lista →'
                  : `${selectedEmails.length} destinatario${selectedEmails.length > 1 ? 's' : ''} seleccionado${selectedEmails.length > 1 ? 's' : ''}`
                }
              </div>
            )}

            {/* Newsletter info */}
            {tab === 'newsletter' && (
              <div className="bg-neutral-800/20 border border-neutral-700/30 p-3 text-sm text-neutral-300 flex items-start gap-2">
                <FiUsers className="shrink-0 mt-0.5" size={16} />
                <span>Se enviará a <strong>{recipients.total}</strong> usuarios registrados.</span>
              </div>
            )}

            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Asunto</label>
              <input
                className={inputClass}
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Asunto del email..."
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Contenido</label>

              {/* Preview mode */}
              {preview && (
                <div className="border border-neutral-700 bg-white p-6 min-h-[280px]">
                  <div
                    style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '0 auto', color: '#333', fontSize: 15, lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: editorHtmlRef.current }}
                  />
                </div>
              )}

              {/* Editor with toolbar — hidden when preview active */}
              <div className={`border border-neutral-700 overflow-hidden ${preview ? 'hidden' : ''}`}>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-700 bg-neutral-800/80">
                    <ToolBtn icon={FiBold} label="Negrita (Ctrl+B)" onClick={() => exec('bold')} />
                    <ToolBtn icon={FiItalic} label="Cursiva (Ctrl+I)" onClick={() => exec('italic')} />
                    <ToolBtn icon={FiUnderline} label="Subrayado (Ctrl+U)" onClick={() => exec('underline')} />
                    <div className="w-px h-5 bg-neutral-700 mx-1" />
                    <ToolBtn icon={FiType} label="Título" onClick={insertHeading} />
                    <ToolBtn icon={FiList} label="Lista" onClick={() => exec('insertUnorderedList')} />
                    <div className="w-px h-5 bg-neutral-700 mx-1" />
                    <ToolBtn icon={FiAlignLeft} label="Alinear izquierda" onClick={() => exec('justifyLeft')} />
                    <ToolBtn icon={FiAlignCenter} label="Centrar" onClick={() => exec('justifyCenter')} />
                    <ToolBtn icon={FiAlignRight} label="Alinear derecha" onClick={() => exec('justifyRight')} />
                    <div className="w-px h-5 bg-neutral-700 mx-1" />
                    <ToolBtn icon={FiLink} label="Insertar enlace" onClick={openLinkModal} />
                    <ToolBtn icon={FiImage} label="Insertar imagen" onClick={openImageModal} />
                    <ToolBtn icon={FiMinus} label="Separador horizontal" onClick={insertSeparator} />
                    <div className="w-px h-5 bg-neutral-700 mx-1" />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-neutral-500">A</span>
                      <input
                        type="color"
                        className="w-5 h-5 cursor-pointer bg-transparent border-0 p-0"
                        title="Color de texto"
                        onChange={e => exec('foreColor', e.target.value)}
                        defaultValue="#ffffff"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-neutral-500 bg-neutral-600 px-0.5">A</span>
                      <input
                        type="color"
                        className="w-5 h-5 cursor-pointer bg-transparent border-0 p-0"
                        title="Color de fondo del texto"
                        onChange={e => exec('hiliteColor', e.target.value)}
                        defaultValue="#000000"
                      />
                    </div>
                  </div>

                  {/* Editable area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    className="min-h-[250px] max-h-[500px] overflow-y-auto px-4 py-3 text-sm text-neutral-100 bg-neutral-900 focus:outline-none [&_img]:max-w-full [&_img]:h-auto [&_a]:text-blue-400 [&_a]:underline [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_hr]:border-neutral-700"
                    style={{ lineHeight: 1.7 }}
                    suppressContentEditableWarning
                  />
                </div>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-3 text-sm flex items-start gap-2 ${
                result.error
                  ? 'bg-red-900/30 border border-red-800/30 text-red-300'
                  : result.failed > 0
                    ? 'bg-yellow-900/30 border border-yellow-800/30 text-yellow-300'
                    : 'bg-green-900/30 border border-green-800/30 text-green-300'
              }`}>
                {result.error ? (
                  <><FiAlertCircle className="shrink-0 mt-0.5" size={16} /><span>{result.error}</span></>
                ) : (
                  <>
                    <FiCheckCircle className="shrink-0 mt-0.5" size={16} />
                    <div>
                      <p>{result.sent} email{result.sent > 1 ? 's' : ''} enviado{result.sent > 1 ? 's' : ''} exitosamente{result.failed > 0 ? `, ${result.failed} fallido${result.failed > 1 ? 's' : ''}` : ''}.</p>
                      {result.errors?.length > 0 && (
                        <ul className="mt-1 text-xs text-red-400">
                          {result.errors.map((e, i) => <li key={i}>{e.email}: {e.error}</li>)}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || (tab === 'individual' && !to.trim()) || (tab === 'selected' && selectedEmails.length === 0)}
              className="bg-neutral-100 text-neutral-900 px-6 py-2.5 text-sm font-medium hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <FiSend size={14} />
              {sending ? 'Enviando...' : tab === 'newsletter' ? `Enviar a ${recipients.totalVerified} usuarios` : 'Enviar email'}
            </button>
          </div>
        </div>

        {/* Right: Contact list (for individual & selected) */}
        {tab !== 'newsletter' && (
          <div className="space-y-3">
            <div className="bg-neutral-900 border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-300">Contactos</h3>
                <span className="text-xs text-neutral-500">{allContacts.length}</span>
              </div>

              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-2.5 text-neutral-500" size={14} />
                <input
                  className="bg-neutral-800 border border-neutral-700 text-neutral-100 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-neutral-500 w-full"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar contacto..."
                />
              </div>

              {tab === 'selected' && filtered.length > 0 && (
                <button
                  onClick={selectAll}
                  className="text-xs text-neutral-400 hover:text-neutral-300 mb-2"
                >
                  {filtered.every(c => selectedEmails.includes(c.email)) ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              )}

              {loading ? (
                <p className="text-neutral-500 text-sm text-center py-6">Cargando...</p>
              ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-1">
                  {filtered.map(c => {
                    const isSelected = selectedEmails.includes(c.email);
                    return (
                      <div
                        key={c.email}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                          tab === 'selected' && isSelected
                            ? 'bg-neutral-800/30 border border-neutral-700/30'
                            : 'hover:bg-neutral-800/60 border border-transparent'
                        }`}
                        onClick={() => {
                          if (tab === 'individual') {
                            setTo(c.email);
                          } else if (tab === 'selected') {
                            toggleSelect(c.email);
                          }
                        }}
                      >
                        {tab === 'selected' && (
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-neutral-200 border-neutral-200' : 'border-neutral-600'
                          }`}>
                            {isSelected && <FiCheckCircle size={10} className="text-white" />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-200 truncate">{c.label}</p>
                          <p className="text-xs text-neutral-500 truncate">{c.email}</p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                          c.type === 'Registrado' || c.type === 'Google'
                            ? 'bg-green-900/40 text-green-400'
                            : c.type === 'Comprador'
                              ? 'bg-cyan-900/40 text-cyan-400'
                              : 'bg-neutral-700 text-neutral-400'
                        }`}>
                          {c.type}
                        </span>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="text-neutral-500 text-sm text-center py-4">No hay contactos</p>
                  )}
                </div>
              )}
            </div>

            {/* Selected tags */}
            {tab === 'selected' && selectedEmails.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 p-4">
                <h4 className="text-xs text-neutral-500 uppercase mb-2">Seleccionados ({selectedEmails.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmails.map(email => (
                    <span key={email} className="bg-neutral-800/30 text-neutral-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {email}
                      <button onClick={() => toggleSelect(email)} className="hover:text-neutral-100">
                        <FiX size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sent emails history */}
      <div className="bg-neutral-900 border border-neutral-800">
        <button
          onClick={() => { setShowHistory(h => !h); if (!showHistory && sentEmails.length === 0) fetchSentEmails(); }}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-neutral-800/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FiClock size={16} className="text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">Historial de envíos</span>
            {sentEmails.length > 0 && (
              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5">{sentEmails.length}</span>
            )}
          </div>
          {showHistory ? <FiChevronUp size={16} className="text-neutral-500" /> : <FiChevronDown size={16} className="text-neutral-500" />}
        </button>

        {showHistory && (
          <div className="border-t border-neutral-800">
            {loadingHistory ? (
              <p className="text-neutral-500 text-sm text-center py-6">Cargando historial...</p>
            ) : sentEmails.length === 0 ? (
              <p className="text-neutral-500 text-sm text-center py-6">No hay emails enviados aún</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto divide-y divide-neutral-800/50">
                {sentEmails.map(em => (
                  <div key={em._id} className="px-5 py-3 hover:bg-neutral-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-neutral-200 font-medium truncate">{em.subject}</p>
                          {em.hasImages && <FiImage size={12} className="text-neutral-500 shrink-0" title="Con imágenes" />}
                        </div>
                        {em.bodyPreview && (
                          <p className="text-xs text-neutral-500 truncate mt-0.5">{em.bodyPreview}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 ${
                            em.type === 'newsletter' ? 'bg-purple-900/40 text-purple-400' :
                            em.type === 'selected' ? 'bg-cyan-900/40 text-cyan-400' :
                            'bg-neutral-700 text-neutral-400'
                          }`}>
                            {em.type === 'newsletter' ? 'Newsletter' : em.type === 'selected' ? 'Seleccionados' : 'Individual'}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {em.recipients?.length === 1
                              ? em.recipients[0]
                              : `${em.recipients?.length || 0} destinatarios`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-green-400">{em.sent}</span>
                          <span className="text-[10px] text-neutral-600">/</span>
                          {em.failed > 0 && <span className="text-xs text-red-400">{em.failed}✗</span>}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await adminApi.deleteSentEmail(token, em._id);
                                setSentEmails(prev => prev.filter(x => x._id !== em._id));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="ml-1 p-0.5 text-neutral-600 hover:text-red-400 transition-colors"
                            title="Eliminar del historial"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-600">
                          {new Date(em.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          {' '}
                          {new Date(em.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-neutral-800 px-5 py-2 flex justify-end">
              <button onClick={fetchSentEmails} className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors">
                <FiRefreshCw size={10} />
                Actualizar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Link Modal */}
      {modal === 'link' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-neutral-900 border border-neutral-700 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-neutral-200 uppercase tracking-wider mb-4">Insertar enlace</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm px-3 py-2 focus:outline-none focus:border-neutral-500"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && confirmLink()}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Texto (opcional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={e => setLinkText(e.target.value)}
                  placeholder="Texto del enlace"
                  className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm px-3 py-2 focus:outline-none focus:border-neutral-500"
                  onKeyDown={e => e.key === 'Enter' && confirmLink()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setModal(null)} className="px-4 py-1.5 text-xs uppercase tracking-wider text-neutral-400 border border-neutral-700 hover:text-neutral-200 hover:border-neutral-500 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmLink} disabled={!linkUrl} className="px-4 py-1.5 text-xs uppercase tracking-wider bg-neutral-200 text-neutral-900 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modal === 'image' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={() => { setModal(null); setImagePreview(null); }}>
          <div className="bg-neutral-900 border border-neutral-700 p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-neutral-200 uppercase tracking-wider mb-4">Insertar imagen</h3>
            <div
              className="border border-dashed border-neutral-600 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors"
              onClick={() => imageInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-48 max-w-full object-contain" />
              ) : (
                <>
                  <FiUpload size={28} className="text-neutral-500 mb-2" />
                  <p className="text-xs text-neutral-400">Click para seleccionar imagen</p>
                  <p className="text-[10px] text-neutral-600 mt-1">JPG, PNG, GIF, WEBP</p>
                </>
              )}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageFile}
            />
            {imagePreview && (
              <button
                onClick={() => { setImagePreview(null); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                className="mt-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Cambiar imagen
              </button>
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => { setModal(null); setImagePreview(null); }} className="px-4 py-1.5 text-xs uppercase tracking-wider text-neutral-400 border border-neutral-700 hover:text-neutral-200 hover:border-neutral-500 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmImage} disabled={!imagePreview} className="px-4 py-1.5 text-xs uppercase tracking-wider bg-neutral-200 text-neutral-900 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

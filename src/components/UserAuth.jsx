import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck, FiPackage, FiClock, FiHeart } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { userApi } from '../services/userApi';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function UserAuth({ onClose, onSuccess, initialTab = 'login' }) {
  const { isDark } = useTheme();
  const { login } = useUserAuth();
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendOk, setResendOk] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmail2, setRegEmail2] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');

  const { translatedText: t_passWeak } = useAutoTranslate('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');

  // Translations
  const { translatedText: t_login } = useAutoTranslate('Iniciar sesión');
  const { translatedText: t_register } = useAutoTranslate('Crear cuenta');
  const { translatedText: t_email } = useAutoTranslate('Email');
  const { translatedText: t_password } = useAutoTranslate('Contraseña');
  const { translatedText: t_name } = useAutoTranslate('Nombre');
  const { translatedText: t_lastname } = useAutoTranslate('Apellido');
  const { translatedText: t_confirmPass } = useAutoTranslate('Confirmar contraseña');
  const { translatedText: t_confirmEmail } = useAutoTranslate('Confirmar email');
  const { translatedText: t_or } = useAutoTranslate('o');
  const { translatedText: t_google } = useAutoTranslate('Continuar con Google');
  const { translatedText: t_noAccount } = useAutoTranslate('¿No tenés cuenta?');
  const { translatedText: t_hasAccount } = useAutoTranslate('¿Ya tenés cuenta?');
  const { translatedText: t_benefits } = useAutoTranslate('Ventajas de registrarte');
  const { translatedText: t_benefit1 } = useAutoTranslate('Seguí el estado de tus compras en tiempo real');
  const { translatedText: t_benefit2 } = useAutoTranslate('Historial completo de todas tus compras');
  const { translatedText: t_benefit3 } = useAutoTranslate('Proceso de compra más rápido');
  const { translatedText: t_passNoMatch } = useAutoTranslate('Las contraseñas no coinciden');
  const { translatedText: t_emailNoMatch } = useAutoTranslate('Los emails no coinciden');
  const { translatedText: t_successTitle } = useAutoTranslate('¡Cuenta creada!');
  const { translatedText: t_successMsg } = useAutoTranslate('Te enviamos un email para verificar tu cuenta. Revisá tu bandeja de entrada.');
  const { translatedText: t_processing } = useAutoTranslate('Procesando...');
  const { translatedText: t_verifyTitle } = useAutoTranslate('Verificá tu email');
  const { translatedText: t_verifyMsg } = useAutoTranslate('Te enviamos un email de verificación. Revisá tu bandeja de entrada y hacé clic en el link para activar tu cuenta.');
  const { translatedText: t_resend } = useAutoTranslate('Reenviar email');
  const { translatedText: t_resent } = useAutoTranslate('¡Email reenviado!');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await userApi.login(loginEmail, loginPassword);
      login(data.token, data.user);
      onSuccess?.();
    } catch (err) {
      if (err.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(err.email || loginEmail);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regEmail !== regEmail2) {
      setError(t_emailNoMatch);
      return;
    }
    if (regPassword !== regPassword2) {
      setError(t_passNoMatch);
      return;
    }
    if (regPassword.length < 8 || !/[A-Z]/.test(regPassword) || !/[0-9]/.test(regPassword)) {
      setError(t_passWeak);
      return;
    }
    setLoading(true);
    try {
      await userApi.register({
        nombre: regNombre,
        apellido: regApellido,
        email: regEmail,
        password: regPassword,
      });
      setVerificationEmail(regEmail);
      setSuccessMsg(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleInitialized = useRef(false);
  const googleBtnRef = useCallback((node) => {
    if (!node || !GOOGLE_CLIENT_ID || !window.google || !googleInitialized.current) return;
    node.innerHTML = '';
    window.google.accounts.id.renderButton(node, {
      type: 'standard',
      shape: 'rectangular',
      theme: isDark ? 'filled_black' : 'outline',
      size: 'large',
      width: node.offsetWidth || 320,
      text: 'continue_with',
      logo_alignment: 'center',
    });
  }, [isDark]);

  const googleBtnRegRef = useCallback((node) => {
    if (!node || !GOOGLE_CLIENT_ID || !window.google || !googleInitialized.current) return;
    node.innerHTML = '';
    window.google.accounts.id.renderButton(node, {
      type: 'standard',
      shape: 'rectangular',
      theme: isDark ? 'filled_black' : 'outline',
      size: 'large',
      width: node.offsetWidth || 320,
      text: 'continue_with',
      logo_alignment: 'center',
    });
  }, [isDark]);

  const googleCallback = useCallback(async (response) => {
    setLoading(true);
    setError('');
    try {
      const data = await userApi.googleAuth(response.credential);
      login(data.token, data.user);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [login, onSuccess]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || googleInitialized.current) return;
    googleInitialized.current = true;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: googleCallback,
    });
  }, [googleCallback]);

  const bg = isDark ? 'bg-neutral-900' : 'bg-white';
  const text = isDark ? 'text-neutral-100' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const cardBg = isDark ? 'bg-neutral-800/50' : 'bg-gray-50';

  const handleResend = async () => {
    setResending(true);
    setResendOk(false);
    try {
      await userApi.resendVerification(verificationEmail);
      setResendOk(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  // Verification pending screen (from login or register)
  if (needsVerification) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${bg} p-8 w-full max-w-md shadow-2xl text-center`}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-900/30 flex items-center justify-center">
            <FiMail className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_verifyTitle}</h2>
          <p className={`${subtext} mb-6`}>{t_verifyMsg}</p>
          {resendOk && <p className="text-green-400 text-sm mb-4">{t_resent}</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className={`px-5 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {resending ? t_processing : t_resend}
            </button>
            <button
              onClick={onClose}
              className={`px-5 py-2.5 font-semibold text-sm border hover:opacity-80 transition-opacity ${isDark ? 'border-neutral-600 text-neutral-300' : 'border-gray-300 text-gray-700'}`}
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success screen
  if (successMsg) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${bg} p-8 w-full max-w-md shadow-2xl text-center`}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center">
            <FiCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_successTitle}</h2>
          <p className={`${subtext} mb-6`}>{t_successMsg}</p>
          {resendOk && <p className="text-green-400 text-sm mb-4">{t_resent}</p>}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className={`px-5 py-2.5 font-semibold text-sm border hover:opacity-80 transition-opacity disabled:opacity-50 ${isDark ? 'border-neutral-600 text-neutral-300' : 'border-gray-300 text-gray-700'}`}
            >
              {resending ? t_processing : t_resend}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bg} w-full max-w-md shadow-2xl overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-neutral-700">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === t
                  ? `${text} border-b-2 border-black dark:border-white`
                  : `${subtext} hover:${text}`
              }`}
            >
              {t === 'login' ? t_login : t_register}
            </button>
          ))}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-neutral-800 text-red-600 dark:text-neutral-400 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_email}</label>
                  <div className="relative">
                    <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_password}</label>
                  <div className="relative">
                    <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${subtext}`}>
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 ${isDark ? 'bg-neutral-200 text-neutral-900' : 'bg-black text-white'}`}
                >
                  {loading ? t_processing : t_login}
                </button>

                {/* Google */}
                {GOOGLE_CLIENT_ID && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                      <span className={`text-xs ${subtext}`}>{t_or}</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                    </div>
                    <div ref={googleBtnRef} className="w-full flex justify-center" />
                  </>
                )}

                <p className={`text-center text-sm ${subtext}`}>
                  {t_noAccount}{' '}
                  <button type="button" onClick={() => { setTab('register'); setError(''); }} className="font-semibold underline">
                    {t_register}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Benefits banner */}
                <div className={`${cardBg} p-4 mb-5`}>
                  <h3 className={`text-sm font-bold ${text} mb-2`}>{t_benefits}</h3>
                  <ul className="space-y-1.5">
                    {[
                      { icon: FiClock, text: t_benefit1 },
                      { icon: FiPackage, text: t_benefit2 },
                      { icon: FiHeart, text: t_benefit3 },
                    ].map((b, i) => (
                      <li key={i} className={`flex items-center gap-2 text-xs ${subtext}`}>
                        <b.icon className="flex-shrink-0 text-neutral-400" size={14} />
                        {b.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_name}</label>
                      <div className="relative">
                        <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                        <input
                          type="text"
                          required
                          value={regNombre}
                          onChange={e => setRegNombre(e.target.value)}
                          className={`w-full pl-10 pr-3 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_lastname}</label>
                      <input
                        type="text"
                        required
                        value={regApellido}
                        onChange={e => setRegApellido(e.target.value)}
                        className={`w-full px-3 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_email}</label>
                    <div className="relative">
                      <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_confirmEmail}</label>
                    <div className="relative">
                      <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                      <input
                        type="email"
                        required
                        value={regEmail2}
                        onChange={e => setRegEmail2(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                        placeholder="tu@email.com"
                      />
                      {regEmail2 && regEmail === regEmail2 && (
                        <FiCheck className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400`} size={16} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_password}</label>
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${subtext}`}>
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${subtext} mb-1 block`}>{t_confirmPass}</label>
                    <div className="relative">
                      <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtext}`} />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={regPassword2}
                        onChange={e => setRegPassword2(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                      />
                      {regPassword2 && regPassword === regPassword2 && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    {loading ? t_processing : t_register}
                  </button>

                  {/* Google */}
                  {GOOGLE_CLIENT_ID && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                        <span className={`text-xs ${subtext}`}>{t_or}</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
                      </div>
                      <div ref={googleBtnRegRef} className="w-full flex justify-center" />
                    </>
                  )}

                  <p className={`text-center text-sm ${subtext}`}>
                    {t_hasAccount}{' '}
                    <button type="button" onClick={() => { setTab('login'); setError(''); }} className="font-semibold underline">
                      {t_login}
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

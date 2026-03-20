import { useState } from 'react';
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
  const [successMsg, setSuccessMsg] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');

  // Translations
  const { translatedText: t_login } = useAutoTranslate('Iniciar sesión');
  const { translatedText: t_register } = useAutoTranslate('Crear cuenta');
  const { translatedText: t_email } = useAutoTranslate('Email');
  const { translatedText: t_password } = useAutoTranslate('Contraseña');
  const { translatedText: t_name } = useAutoTranslate('Nombre');
  const { translatedText: t_lastname } = useAutoTranslate('Apellido');
  const { translatedText: t_confirmPass } = useAutoTranslate('Confirmar contraseña');
  const { translatedText: t_or } = useAutoTranslate('o');
  const { translatedText: t_google } = useAutoTranslate('Continuar con Google');
  const { translatedText: t_noAccount } = useAutoTranslate('¿No tenés cuenta?');
  const { translatedText: t_hasAccount } = useAutoTranslate('¿Ya tenés cuenta?');
  const { translatedText: t_benefits } = useAutoTranslate('Ventajas de registrarte');
  const { translatedText: t_benefit1 } = useAutoTranslate('Seguí el estado de tus compras en tiempo real');
  const { translatedText: t_benefit2 } = useAutoTranslate('Historial completo de todas tus compras');
  const { translatedText: t_benefit3 } = useAutoTranslate('Proceso de compra más rápido');
  const { translatedText: t_passNoMatch } = useAutoTranslate('Las contraseñas no coinciden');
  const { translatedText: t_verifyTitle } = useAutoTranslate('Verifica tu email');
  const { translatedText: t_verifyMsg } = useAutoTranslate('Te enviamos un enlace de verificación a');
  const { translatedText: t_resend } = useAutoTranslate('Reenviar enlace');
  const { translatedText: t_resent } = useAutoTranslate('Enlace reenviado');
  const { translatedText: t_processing } = useAutoTranslate('Procesando...');

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
        setVerificationEmail(loginEmail);
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
    if (regPassword !== regPassword2) {
      setError(t_passNoMatch);
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
      setNeedsVerification(true);
      setVerificationEmail(regEmail);
      setSuccessMsg('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await userApi.resendVerification(verificationEmail);
      setSuccessMsg(t_resent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
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
      },
    });
    window.google.accounts.id.prompt();
  };

  const bg = isDark ? 'bg-neutral-900' : 'bg-white';
  const text = isDark ? 'text-neutral-100' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const cardBg = isDark ? 'bg-neutral-800/50' : 'bg-gray-50';

  // Verification screen
  if (needsVerification) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${bg} rounded-2xl p-8 w-full max-w-md shadow-2xl text-center`}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700/30 dark:bg-neutral-900/30 flex items-center justify-center">
            <FiMail className="w-8 h-8 text-neutral-300" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_verifyTitle}</h2>
          <p className={`${subtext} mb-1`}>{t_verifyMsg}</p>
          <p className={`font-medium mb-6 ${text}`}>{verificationEmail}</p>
          {successMsg && <p className="text-neutral-400 text-sm mb-4">{successMsg}</p>}
          {error && <p className="text-neutral-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="text-sm underline text-neutral-400 hover:text-neutral-300 disabled:opacity-50 border-none dark:border-none"
          >
            {loading ? t_processing : t_resend}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${bg} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden`}
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
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-neutral-800 text-red-600 dark:text-neutral-400 text-sm">
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
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
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
                      className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${subtext}`}>
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-black dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
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
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className={`w-full py-2.5 rounded-lg border ${isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border-gray-300 hover:bg-gray-50'} font-medium text-sm flex items-center justify-center gap-2 transition-colors ${text}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                      {t_google}
                    </button>
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
                <div className={`${cardBg} rounded-xl p-4 mb-5`}>
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
                          className={`w-full pl-10 pr-3 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
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
                        className={`w-full px-3 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
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
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
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
                        minLength={6}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
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
                        minLength={6}
                        value={regPassword2}
                        onChange={e => setRegPassword2(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20`}
                      />
                      {regPassword2 && regPassword === regPassword2 && (
                        <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
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
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className={`w-full py-2.5 rounded-lg border ${isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border-gray-300 hover:bg-gray-50'} font-medium text-sm flex items-center justify-center gap-2 transition-colors ${text}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                        {t_google}
                      </button>
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

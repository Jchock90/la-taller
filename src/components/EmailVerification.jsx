import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { userApi } from '../services/userApi';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

export default function EmailVerification({ setCurrentSection }) {
  const { isDark } = useTheme();
  const { login } = useUserAuth();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const { translatedText: t_verifying } = useAutoTranslate('Verificando tu email...');
  const { translatedText: t_success } = useAutoTranslate('¡Email verificado!');
  const { translatedText: t_successMsg } = useAutoTranslate('Tu cuenta fue verificada exitosamente. Ya podés empezar a comprar.');
  const { translatedText: t_errorTitle } = useAutoTranslate('Error de verificación');
  const { translatedText: t_goHome } = useAutoTranslate('Ir al inicio');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setError('Token no proporcionado');
      return;
    }

    userApi.verifyEmail(token)
      .then(data => {
        setStatus('success');
        if (data.token && data.user) {
          login(data.token, data.user);
        }
      })
      .catch(err => {
        setStatus('error');
        setError(err.message);
      });
  }, [login]);

  const bg = isDark ? 'bg-black' : 'bg-white';
  const text = isDark ? 'text-neutral-100' : 'text-gray-900';
  const subtext = isDark ? 'text-neutral-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 max-w-md w-full text-center`}
      >
        {status === 'loading' && (
          <>
            <FiLoader className={`w-12 h-12 mx-auto mb-4 ${subtext} animate-spin`} />
            <p className={text}>{t_verifying}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center">
              <FiCheck className="w-8 h-8 text-green-400" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_success}</h2>
            <p className={`${subtext} mb-6`}>{t_successMsg}</p>
            <button
              onClick={() => setCurrentSection('home')}
              className={`px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {t_goHome}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 flex items-center justify-center">
              <FiAlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_errorTitle}</h2>
            <p className={`${subtext} mb-6`}>{error}</p>
            <button
              onClick={() => setCurrentSection('home')}
              className={`px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {t_goHome}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

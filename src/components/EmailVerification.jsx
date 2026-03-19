import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useUserAuth } from '../context/UserAuthContext';
import { userApi } from '../services/userApi';
import { useAutoTranslate } from '../hooks/useAutoTranslate';

export default function EmailVerification({ setCurrentSection }) {
  const { isDark } = useTheme();
  const { login } = useUserAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');
  const calledRef = useRef(false);

  const { translatedText: t_verifying } = useAutoTranslate('Verificando tu email...');
  const { translatedText: t_verified } = useAutoTranslate('¡Email verificado!');
  const { translatedText: t_verifiedMsg } = useAutoTranslate('Tu cuenta ha sido verificada correctamente. Ya podés empezar a comprar.');
  const { translatedText: t_errorTitle } = useAutoTranslate('Error de verificación');
  const { translatedText: t_goToStore } = useAutoTranslate('Ir a la tienda');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setError('Token de verificación no encontrado');
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
  }, []);

  const bg = isDark ? 'bg-gray-900' : 'bg-white';
  const text = isDark ? 'text-gray-100' : 'text-gray-900';
  const subtext = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${bg} rounded-2xl p-8 w-full max-w-md shadow-xl text-center`}
      >
        {status === 'loading' && (
          <>
            <FiLoader className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h2 className={`text-xl font-bold ${text}`}>{t_verifying}</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_verified}</h2>
            <p className={`${subtext} mb-6`}>{t_verifiedMsg}</p>
            <button
              onClick={() => setCurrentSection('que-vendo')}
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t_goToStore}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${text}`}>{t_errorTitle}</h2>
            <p className={`${subtext} mb-6`}>{error}</p>
            <button
              onClick={() => setCurrentSection('que-vendo')}
              className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t_goToStore}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Home from './sections/Home';
import About from './sections/About';
import Services from './sections/Services';
import Products from './sections/Products';
import Footer from './components/Footer';
import PaymentStatus from './components/PaymentStatus';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import CookieConsent from './components/CookieConsent';

function AppContent({ currentSection, setCurrentSection, renderSection }) {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  // Admin section
  if (currentSection === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminPanel setCurrentSection={setCurrentSection} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        {!['success', 'failure', 'pending'].includes(currentSection) && (
          <>
            <Navbar setCurrentSection={setCurrentSection} />
            {currentSection === 'home' && <TickerBar />}
          </>
        )}
        {renderSection()}
        {!['success', 'failure', 'pending'].includes(currentSection) && (
          <Footer setCurrentSection={setCurrentSection} />
        )}
        <CookieConsent />
      </div>
    </div>
  );
}

const SECTION_PATHS = {
  'home': '/',
  'quien-soy': '/quien-soy',
  'que-hago': '/que-hago',
  'que-vendo': '/que-vendo',
  'admin': '/admin',
  'success': '/success',
  'failure': '/failure',
  'pending': '/pending',
};

const PATH_TO_SECTION = Object.fromEntries(
  Object.entries(SECTION_PATHS).map(([k, v]) => [v, k])
);

function pathToSection(path) {
  return PATH_TO_SECTION[path] || 'home';
}

function App() {
  const [currentSection, setCurrentSectionState] = useState(() => {
    return pathToSection(window.location.pathname);
  });

  const setCurrentSection = (section) => {
    setCurrentSectionState(section);
    const targetPath = SECTION_PATHS[section] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ section }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = (e) => {
      const section = e.state?.section || pathToSection(window.location.pathname);
      setCurrentSectionState(section);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const renderSection = () => {
    switch(currentSection) {
      case 'home':
        return <Home setCurrentSection={setCurrentSection} />;
      case 'quien-soy':
        return <About />;
      case 'que-hago':
        return <Services />;
      case 'que-vendo':
        return <Products />;
      case 'success':
        return <PaymentStatus status="success" setCurrentSection={setCurrentSection} />;
      case 'failure':
        return <PaymentStatus status="failure" setCurrentSection={setCurrentSection} />;
      case 'pending':
        return <PaymentStatus status="pending" setCurrentSection={setCurrentSection} />;
      default:
        return <Home setCurrentSection={setCurrentSection} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent currentSection={currentSection} setCurrentSection={setCurrentSection} renderSection={renderSection} />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
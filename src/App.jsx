import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
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
import EmailVerification from './components/EmailVerification';

function AppContent({ currentSection, setCurrentSection, renderSection }) {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  // Footer avoidance for floating buttons (WhatsApp, Cart)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const footer = document.querySelector('footer');
        if (footer) {
          const footerTop = footer.getBoundingClientRect().top;
          const vh = window.innerHeight;
          const bottom = footerTop < vh ? (vh - footerTop + 24) : 24;
          document.documentElement.style.setProperty('--fab-bottom', `${bottom}px`);
        }
        ticking = false;
      });
    };
    document.documentElement.style.setProperty('--fab-bottom', '24px');
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentSection]);

  // Admin section
  if (currentSection === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminPanel setCurrentSection={setCurrentSection} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded">Ir al contenido</a>
      <div className={`${isDark ? 'bg-black' : 'bg-white'}`}>
        {!['success', 'failure', 'pending', 'verificar-email'].includes(currentSection) && (
          <>
            <TickerBar />
            <Navbar currentSection={currentSection} setCurrentSection={setCurrentSection} />
          </>
        )}
        <main id="main-content">{renderSection()}</main>
        {!['success', 'failure', 'pending', 'verificar-email'].includes(currentSection) && (
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
  'verificar-email': '/verificar-email',
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
      case 'verificar-email':
        return <EmailVerification setCurrentSection={setCurrentSection} />;
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
          <UserAuthProvider>
            <AppContent currentSection={currentSection} setCurrentSection={setCurrentSection} renderSection={renderSection} />
          </UserAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
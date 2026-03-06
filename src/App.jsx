import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Home from './sections/Home';
import About from './sections/About';
import Services from './sections/Services';
import Products from './sections/Products';
import Footer from './components/Footer';
import PaymentStatus from './components/PaymentStatus';

function AppContent({ currentSection, setCurrentSection, renderSection }) {
  const { isDark } = useTheme();

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
      </div>
    </div>
  );
}

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/success') {
      setCurrentSection('success');
    } else if (path === '/failure') {
      setCurrentSection('failure');
    } else if (path === '/pending') {
      setCurrentSection('pending');
    }
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
        <AppContent currentSection={currentSection} setCurrentSection={setCurrentSection} renderSection={renderSection} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
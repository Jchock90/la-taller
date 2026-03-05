import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Home from './sections/Home';
import About from './sections/About';
import Services from './sections/Services';
import Products from './sections/Products';
import Footer from './components/Footer';
import PaymentStatus from './components/PaymentStatus';

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
    <div className={`min-h-screen`}>
      <div className="bg-white">
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

export default App;
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import About from './sections/About';
import Services from './sections/Services';
import Products from './sections/Products';
import Footer from './components/Footer';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const renderSection = () => {
    switch(currentSection) {
      case 'home':
        return <Home />;
      case 'quien-soy':
        return <About />;
      case 'que-hago':
        return <Services />;
      case 'que-vendo':
        return <Products />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen`}>
      <div className="bg-white">
        <Navbar setCurrentSection={setCurrentSection} />
        {renderSection()}
        <Footer setCurrentSection={setCurrentSection} />
      </div>
    </div>
  );
}

export default App;
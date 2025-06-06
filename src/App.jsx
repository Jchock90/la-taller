import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './sections/Home.jsx'
import About from './sections/About.jsx'
import Services from './sections/Services.jsx'
import Products from './sections/Products.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppContact from './components/WhatsAppContact.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(false);
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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white">
        <Navbar setCurrentSection={setCurrentSection} />
        {renderSection()}
        <Footer setCurrentSection={setCurrentSection} />
        <WhatsAppContact />
      </div>
    </div>
  );
}

export default App;
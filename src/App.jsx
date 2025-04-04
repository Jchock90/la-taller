import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quien-soy" element={<About />} />
            <Route path="/que-hago" element={<Services />} />
            <Route path="/que-vendo" element={<Products />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
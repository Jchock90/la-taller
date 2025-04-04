import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa'; // Cambiado aquí

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo a la izquierda */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              LA TALLER
            </Link>
          </div>
          
          {/* Links centrados */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {['Home', 'Quien soy', 'Que hago', 'Que vendo'].map((item, index) => (
                <Link
                  key={index}
                  to={index === 0 ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Icono de Instagram a la derecha */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="https://instagram.com/lataller" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900"
            >
              <FaInstagram className="h-5 w-5" /> {/* Cambiado aquí */}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
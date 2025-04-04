import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">LA TALLER</h3>
            <p className="text-gray-400">
              Diseño de indumentaria personalizado por Jésica.
            </p>
          </div>
          
          {/* Links rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {['Home', 'Quien soy', 'Que hago', 'Que vendo'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={index === 0 ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <p className="text-gray-400 mb-2">info@lataller.com</p>
            <p className="text-gray-400">+54 9 11 1234 5678</p>
          </div>
          
          {/* Redes sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Seguinos</h4>
            <a 
              href="https://instagram.com/lataller" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram className="mr-2 text-xl" />
              @lataller
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} La Taller. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
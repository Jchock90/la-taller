import { motion } from 'framer-motion';
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = ({ setCurrentSection }) => {
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Quien soy', id: 'quien-soy' },
    { name: 'Que hago', id: 'que-hago' },
    { name: 'Tesoro', id: 'que-vendo' }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Logo y navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <img 
              src="/img/logo-white.png" 
              alt="La Taller Logo" 
              className="h-8 cursor-pointer"
              onClick={() => setCurrentSection('home')}
            />
            <p className="text-purple-200">
              Diseño de indumentaria artesanal y sostenible por Jess
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/lataller__laboratoriodeoficios/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-white hover:text-purple-300 transition-colors"
              >
                <FiInstagram />
              </a>
              {/* Agrega más redes sociales si es necesario */}
            </div>
          </motion.div>

          {/* Columna 2: Navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">Navegación</h3>
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    onClick={() => setCurrentSection(item.id)}
                    className="text-purple-200 hover:text-white cursor-pointer flex items-center"
                  >
                    <span className="mr-2">•</span>
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMail className="text-purple-300 mt-1 mr-3" />
                <span>latallerlaboratoriodeoficios@gmail.com</span>
              </li>
              <li className="flex items-start">
                <FiPhone className="text-purple-300 mt-1 mr-3" />
                <span>+54 9 3447 55-2378</span>
              </li>
              <li className="flex items-start">
                <FiMapPin className="text-purple-300 mt-1 mr-3" />
                <span>Taller ubicado en San José, Entre Ríos, Argentina</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Derechos de autor */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 pt-6 border-t border-purple-300 text-center text-purple-300"
        >
          <p>© {new Date().getFullYear()} La Taller by Jesús Mansilla. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
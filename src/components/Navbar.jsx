import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = ({ setCurrentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Quien soy', id: 'quien-soy' },
    { name: 'Que hago', id: 'que-hago' },
    { name: 'Tesoro', id: 'que-vendo' }
  ];

  const handleNavClick = (id) => {
    setCurrentSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full z-50 flex items-center justify-between p-4 bg-purple-300 shadow-md"
      >
        <div className="flex items-center">
          <img 
            src="/img/logo.png" 
            alt="La Taller Logo" 
            className="h-12 cursor-pointer"
            onClick={() => handleNavClick('home')}
          />
        </div>

        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              whileHover={{ scale: 1.05, color: '#6366f1' }}
              className="text-black text-lg font-medium cursor-pointer"
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        <button 
          className="md:hidden text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white shadow-lg md:hidden"
          >
            <div className="flex flex-col pt-10 p-4 space-y-4">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ scale: 1.05, color: '#6366f1' }}
                  className="text-black text-md cursor-pointer py-2 px-4"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
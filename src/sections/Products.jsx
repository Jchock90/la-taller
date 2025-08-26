import { motion } from "framer-motion"; // Animaciones con framer-motion

// Página simple "En construcción"
const Products = () => {
  return (
    <section
      id="en-construccion"
      className="flex items-center justify-center h-screen bg-gray-100"
    >
      {/* Contenedor principal centrado vertical y horizontalmente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Estado inicial oculto y desplazado
        animate={{ opacity: 1, y: 0 }} // Animación de entrada
        transition={{ duration: 0.6 }} // Duración de animación
        className="text-center p-10 bg-white rounded-2xl shadow-xl"
      >
        {/* Título principal */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Página en construcción
        </h1>

        {/* Texto secundario */}
        <p className="text-lg text-gray-600 mb-6">
          Estamos trabajando para traerte algo increíble. 
          Vuelve pronto para descubrirlo.
        </p>

        {/* Botón de ejemplo para volver al inicio */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
          whileTap={{ scale: 0.95 }} // Animación al hacer click
          className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-gray-800 transition-colors"
        >
          Volver al inicio
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Products;

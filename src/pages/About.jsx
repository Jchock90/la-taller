import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Quién soy</h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Jessica"
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              Hola, soy Jessica
            </h2>
            <p className="text-gray-700 mb-4">
              Soy una diseñadora de moda apasionada por crear piezas únicas que
              reflejen la personalidad de quien las usa. Con más de 10 años de
              experiencia en el mundo de la moda, he desarrollado un estilo que
              combina lo tradicional con lo contemporáneo.
            </p>
            <p className="text-gray-700 mb-4">
              Mi enfoque se centra en la calidad, la atención al detalle y la
              sostenibilidad. Cada pieza que creo está hecha con amor y cuidado,
              utilizando materiales de primera calidad y técnicas artesanales.
            </p>
            <p className="text-gray-700">
              Cuando no estoy diseñando, me encanta viajar, explorar nuevas
              culturas y encontrar inspiración en todo lo que me rodea.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About
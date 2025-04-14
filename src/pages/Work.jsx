import { motion } from 'framer-motion'

const works = [
  {
    id: 1,
    title: 'Diseño de vestidos',
    description:
      'Creación de vestidos únicos y personalizados para ocasiones especiales.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Confección artesanal',
    description:
      'Técnicas tradicionales de costura para garantizar la máxima calidad.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Asesoría de imagen',
    description:
      'Ayudo a mis clientes a encontrar su estilo personal y único.',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Talleres de diseño',
    description:
      'Comparto mis conocimientos a través de talleres y cursos especializados.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
]

const Work = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Qué hago</h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Descubre los servicios que ofrezco para ayudarte a encontrar tu
            estilo único.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">
                  {work.title}
                </h3>
                <p className="text-gray-700">{work.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Work
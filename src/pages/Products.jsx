import { useState } from 'react'
import { motion } from 'framer-motion'

const products = [
  {
    id: 1,
    name: 'Vestido Primavera',
    price: 'ARS 12.500',
    description: 'Vestido largo con estampado floral, ideal para días cálidos.',
    image:
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'vestidos',
  },
  {
    id: 2,
    name: 'Blazer Elegante',
    price: 'ARS 15.800',
    description: 'Blazer ajustado en tono neutro, perfecto para looks formales.',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'abrigos',
  },
  {
    id: 3,
    name: 'Top Bordado',
    price: 'ARS 8.200',
    description: 'Top con delicados bordados artesanales, 100% algodón.',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'tops',
  },
  {
    id: 4,
    name: 'Falda Midilargo',
    price: 'ARS 9.900',
    description: 'Falda plisada en tonos tierra, versátil y cómoda.',
    image:
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'faldas',
  },
  {
    id: 5,
    name: 'Pantalón Wide Leg',
    price: 'ARS 11.300',
    description: 'Pantalón de corte ancho en lino natural, ideal para verano.',
    image:
      'https://images.unsplash.com/photo-1595341595379-cf0f0a3a75ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'pantalones',
  },
  {
    id: 6,
    name: 'Conjunto Casual',
    price: 'ARS 18.000',
    description: 'Set de dos piezas en tonos pastel, tejido suave y liviano.',
    image:
      'https://images.unsplash.com/photo-1595341595379-cf0f0a3a75ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'conjuntos',
  },
]

const categories = [
  'todos',
  ...new Set(products.map((product) => product.category)),
]

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const filteredProducts =
    selectedCategory === 'todos'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Qué vendo</h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Explora mi colección de piezas únicas y hechas a mano.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <button className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded transition-colors">
                  Consultar disponibilidad
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
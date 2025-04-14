import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebook, FaPinterest, FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-indigo-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">La Taller</h3>
            <p className="mb-4">
              Diseño de moda artesanal y personalizado por Jessica.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-indigo-300 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-indigo-300 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-indigo-300 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Accesos rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/quien-soy"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Quién soy
                </Link>
              </li>
              <li>
                <Link
                  to="/que-hago"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Qué hago
                </Link>
              </li>
              <li>
                <Link
                  to="/que-vendo"
                  className="hover:text-indigo-300 transition-colors"
                >
                  Qué vendo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaWhatsapp className="mr-2" />
                <a
                  href="https://wa.me/549TU_NUMERO"
                  className="hover:text-indigo-300 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center">
                <MdEmail className="mr-2" />
                <a
                  href="mailto:jessica@lataller.com"
                  className="hover:text-indigo-300 transition-colors"
                >
                  jessica@lataller.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="mb-4">
              Suscríbete para recibir novedades y promociones.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="px-4 py-2 w-full rounded-l text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-indigo-700 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} La Taller by Jessica. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
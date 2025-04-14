import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Products from './pages/Products'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quien-soy" element={<About />} />
            <Route path="/que-hago" element={<Work />} />
            <Route path="/que-vendo" element={<Products />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
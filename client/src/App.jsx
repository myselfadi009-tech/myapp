import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'

import Navbar    from './Components/Navbar/Navbar'
import Footer    from './Components/Footer/Footer'
import Dashboard from './pages/Dashboard/Dashboard'
import About     from './pages/About/About'
import Contact   from './pages/Contact/Contact'
import NotFound  from './pages/NotFound/NotFound'

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/"       element={<Dashboard />} />
          <Route path="/about"  element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*"       element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </Router>
  )
}

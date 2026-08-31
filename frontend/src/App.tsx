import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import Products from './pages/Products'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/cozumlerimiz" element={<Solutions />} />
          <Route path="/urunlerimiz" element={<Products />} />
          <Route path="/iletisim" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

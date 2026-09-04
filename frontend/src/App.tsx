import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import ContactForm from './pages/ContactForm'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import AdminProductDetail from './pages/admin/ProductDetail'
import AdminLocations from './pages/admin/AdminLocations'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-form" element={<ContactForm />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

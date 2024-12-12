import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import CartPage from './pages/CartPage'
import ProductDetail from './pages/ProductDetail'
import { ChevronRightIcon, FireIcon, SparklesIcon, ShoppingCartIcon } from '@heroicons/react/outline'
import { useLocalStorage } from './hooks/useLocalStorage'
import { products, categories } from './data/products'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useLocalStorage('cartItems', [])
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const addToCart = (product) => {
    const { id, selectedColor, quantity = 1 } = product
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === id && item.selectedColor === selectedColor
      )
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevItems, { ...product, quantity }]
    })
    
    toast.success('Ürün sepete eklendi!')
  }

  const removeFromCart = (productId, selectedColor) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === productId && item.selectedColor === selectedColor)
      )
    )
  }

  const updateQuantity = (productId, selectedColor, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId, selectedColor)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId)
      }
      return [...prevFavorites, productId]
    })
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        <Navbar cartItems={cartItems} setIsCartOpen={setIsCartOpen} />
        
        <Cart
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />

        <Routes>
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            }
          />
          <Route
            path="/"
            element={
              <>
                {/* Hero Section */}
                <div className="relative bg-indigo-900 h-[500px]">
                  <div className="absolute inset-0">
                    <img
                      src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000"
                      alt="Hero background"
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="text-white">
                      <h1 className="text-5xl font-bold mb-4">Yeni Sezon İndirimleri</h1>
                      <p className="text-xl mb-8">Tüm ürünlerde %50'ye varan indirimler</p>
                      <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors">
                        Hemen Keşfet
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Kategoriler</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(category => (
                      <div key={category.id} className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        <img src={category.image} alt={category.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Products Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                      <FireIcon className="h-8 w-8 text-red-500 mr-2" />
                      Öne Çıkan Ürünler
                    </h2>
                    <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center">
                      Tümünü Gör
                      <ChevronRightIcon className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addToCart(product)}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={() => toggleFavorite(product.id)}
                      />
                    ))}
                  </div>
                </section>

                {/* Campaign Banner */}
                <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 my-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-white">
                        <h2 className="text-3xl font-bold mb-4 flex items-center">
                          <SparklesIcon className="h-8 w-8 mr-2" />
                          Özel Kampanya
                        </h2>
                        <p className="text-xl mb-4">İlk alışverişinize özel %20 indirim!</p>
                        <p className="text-sm opacity-80">*2000₺ ve üzeri alışverişlerde geçerlidir</p>
                      </div>
                      <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors">
                        Kampanyayı Kullan
                      </button>
                    </div>
                  </div>
                </section>

                {/* Newsletter */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="bg-gray-100 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Fırsatları Kaçırma!</h2>
                    <p className="text-gray-600 mb-6">En yeni ürünler ve kampanyalardan haberdar ol</p>
                    <div className="max-w-md mx-auto flex gap-4">
                      <input
                        type="email"
                        placeholder="E-posta adresiniz"
                        className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                      />
                      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Abone Ol
                      </button>
                    </div>
                  </div>
                </section>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

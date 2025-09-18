import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useCart } from './hooks/useCart';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mukhi: [],
    priceRange: [0, 5000],
    category: []
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  
  
  const {
    cart,
    setCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal
  } = useCart();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'products':
        return (
          <ProductsPage 
            searchTerm={searchTerm}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            addToCart={addToCart}
          />
        );
      case 'cart':
        return (
          <CartPage 
            cart={cart}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            getCartTotal={getCartTotal}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'checkout':
        return (
        <CheckoutPage
  cart={cart}
  getCartTotal={getCartTotal}
  setCart={setCart} // now works
  setCurrentPage={setCurrentPage}
/>

        );
      case 'login':
        return <LoginPage setUser={setUser} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} setCurrentPage={setCurrentPage} />;
      default:
        if (currentPage.startsWith('product-')) {
          const productId = currentPage.split('-')[1];
          return <ProductDetailPage productId={productId} addToCart={addToCart} />;
        }
        return <HomePage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
    }
  };

  return (
    <div className="App">
      <Header 
        cart={cart}
        setCurrentPage={setCurrentPage}
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
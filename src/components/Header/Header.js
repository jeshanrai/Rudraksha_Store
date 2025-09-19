import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, cart, searchTerm, setSearchTerm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();   // 👈 track current route

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/products');
    }
  };

  // Scroll to About
  const handleAboutClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "about" } });
    } else {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Scroll to Top
  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "top" } });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="logo">
            🕉️ Sacred Rudraksha
          </Link>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <button className="nav-link" onClick={handleHomeClick}>Home</button>
          <button className="nav-link" onClick={handleAboutClick}>About</button>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>

        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              className="search-input"
            />
            <Search className="search-icon" />
          </div>
          <button className="icon-btn" aria-label="Wishlist">
            <Heart className="h-6 w-6" />
          </button>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Shopping cart">
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          <Link 
            to={user ? '/profile' : '/login'} 
            className="icon-btn"
            aria-label={user ? 'Profile' : 'Login'}
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, cart, searchTerm, setSearchTerm } = useApp();
  const navigate = useNavigate();
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/products');
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
         <Link to="/" className="nav-link">Home</Link>
          <a href="/products" className="nav-link">Products</a>
          <a href="#newsletter" className="nav-link">About</a>

          <a href="#" className="nav-link">Contact</a>
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
              <span className="cart-badge">
                {cartItemsCount}
              </span>
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
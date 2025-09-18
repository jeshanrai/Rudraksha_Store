import React, { useState } from 'react';
import { ShoppingCart, User, Search, Heart, Menu } from 'lucide-react';
import './Header.css';

const Header = ({ cart, setCurrentPage, user, searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="logo" onClick={() => setCurrentPage('home')}>
            🕉️ Sacred Rudraksha
          </div>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#" onClick={() => setCurrentPage('home')} className="nav-link">Home</a>
          <a href="#" onClick={() => setCurrentPage('products')} className="nav-link">Products</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>

        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" />
          </div>
          <button className="icon-btn">
            <Heart className="h-6 w-6" />
          </button>
          <button onClick={() => setCurrentPage('cart')} className="icon-btn cart-btn">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          <button onClick={() => setCurrentPage(user ? 'profile' : 'login')} className="icon-btn">
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
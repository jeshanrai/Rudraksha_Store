import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, cart, searchTerm, setSearchTerm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/products');
    }
  };

  const handleAboutClick = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'about' } });
    } else {
      const aboutSection = document.getElementById('about');
      if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'top' } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Left */}
        <div className="header-left">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
          </button>
          <Link to="/" className="logo">
            🕉️ Sacred Rudraksha
          </Link>
        </div>

        {/* Nav */}
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={handleHomeClick}>Home</button>
          <button className="nav-link" onClick={handleAboutClick}>About</button>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>

        {/* Right */}
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              className="search-input"
            />
          </div>

          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Heart className="icon" />
          </Link>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Shopping cart">
            <ShoppingCart className="icon" />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          <Link 
            to={user ? '/profile' : '/login'} 
            className="icon-btn"
            aria-label={user ? 'Profile' : 'Login'}
          >
            <User className="icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, cart, wishlist, searchTerm, setSearchTerm } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist?.length || 0; // ✅ wishlist item count

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
        {/* Left Section */}

<div className="header-left">
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="mobile-menu-btn"
    aria-label="Toggle menu"
  >
    {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
  </button>

  <Link to="/" className="logo">
    <img src="./images/logo.png" alt="Sacred Rudraksha Logo" className="logo-img" />
    <span>Neplai Rudraksha</span>
  </Link>
</div>


        {/* Navigation */}
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={handleHomeClick}>Home</button>
          <button className="nav-link" onClick={handleAboutClick}>About</button>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search sacred items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              className="search-input"
            />
          </div>

          {/* ✅ Wishlist with count badge */}
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <Heart className="icon" />
            {wishlistCount > 0 && (
              <span className="cart-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart with count badge */}
          <Link to="/cart" className="icon-btn-cart-btn" aria-label="Shopping cart">
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

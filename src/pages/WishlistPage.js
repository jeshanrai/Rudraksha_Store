import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Notification from '../components/Notification';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useApp();
  const [notification, setNotification] = useState(null);

  const handleMoveToCart = (product) => {
    addToCart(product, 1); // add to cart
    removeFromWishlist(product._id); // remove from wishlist

    // Show notification
    setNotification({
      message: `${product.name} added to cart!`,
      type: 'success'
    });
  };

  const handleCloseNotification = () => setNotification(null);

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>💔 Your Wishlist is Empty</h2>
        <p>Browse our products and save your favorites for later.</p>
        <Link to="/products" className="browse-btn">
          Browse Products
        </Link>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h2 className="wishlist-title">My Wishlist ❤️</h2>
        <button className="clear-wishlist-btn" onClick={clearWishlist}>
          Clear Wishlist
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-card">
            <div className="wishlist-image-wrapper">
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                className="wishlist-image"
                loading="lazy"
              />
            </div>

            <div className="wishlist-info">
              <h3 className="wishlist-product-name">{product.name}</h3>
              <p className="wishlist-price">
                ₹{product.sellingPrice}
                {product.discountRate > 0 && (
                  <span className="wishlist-discount">
                    &nbsp;({product.discountRate}% OFF)
                  </span>
                )}
              </p>

              <div className="wishlist-actions">
                <Link
                  to={`/product/${product._id}`}
                  state={{ product }}
                  className="wishlist-btn view-btn"
                  aria-label="View Product"
                >
                  <Eye className="icon" />
                  View
                </Link>

                <button
                  className="wishlist-btn move-to-cart-btn"
                  onClick={() => handleMoveToCart(product)}
                >
                  🛒 Move to Cart
                </button>

                <button
                  className="wishlist-btn remove-btn"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <Trash className="icon" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default WishlistPage;

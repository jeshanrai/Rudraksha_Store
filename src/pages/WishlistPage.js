import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCart } from '../hooks/useCart';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useApp();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your wishlist is empty!</h2>
        <Link to="/products" className="btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>

      <button className="clear-wishlist-btn" onClick={clearWishlist}>
        Clear Wishlist
      </button>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-card">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.name}
              className="wishlist-image"
            />

            <div className="wishlist-info">
              <h3>{product.name}</h3>
              <p>Price: ₹{product.sellingPrice}</p>
              {product.discountRate > 0 && (
                <p>Discount: {product.discountRate}% OFF</p>
              )}

              <div className="wishlist-actions">
                <Link
                  to={`/product/${product._id}`}
                  state={{ product }}
                  className="view-btn"
                  aria-label="View Product"
                >
                  <Eye className="h-5 w-5" />
                </Link>

                <button
                  className="move-to-cart-btn"
                  onClick={() => handleMoveToCart(product)}
                >
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

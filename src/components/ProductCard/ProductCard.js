import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();

  // ✅ Handle image (supports base64, data:image, or URL)
  const getImageSrc = () => {
    if (!product.image) return '/placeholder.jpg';

    // Already a complete data URL
    if (product.image.startsWith('data:image')) {
      return product.image;
    }

    // Raw base64 without prefix
    if (/^[A-Za-z0-9+/=]+$/.test(product.image.trim())) {
      return `data:image/jpeg;base64,${product.image}`;
    }

    // If it's a hosted image
    if (product.image.startsWith('http')) return product.image;

    return '/placeholder.jpg';
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  // ✅ Calculate discount percentage
  const getDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div
      className={`product-card ${viewMode === 'list' ? 'product-card-list' : ''}`}
      onClick={handleViewDetails}
      style={{ cursor: 'pointer' }}
    >
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={getImageSrc()}
          alt={product.name}
          className={`product-image ${viewMode === 'list' ? 'product-image-list' : ''}`}
          loading="lazy"
        />

        {/* Discount Badge */}
        {getDiscount() > 0 && (
          <span className="discount-badge">{getDiscount()}% OFF</span>
        )}

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
        >
          <Heart className="wishlist-icon" />
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star ${i < Math.floor(product.rating || 0) ? 'star-filled' : ''}`}
              />
            ))}
          </div>
          <span className="review-count">({product.reviews || 0} reviews)</span>
        </div>

        {/* Description (only in list view) */}
        {viewMode === 'list' && (
          <p className="product-description">{product.description}</p>
        )}

        {/* Price + Actions */}
        <div className="product-footer">
          <div className="price-container">
            <span className="price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount-text">({getDiscount()}% OFF)</span>
              </>
            )}
          </div>

          <div className="product-actions" onClick={(e) => e.stopPropagation()}>
            <Link
              to={`/product/${product._id}`}
              state={{ product }}
              className="view-btn"
              aria-label="View product details"
            >
              <Eye className="action-icon" />
            </Link>

            <button
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Low Stock Warning */}
        {product.stock < 10 && (
          <p className="low-stock">Only {product.stock} left in stock!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

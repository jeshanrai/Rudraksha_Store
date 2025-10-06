import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();

  // ✅ Handle image (array, base64, or URL)
  const getImageSrc = () => {
    if (!product.images || product.images.length === 0) return '/placeholder.jpg';
    const image = product.images[0];

    if (image.startsWith('data:image')) return image;
    if (/^[A-Za-z0-9+/=]+$/.test(image.trim())) return `data:image/jpeg;base64,${image}`;
    if (image.startsWith('http')) return image;

    return '/placeholder.jpg';
  };

  // ✅ Base values
  const originalPrice = product.sellingPrice || product.price || 0;
  const discountRate = product.discountRate || 0;

  // ✅ Calculate discounted price
  const discountedPrice =
    discountRate > 0 ? Math.round(originalPrice - (originalPrice * discountRate) / 100) : originalPrice;

  // ✅ Discount display
  const getDiscount = () => discountRate;

  // ✅ Wishlist handler
  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`, { state: { product } });
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
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
        >
          <Heart className="wishlist-icon" fill={isInWishlist ? 'red' : 'none'} />
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
            <span className="price">₹{discountedPrice}</span>
            {discountRate > 0 && (
              <>
                <span className="original-price">₹{originalPrice}</span>
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
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Stock Info */}
        {product.stock === 0 ? (
          <p className="out-of-stock">Out of Stock</p>
        ) : product.stock < 10 ? (
          <p className="low-stock">Only {product.stock} left in stock!</p>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;

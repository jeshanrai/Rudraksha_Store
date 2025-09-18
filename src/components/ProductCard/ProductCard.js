
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useApp();

  return (
    <div className={`product-card ${viewMode === 'list' ? 'product-card-list' : ''}`}>
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className={`product-image ${viewMode === 'list' ? 'product-image-list' : ''}`}
          loading="lazy"
        />
        {product.originalPrice > product.price && (
          <span className="discount-badge">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        )}
        <button className="wishlist-btn" aria-label="Add to wishlist">
          <Heart className="wishlist-icon" />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`star ${i < Math.floor(product.rating) ? 'star-filled' : ''}`} 
              />
            ))}
          </div>
          <span className="review-count">({product.reviews} reviews)</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="price-container">
            <span className="price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>
          <div className="product-actions">
            <Link 
              to={`/product/${product.id}`}
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
        {product.stock < 10 && (
          <p className="low-stock">Only {product.stock} left in stock!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
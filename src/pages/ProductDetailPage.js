// src/pages/ProductDetailPage.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Plus, Minus } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApp } from '../context/AppContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { products, isLoading, addToCart } = useApp();
  
  const product = products.find(p => p.id === parseInt(id));
  const relatedProducts = products.filter(p => p.id !== product?.id && p.mukhi === product?.mukhi).slice(0, 3);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Product not found</h2>
          <Link to="/products" className="primary-btn">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="product-detail-image"
                loading="eager"
              />
            </div>
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-btn ${selectedImage === index ? 'thumbnail-btn-active' : ''}`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" className="thumbnail-image" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-detail-name">{product.name}</h1>
            
            <div className="product-rating">
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

            <div className="product-pricing">
              <span className="product-price">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="product-original-price">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="product-description-section">
              <h3 className="section-heading">Description</h3>
              <p className="product-detail-description">{product.description}</p>
            </div>

            <div className="product-benefits">
              <h3 className="section-heading">Benefits</h3>
              <p className="product-benefits-text">{product.benefits}</p>
            </div>

            <div className="product-stock">
              <h3 className="section-heading">Stock Status</h3>
              <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus className="quantity-icon" />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  <Plus className="quantity-icon" />
                </button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="add-to-cart-btn-large"
              >
                Add to Cart
              </button>
              <button className="wishlist-btn-large" aria-label="Add to wishlist">
                <Heart className="wishlist-icon-large" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="section-heading">Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
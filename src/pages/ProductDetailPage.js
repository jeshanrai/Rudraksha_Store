// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Star, Heart, Plus, Minus } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApp } from '../context/AppContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(!product);
  const { addToCart } = useApp();

  // Convert base64 to valid image URL
  const getImageSrc = (image) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  // Fetch product if not passed via state
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (product) return; // Already loaded via router state

      try {
        setIsLoading(true);
        const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!productRes.ok) throw new Error('Failed to fetch product');
        const productData = await productRes.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, product]);

  // Fetch related products when product is loaded
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.mukhi) return;

      try {
        const relatedRes = await fetch(
          `http://localhost:5000/api/products?mukhi=${product.mukhi}`
        );
        const relatedData = await relatedRes.json();
        const filtered = relatedData
          .filter((p) => p._id !== product._id)
          .slice(0, 3);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // ================== LOADING & NOT FOUND ==================
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

  // ================== MAIN RETURN ==================
  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  product.images?.length
                    ? getImageSrc(product.images[selectedImage])
                    : getImageSrc(product.image)
                }
                alt={product.name}
                className="product-detail-image"
                loading="eager"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail-btn ${
                      selectedImage === index ? 'thumbnail-btn-active' : ''
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={getImageSrc(img)}
                      alt=""
                      className="thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star ${
                      i < Math.floor(product.rating || 0) ? 'star-filled' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="review-count">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <span className="product-price">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="product-original-price">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <div className="product-description-section">
              <h3 className="section-heading">Description</h3>
              <p className="product-detail-description">
                {product.description}
              </p>
            </div>

            {product.benefits && (
              <div className="product-benefits">
                <h3 className="section-heading">Benefits</h3>
                <p className="product-benefits-text">{product.benefits}</p>
              </div>
            )}

            <div className="product-stock">
              <h3 className="section-heading">Stock Status</h3>
              <span
                className={`stock-badge ${
                  product.stock > 10 ? 'in-stock' : 'low-stock'
                }`}
              >
                {product.stock > 10
                  ? 'In Stock'
                  : `Only ${product.stock} left`}
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

              <button
                className="wishlist-btn-large"
                aria-label="Add to wishlist"
              >
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
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

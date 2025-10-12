import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Star, Heart, Plus, Minus } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApp } from '../context/AppContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(!product);
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useApp();

  const getImageSrc = (image) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (product) return;
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, product]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.mukhi) return;
      try {
        const res = await fetch(`http://localhost:5000/api/products?mukhi=${product.mukhi}`);
        const data = await res.json();
        setRelatedProducts(data.filter((p) => p._id !== product._id).slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [product]);

  if (isLoading) return <LoadingSpinner />;
  if (!product)
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="primary-btn">Back to Products</Link>
      </div>
    );

  const isInWishlist = wishlist?.some((item) => item._id === product._id);
  const handleWishlistToggle = () => {
    if (isInWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="detail-grid">
          {/* IMAGE SECTION */}
          <div className="detail-image-section">
            <div className="main-image-box">
              <img
                src={getImageSrc(product.images?.[selectedImage] || product.image)}
                alt={product.name}
                className="main-product-image"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`thumb-btn ${selectedImage === i ? 'active' : ''}`}
                  >
                    <img src={getImageSrc(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO SECTION */}
          <div className="detail-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="rating-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`star ${i < (product.rating || 0) ? 'filled' : ''}`} />
              ))}
              <span className="reviews-count">({product.reviews || 0} reviews)</span>
            </div>

            <div className="price-section">
              <span className="price">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="old-price">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="description-block">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.benefits && (
              <div className="benefits-block">
                <h3>Benefits</h3>
                <p>{product.benefits}</p>
              </div>
            )}

            <div className="stock-block">
              <h3>Stock Status</h3>
              <span
                className={`stock-badge ${
                  product.stock > 10 ? 'in-stock' : 'low-stock'
                }`}
              >
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            <div className="actions-row">
              <div className="quantity-box">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus />
                </button>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => addToCart(product, quantity)}
              >
                Add to Cart
              </button>

              <button
                className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <Heart fill={isInWishlist ? 'red' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-grid">
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

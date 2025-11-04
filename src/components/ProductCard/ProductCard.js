import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./ProductCard.css";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();

  const getImageSrc = () => {
    if (!product.images || product.images.length === 0) return "/placeholder.jpg";
    const image = product.images[0];
    if (image.startsWith("data:image")) return image;
    if (/^[A-Za-z0-9+/=]+$/.test(image.trim()))
      return `data:image/jpeg;base64,${image}`;
    if (image.startsWith("http")) return image;
    return "/placeholder.jpg";
  };

  const originalPrice = product.sellingPrice || product.price || 0;
  const discountRate = product.discountRate || 0;
  const discountedPrice =
    discountRate > 0
      ? Math.round(originalPrice - (originalPrice * discountRate) / 100)
      : originalPrice;

  const isInWishlist = wishlist?.some((item) => item._id === product._id);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const openProduct = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div
      className={`modern-card enhanced ${viewMode === "list" ? "list-mode" : ""}`}
      onClick={openProduct}
    >
      <div className="modern-card-image-container">
        <img
          src={getImageSrc()}
          alt={product.name}
          className="modern-card-image"
          loading="lazy"
        />

        {discountRate > 0 && (
          <span className="modern-discount-badge premium-discount">
            {discountRate}% OFF
          </span>
        )}

        <button
          className={`modern-wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
        >
          <Heart size={20} fill={isInWishlist ? "red" : "none"} />
        </button>
      </div>

      <div className="modern-card-body">
        <h3 className="modern-product-name">{product.name}</h3>

        {viewMode === "list" && (
          <p className="modern-description">{product.description}</p>
        )}

        <div className="modern-price-section">
          <span className="price">₹{discountedPrice}</span>
          {discountRate > 0 && (
            <span className="old-price">₹{originalPrice}</span>
          )}
        </div>

        <div className="modern-actions enhanced-actions">
          <Link
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product._id}`, { state: { product } });
            }}
            className="eye-button-modern enhanced-eye"
          >
            <Eye size={18} />
          </Link>

          <button
            className="cart-btn enhanced-cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="cart-icon" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="stock-warning">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

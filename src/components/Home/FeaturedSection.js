import React, { useEffect, useState, useRef } from "react";
import { useNavigate,Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import "../../pages/homepage.css";
import "./featuredSection.css";

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts([...data, ...data]); // duplicated for continuous slider
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // ✅ Auto sliding
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const speed = 1.2;

    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        slider.scrollLeft += speed;
        if (slider.scrollLeft >= slider.scrollWidth / 2) slider.scrollLeft = 0;
      }, 20);
    };

    const stopAutoSlide = () => clearInterval(intervalRef.current);

    startAutoSlide();
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    return () => {
      stopAutoSlide();
      slider.removeEventListener("mouseenter", stopAutoSlide);
      slider.removeEventListener("mouseleave", startAutoSlide);
    };
  }, [products]);

  // ✅ Drag to scroll
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const handleMouseUp = () => (isDown.current = false);
  const handleMouseLeave = () => (isDown.current = false);
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scrollLeftBtn = () => (sliderRef.current.scrollLeft -= 300);
  const scrollRightBtn = () => (sliderRef.current.scrollLeft += 300);

  return (
    <section className="featured-section">
      <div className="container">
        <h2 className="section-title gradient-text">Our Collection</h2>

        <div className="slider-wrapper">
          <button className="slider-arrow glass left" onClick={scrollLeftBtn}>
            <ChevronLeft size={28} />
          </button>

          <div
            className="products-slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="slider-card skeleton"></div>
                  ))
              : products.map((product, index) => {
                  const price = Number(product.price) || 0;
                  const discount =
                    product.discount && !isNaN(product.discount)
                      ? Number(product.discount)
                      : 0;
                  const discountedPrice =
                    discount > 0
                      ? (price * (1 - discount / 100)).toFixed(2)
                      : price.toFixed(2);
                  const stockAvailable =
                    product.stock && Number(product.stock) > 0;

                  // ✅ Function to view product (same logic as ProductCard)
                  const handleViewProduct = () => {
                    navigate(`/product/${product._id || product.id}`, {
                      state: { product },
                    });
                  };

                  return (
                    <div key={index} className="slider-card">
                      <div className="modern-card">
                        <div className="image-container-modern">
                          <img
                            src={
                              Array.isArray(product.images) &&
                              product.images.length > 0
                                ? product.images[0]
                                : "/placeholder.jpg"
                            }
                            alt={product.name}
                            className="product-image-modern"
                          />

                          {discount > 0 && (
                            <span className="discount-badge-modern">
                              -{discount}% OFF
                            </span>
                          )}

                          {/* ✅ Working eye button */}
                          <button
                            className="eye-button-modern-featured"
                            title="View Product"
                            onClick={handleViewProduct}
                          >
                            <Eye size={18} />
                          </button>
                        </div>

                        <div className="product-info-modern">
                          <h3 className="product-name-modern">
                            {product.name}
                          </h3>

                          <p
                            className={`availability ${
                              stockAvailable ? "in-stock" : "out-of-stock"
                            }`}
                          >
                            {stockAvailable
                              ? `In Stock (${product.stock} available)`
                              : "Out of Stock"}
                          </p>

                       <div className="price-row-modern">
  {product.discountRate > 0 ? (
    <>
      <span className="product-price gradient-text">
        ₹{Math.round(
          product.sellingPrice -
            (product.sellingPrice * product.discountRate) / 100
        )}
      </span>
      <span className="old-price-modern">
        ₹{product.sellingPrice}
      </span>
    </>
  ) : (
    <span className="product-price">
      ₹{product.sellingPrice}
    </span>
  )}
</div>

                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          <button className="slider-arrow glass right" onClick={scrollRightBtn}>
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="text-center mt-5">
          <Link to="/products" className="primary-btn luxury-btn">
            Explore Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;

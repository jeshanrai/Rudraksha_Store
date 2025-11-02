import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import "../../pages/homepage.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);

  // ✅ Fetch ALL products
  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      // ✅ Duplicate products to create infinite loop effect
      setProducts([...data, ...data]);
    };
    getProducts();
  }, []);

  // ✅ Auto-slide
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const speed = 1.2;

    const autoSlide = setInterval(() => {
      slider.scrollLeft += speed;

      // ✅ Create loop effect
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(autoSlide);
  }, [products]);

  // ✅ Drag scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  const mouseDown = (e) => {
    isDown = true;
    startX = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft = sliderRef.current.scrollLeft;
  };

  const mouseUp = () => (isDown = false);
  const mouseLeave = () => (isDown = false);

  const mouseMove = (e) => {
    if (!isDown) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // ✅ Manual Arrows
  const scrollLeftBtn = () => {
    sliderRef.current.scrollLeft -= 300;
  };

  const scrollRightBtn = () => {
    sliderRef.current.scrollLeft += 300;
  };

  return (
    <section className="featured-section">
      <div className="container">
        <h2 className="section-title">All Products</h2>

        <div className="slider-wrapper">

          {/* ✅ Left Arrow */}
          <button className="slider-arrow left" onClick={scrollLeftBtn}>
            <ChevronLeft size={30} />
          </button>

          {/* ✅ Slider */}
          <div
            className="products-slider"
            ref={sliderRef}
            onMouseDown={mouseDown}
            onMouseLeave={mouseLeave}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
          >
            {products.map((product, index) => (
              <div key={index} className="slider-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* ✅ Right Arrow */}
          <button className="slider-arrow right" onClick={scrollRightBtn}>
            <ChevronRight size={30} />
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/products" className="primary-btn">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;

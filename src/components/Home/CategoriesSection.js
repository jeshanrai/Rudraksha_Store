import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriesSection.css";

const mukhiData = Array.from({ length: 21 }, (_, i) => i + 1)
  .filter((num) => num !== 1)
  .map((num) => ({
    mukhi: num,
    name: `${num} Mukhi`,
    description: `Description for ${num} Mukhi`,
    image: `/rudraksha_image/${num}mukhi.png`,
  }));

const CategoriesSection = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const isVisible = useRef(false);

  const dragData = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const duplicatedList = [...mukhiData, ...mukhiData]; // for infinite scroll

  // Intersection Observer + mobile fallback
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    const sectionEl = sectionRef.current;
    observer.observe(sectionEl);

    if (window.innerWidth < 768) {
      isVisible.current = true;
    }

    return () => observer.disconnect();
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    const carousel = carouselRef.current;
    const rect = carousel.getBoundingClientRect();
    dragData.current.isDragging = true;
    dragData.current.startX = e.pageX - rect.left;
    dragData.current.scrollLeft = carousel.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!dragData.current.isDragging) return;
    e.preventDefault();
    const carousel = carouselRef.current;
    const rect = carousel.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const walk = (x - dragData.current.startX) * 2; // speed
    carousel.scrollLeft = dragData.current.scrollLeft - walk;
  };

  const stopDragging = () => {
    dragData.current.isDragging = false;
  };

  // Touch drag handlers
  const handleTouchStart = (e) => {
    const carousel = carouselRef.current;
    const rect = carousel.getBoundingClientRect();
    dragData.current.isDragging = true;
    dragData.current.startX = e.touches[0].pageX - rect.left;
    dragData.current.scrollLeft = carousel.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!dragData.current.isDragging) return;
    e.preventDefault();
    const carousel = carouselRef.current;
    const rect = carousel.getBoundingClientRect();
    const x = e.touches[0].pageX - rect.left;
    const walk = (x - dragData.current.startX) * 2;
    carousel.scrollLeft = dragData.current.scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    dragData.current.isDragging = false;
  };

  // Auto-slide infinite loop
  useEffect(() => {
    const carousel = carouselRef.current;
    let reqId;

    const autoSlide = () => {
      if (
        !dragData.current.isDragging &&
        document.visibilityState === "visible" &&
        isVisible.current
      ) {
        carousel.scrollLeft += 1.2; // adjust speed

        // Reset for infinite scroll
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      reqId = requestAnimationFrame(autoSlide);
    };

    reqId = requestAnimationFrame(autoSlide);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        reqId = requestAnimationFrame(autoSlide);
      } else {
        cancelAnimationFrame(reqId);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(reqId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <section className="categories-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Shop By Mukhi</h2>

        <div
          className="categories-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {duplicatedList.map((item, index) => (
            <div
              key={index}
              className="mukhi-card"
              onClick={() => navigate(`/mukhi/${item.mukhi}`)}
            >
              <div className="mukhi-title">
                {item.mukhi} Mukhi Nepali Rudraksha
              </div>
              <div className="mukhi-image-wrapper">
                <img src={item.image} alt={item.name} className="mukhi-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

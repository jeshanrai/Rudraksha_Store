import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/homepage.css";

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

  // ✅ Intersection Observer → Pause when user scrolls away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Mouse drag handlers
  const handleMouseDown = (e) => {
    const carousel = carouselRef.current;
    dragData.current.isDragging = true;
    dragData.current.startX = e.pageX - carousel.offsetLeft;
    dragData.current.scrollLeft = carousel.scrollLeft;
  };

  const stopDragging = () => {
    dragData.current.isDragging = false;
  };

  const handleMouseMove = (e) => {
    if (!dragData.current.isDragging) return;
    e.preventDefault();

    const carousel = carouselRef.current;
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - dragData.current.startX) * 2;
    carousel.scrollLeft = dragData.current.scrollLeft - walk;
  };

  // ✅ Optimized Auto Slide
  useEffect(() => {
    const carousel = carouselRef.current;
    let reqId;

    const autoSlide = () => {
      // ✅ Pause conditions
      if (
        !dragData.current.isDragging &&
        document.visibilityState === "visible" &&
        isVisible.current
      ) {
        carousel.scrollLeft += 2;

        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }

      reqId = requestAnimationFrame(autoSlide);
    };

    reqId = requestAnimationFrame(autoSlide);
    return () => cancelAnimationFrame(reqId);
  }, []);

  // ✅ Infinite loop data
  const duplicatedList = [...mukhiData, ...mukhiData];

  return (
    <section className="categories-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Shop By Mukhi</h2>

        <div
          className="categories-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={stopDragging}
          onMouseUp={stopDragging}
          onMouseMove={handleMouseMove}
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="mukhi-img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

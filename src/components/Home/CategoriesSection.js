import React, { useRef, useEffect } from "react";
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

  let isDragging = false;
  let startX;
  let scrollLeft;

  // ✅ Mouse Drag
  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - carouselRef.current.getBoundingClientRect().left;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging = false;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.getBoundingClientRect().left;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // ✅ Automatic Sliding
  useEffect(() => {
    const carousel = carouselRef.current;
    let requestId;

    const slide = () => {
      if (!isDragging) {
        carousel.scrollLeft += 3;
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      requestId = requestAnimationFrame(slide);
    };

    requestId = requestAnimationFrame(slide);
    return () => cancelAnimationFrame(requestId);
  }, []);

  // ✅ Duplicate mukhi list
  const duplicatedData = mukhiData.concat(mukhiData);

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Shop by Mukhi</h2>

        <div
          className="categories-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {duplicatedData.map((item, index) => (
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

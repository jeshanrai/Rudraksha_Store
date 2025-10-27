import React, { useRef, useEffect } from 'react';
import '../../pages/homepage.css';

const mukhiData = Array.from({ length: 24 }, (_, i) => ({
  mukhi: i + 1,
  name: `${i + 1} Mukhi`,
  description: `Description for ${i + 1} Mukhi`,
  image: `/images/${i + 1}-mukhi.png`,
}));

const CategoriesSection = () => {
  const carouselRef = useRef(null);
  let isDragging = false;
  let startX;
  let scrollLeft;

  // ----- Mouse Drag Handlers -----
  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - carouselRef.current.getBoundingClientRect().left;
    scrollLeft = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { isDragging = false; };
  const handleMouseUp = () => { isDragging = false; };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.getBoundingClientRect().left;
    const walk = (x - startX) * 2; // scroll speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // ----- Automatic Sliding -----
  useEffect(() => {
    const carousel = carouselRef.current;
    let requestId;

    const slide = () => {
      if (!isDragging) {
        carousel.scrollLeft += 1; // pixels per frame
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0; // reset for infinite loop
        }
      }
      requestId = requestAnimationFrame(slide);
    };

    requestId = requestAnimationFrame(slide);

    return () => cancelAnimationFrame(requestId);
  }, []);

  const duplicatedData = mukhiData.concat(mukhiData); // for infinite loop

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
            <div key={index} className="category-card">
              <div className="category-icon">
                <img src={item.image} alt={item.name} className="mukhi-image" />
              </div>
              <h3 className="category-name">{item.name}</h3>
              <p className="category-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

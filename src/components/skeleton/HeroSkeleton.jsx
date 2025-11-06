import React from 'react';
import './HeroSkeleton.css';
const HeroSectionSkeleton = () => (
  <section className="hero-section">
    <div className="container-SKELETON">
      <div className="hero-grid">

        {/* LEFT SIDE */}
        <div>
          <div className="skeleton skeleton-title"></div>

          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>

          <div className="hero-actions">
            <div className="skeleton skeleton-btn"></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-image">
          <div className="skeleton skeleton-image"></div>
        </div>

      </div>
    </div>
  </section>
);

export default HeroSectionSkeleton;

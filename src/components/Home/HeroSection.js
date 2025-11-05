import React from 'react';
import { Link } from 'react-router-dom';
// Example: HeroSection.js
import '../../pages/homepage.css';


const HeroSection = () => (
  <section className="hero-section">
    <div className="container">
      <div className="hero-grid">
        <div>
          <h1 className="hero-title">
            Discover the Power of
            <span className="hero-title-accent">Sacred Rudraksha</span>
          </h1>
          <p className="hero-description">
            Authentic, certified Rudraksha beads for spiritual growth, meditation, and positive energy. Each bead is carefully selected and blessed.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="primary-btn">
              Shop Collection
            </Link>
           <Link to="/learn-more" className="secondary-btn">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/images/cover.png" 
            alt="Sacred Rudraksha Beads" 
            className="hero-img"
            loading="eager"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

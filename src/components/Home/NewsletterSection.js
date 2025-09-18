import React from 'react';
// Example: HeroSection.js
import '../../pages/homepage.css';


const NewsletterSection = () => (
  <section id="newsletter" className="newsletter-section">
    <div className="container">
      <h2 className="newsletter-title">Stay Connected</h2>
      <p className="newsletter-description">
        Subscribe to our newsletter for spiritual insights, new product launches, and exclusive offers.
      </p>
      <div className="newsletter-form">
        <input
          type="email"
          placeholder="Enter your email"
          className="newsletter-input"
        />
        <button className="newsletter-btn">
          Subscribe
        </button>
      </div>
    </div>
  </section>
);

export default NewsletterSection;

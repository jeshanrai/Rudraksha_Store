import React from 'react';
import { Star } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { mockProducts, mockTestimonials } from '../data/mockData';
import './homepage.css';
const HomePage = ({ setCurrentPage, addToCart }) => {
  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 3);

  const handleViewProduct = (productId) => {
    setCurrentPage('product-' + productId);
  };

  return (
    <div>
      {/* Hero Section */}
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
                <button onClick={() => setCurrentPage('products')} className="primary-btn">
                  Shop Collection
                </button>
                <button className="secondary-btn">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img src="/api/placeholder/500/500" alt="Sacred Rudraksha" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Mukhi</h2>
          <div className="categories-grid">
            {[1, 5, 6, 7, 11, 14].map(mukhi => (
              <div key={mukhi} className="category-card">
                <div className="category-icon">🔮</div>
                <h3 className="category-name">{mukhi} Mukhi</h3>
                <p className="category-description">
                  {mukhi === 1 ? "Supreme Power" : 
                   mukhi === 5 ? "Mental Clarity" :
                   mukhi === 6 ? "Focus & Will" :
                   mukhi === 7 ? "Wealth & Fortune" :
                   mukhi === 11 ? "Divine Wisdom" : "Protection"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onView={handleViewProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => setCurrentPage('products')} className="primary-btn">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {mockTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`star ${i < testimonial.rating ? 'star-filled' : ''}`} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
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
    </div>
  );
};

export default HomePage;
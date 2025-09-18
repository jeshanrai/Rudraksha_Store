import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
// Example: HeroSection.js
import '../../pages/homepage.css';


const FeaturedSection = ({ featuredProducts }) => (
  <section className="featured-section">
    <div className="container">
      <h2 className="section-title">Featured Products</h2>
      <div className="products-grid">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="text-center">
        <Link to="/products" className="primary-btn">
          View All Products
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturedSection;

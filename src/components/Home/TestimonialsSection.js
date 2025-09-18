import React from 'react';
import { Star } from 'lucide-react';
import { mockTestimonials } from '../../data/mockData';// Example: HeroSection.js
import '../../pages/homepage.css';


const TestimonialsSection = () => (
  <section className="testimonials-section">
    <div className="container">
      <h2 className="section-title">What Our Customers Say</h2>
      <div className="testimonials-grid">
        {mockTestimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`star ${i < testimonial.rating ? 'star-filled' : ''}`} 
                />
              ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <p className="testimonial-author">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

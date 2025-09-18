import React from 'react';
import '../../pages/homepage.css';

const CategoriesSection = () => (
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
);

export default CategoriesSection;

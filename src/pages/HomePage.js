import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import FeaturedSection from '../components/Home/FeaturedSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import About from './About';
import BodySection from '../components/Home/BodySection';
import FaqSection from '../components/Home/FaqSection';

const HomePage = () => {
  const { products, isLoading } = useApp();
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "about") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        setTimeout(() => aboutSection.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else if (location.state?.scrollTo === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <BodySection />
      <FeaturedSection featuredProducts={featuredProducts} />
      <TestimonialsSection />
      <FaqSection />
      <div id="about">
        <About />
      </div>
    </div>
  );
};

export default HomePage;

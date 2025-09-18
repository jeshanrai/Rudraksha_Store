import React from 'react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import FeaturedSection from '../components/Home/FeaturedSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import About from './About';

const HomePage = () => {
  const { products, isLoading } = useApp();
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection featuredProducts={featuredProducts} />
      <TestimonialsSection />
      <About />
    </div>
  );
};

export default HomePage;

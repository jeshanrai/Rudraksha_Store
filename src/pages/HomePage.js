import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

import LoadingSpinner from '../components/common/LoadingSpinner';
import HeroSection from '../components/Home/HeroSection';
import HeroSkeleton from '../components/skeleton/HeroSkeleton';

import CategoriesSection from '../components/Home/CategoriesSection';
import FeaturedSection from '../components/Home/FeaturedSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import About from './About';
import BodySection from '../components/Home/BodySection';
import FaqSection from '../components/Home/FaqSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import NewsletterSection from '../components/Home/NewsletterSection';

import Notification from '../components/Notification';
import './homepage.css';

const HomePage = () => {
  const { products, isLoading } = useApp();
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const location = useLocation();

  // ✅ Notification state
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  // ✅ Trigger Notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
  };

  // ✅ Close Notification
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // ✅ Scroll Logic
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

  return (
    <div>
      {/* ✅ Global Notification */}
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      {/* ✅ Show skeleton + spinner overlay when loading */}
      {isLoading ? (
        <div className="loading-wrapper">
          <HeroSkeleton /> 
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <HeroSection />
          <CategoriesSection />
          <BodySection />
          <FeaturedSection featuredProducts={featuredProducts} />
          <TestimonialsSection />
          <FaqSection />
          <NewsletterSection showNotification={showNotification} />

          <div id="about">
            <About />
            <FeaturesSection />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

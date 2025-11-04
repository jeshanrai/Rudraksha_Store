import React, { useState } from 'react';
import '../../pages/homepage.css';

const NewsletterSection = ({ showNotification }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      showNotification("Please enter a valid email!", "error");
      return;
    }

    showNotification("Subscribed successfully! ✅", "success");
    setEmail("");
  };

  return (
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="newsletter-btn" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

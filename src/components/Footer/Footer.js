import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">🕉️ Sacred Rudraksha</div>
            <p className="footer-description">
              Authentic Rudraksha beads for spiritual growth and positive energy. 
              Each bead is carefully selected and blessed for maximum benefit.
            </p>
            <div className="social-icons">
              <Facebook className="social-icon" />
              <Instagram className="social-icon" />
              <Twitter className="social-icon" />
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Products</a></li>
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Categories</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">5 Mukhi</a></li>
              <li><a href="#" className="footer-link">6 Mukhi</a></li>
              <li><a href="#" className="footer-link">7 Mukhi</a></li>
              <li><a href="#" className="footer-link">Rare Beads</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="contact-icon" />
                <span>info@sacredrudraksha.com</span>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" />
                <span>+977 9860149199</span>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Sacred Rudraksha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
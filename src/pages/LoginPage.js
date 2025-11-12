// src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
// import BirdImage from '../assets/bird-illustration.png'; // ✅ Use your illustration here

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else navigate('/profile', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const email = formData.email.toLowerCase().trim();
      const password = formData.password.trim();

      const { success, user: loggedInUser, error: loginError } = await login(email, password);

      if (success) {
        if (loggedInUser.role === 'admin') navigate('/admin/dashboard', { replace: true });
        else navigate('/profile', { replace: true });
      } else {
        setError(loginError || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 const slides = [
  {
    image: "/images/cover.png",
    title: "Authentic Rudraksha Beads",
    text: "Explore premium quality Rudraksha for spiritual and wellness benefits."
  },
  {
    image: "/images/learnmore1.png",
    title: "Handcrafted Collections",
    text: "Discover unique Rudraksha malas and accessories crafted with care."
  },
  {
    image: "/rudraksha_image/mantra.png",
    title: "Spiritual Growth & Energy",
    text: "Enhance meditation, focus, and positivity with our sacred beads."
  }
];


const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  return () => clearInterval(timer);
}, []);

  return (
    <div className="login-wrapper">
      {/* LEFT SIDE */}
{/* LEFT SIDE */}
<div className="left-panel">

  <div className="slider-container">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`slide-item ${currentSlide === index ? "active" : ""}`}
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="slide-overlay">
          <h3 className="slide-title">{slide.title}</h3>
          <p className="slide-text">{slide.text}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Dots */}
  <div className="dots">
    {slides.map((_, index) => (
      <span
        key={index}
        className={`dot ${currentSlide === index ? "active" : ""}`}
        onClick={() => setCurrentSlide(index)}
      ></span>
    ))}
  </div>

</div>



      {/* RIGHT SIDE */}
      <div className="right-panel">
        <h1 className="brand-title">Nepali Rudraksha</h1>

        <h2 className="welcome-title">Welcome to Nepali Rudraksha</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="error-box-outer">
          {error && <div className="error-box">{error}</div>}
          </div>

          <label className="input-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="input-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Link className="forgot-link" to="/forgot-password">
            Forgot password?
          </Link>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="divider">or</div>

          <button type="button" className="google-btn">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
        </form>

        <p className="new-user">
          New User? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

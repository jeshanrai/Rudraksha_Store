// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        username: form.username.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      alert('✅ Registration successful! Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL */}
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

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h1 className="brand-title">Nepali Rudraksha</h1>
        <h2 className="welcome-title">Create Your Account</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}

          {/* First Name + Last Name side by side */}
          <div className="name-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Remaining inputs stacked vertically */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className="divider">or</div>

          <button type="button" className="google-btn">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign up with Google
          </button>
        </form>

        <p className="new-user">
          Already have an account?{' '}
          <span onClick={() => navigate('/login', { replace: true })} style={{ cursor: 'pointer', color: 'blue' }}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

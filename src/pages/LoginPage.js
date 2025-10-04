// LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/profile');
          }
        } catch (err) {
          console.error('Token decode error:', err);
        }
      }
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      let errorMsg = 'Login failed';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } else {
        const text = await res.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    // Parse JSON only if OK
    const data = await res.json();

    // Store token and redirect based on role
    if (data.user.role === 'admin') {
      localStorage.setItem('adminToken', data.token); // Admin token
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } else {
      localStorage.setItem('userToken', data.token); // User token
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    }

  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign in to your account</h2>
        <p className="register-link">
          Or <Link to="/register">create a new account</Link>
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

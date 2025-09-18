// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CheckoutPage = () => {
  const [checkoutData, setCheckoutData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card'
  });

  const { cart, getCartTotal, setCart } = useApp();
  const navigate = useNavigate();
  
  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = Math.round(total * 1.18);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock order submission
    alert('Order placed successfully! Thank you for your purchase.');
    setCart([]);
    navigate('/');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="checkout-layout">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3 className="form-section-title">Shipping Information</h3>
              
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={checkoutData.firstName}
                  onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={checkoutData.lastName}
                  onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <input
                type="email"
                placeholder="Email"
                required
                value={checkoutData.email}
                onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                className="form-input"
              />
              
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={checkoutData.phone}
                onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                className="form-input"
              />
              
              <input
                type="text"
                placeholder="Address"
                required
                value={checkoutData.address}
                onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                className="form-input"
              />
              
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={checkoutData.city}
                  onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={checkoutData.state}
                  onChange={(e) => setCheckoutData({...checkoutData, state: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  required
                  value={checkoutData.zipCode}
                  onChange={(e) => setCheckoutData({...checkoutData, zipCode: e.target.value})}
                  className="form-input"
                />
              </div>

              <h3 className="form-section-title">Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={checkoutData.paymentMethod === 'card'}
                    onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                    className="payment-radio"
                  />
                  Credit/Debit Card
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={checkoutData.paymentMethod === 'upi'}
                    onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                    className="payment-radio"
                  />
                  UPI
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={checkoutData.paymentMethod === 'cod'}
                    onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                    className="payment-radio"
                  />
                  Cash on Delivery
                </label>
              </div>

              <button 
                type="submit"
                className="place-order-btn"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="order-summary-sidebar">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div>
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="order-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="total-row">
                <span>Tax (18%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
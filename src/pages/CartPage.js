// src/pages/CartPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Notification from '../components/Notification';
import './CartPage.css';


const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();
  const [notification, setNotification] = useState(null);
  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = Math.round(total * 1.18);

  // Show a notification when cart changes
  const handleQuantityChange = (item, newQty) => {
    updateCartQuantity(item._id || item.id, newQty);
    setNotification(`${item.name} quantity updated`);
  };

  const handleRemove = (item) => {
    removeFromCart(item._id || item.id);
    setNotification(`${item.name} removed from cart`);
  };

  return (
    <div className="cart-page">
      {notification && (
        <Notification
          message={notification}
          type="success"
          onClose={() => setNotification(null)}
        />
      )}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart className="empty-cart-icon" />
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-message">Add some sacred Rudraksha beads to get started</p>
          <Link to="/products" className="primary-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>

          <div className="cart-layout">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id || item.id} className="cart-item">
                  <div className="cart-item-content">
                    <img
                      src={item.images?.[0] || item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">₹{item.sellingPrice || item.price} each</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="quantity-icon" />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <Plus className="quantity-icon" />
                      </button>
                    </div>
                    <div className="cart-item-total">
                      <p className="item-total-price">
                        ₹{(item.sellingPrice || item.price) * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemove(item)}
                        className="remove-item-btn"
                      >
                        <X className="remove-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{total}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{tax}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

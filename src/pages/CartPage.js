// src/pages/CartPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();
  
  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = Math.round(total * 1.18);

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <ShoppingCart className="empty-cart-icon" />
        <h2 className="empty-cart-title">Your cart is empty</h2>
        <p className="empty-cart-message">Add some sacred Rudraksha beads to get started</p>
        <Link to="/products" className="primary-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-items-container">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-content">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">₹{item.price} each</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="quantity-icon" />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus className="quantity-icon" />
                      </button>
                    </div>
                    <div className="cart-item-total">
                      <p className="item-total-price">₹{item.price * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-item-btn"
                        aria-label="Remove item"
                      >
                        <X className="remove-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default CartPage;
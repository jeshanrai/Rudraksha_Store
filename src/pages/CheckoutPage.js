import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

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
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = Math.round(total * 1.18);

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Add items before checkout.");
      return;
    }

    const userId =
      user?.id ||
      JSON.parse(localStorage.getItem('user'))?._id ||
      JSON.parse(localStorage.getItem('adminUser'))?._id;

    if (!userId) {
      alert("User not found. Please login before placing an order.");
      return;
    }

    // ✅ FIX: Properly map cart items to avoid empty items array
    const itemsArray = cart.map(item => ({
      productId: item._id || item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.sellingPrice || item.price,
    }));

    const orderPayload = {
      userId,
      items: itemsArray,
      shipping: {
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        zipCode: checkoutData.zipCode
      },
      paymentMethod: checkoutData.paymentMethod,
      subtotal: total,
      tax: tax,
      totalAmount: finalTotal,
      status: 'Pending',
      createdAt: new Date()
    };

    console.log("🟡 Order Payload:", orderPayload);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Order placement failed');

      alert('✅ Order placed successfully!');
      setCart([]);
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Failed to place order: ' + error.message);
    }
  };

  const getImageSrc = (item) => {
    if (item.images?.[0]) {
      const img = item.images[0];
      if (img.startsWith('data:image')) return img;
      return `data:image/jpeg;base64,${img}`;
    } else if (item.image) {
      return item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`;
    } else {
      return '/placeholder.jpg';
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3 className="form-section-title">Shipping Information</h3>
              <div className="form-grid">
                <input type="text" placeholder="First Name" required value={checkoutData.firstName} onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})} className="form-input" />
                <input type="text" placeholder="Last Name" required value={checkoutData.lastName} onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})} className="form-input" />
              </div>
              <input type="email" placeholder="Email" required value={checkoutData.email} onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})} className="form-input" />
              <input type="text" placeholder="Phone Number" required value={checkoutData.phone} onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})} className="form-input" />
              <input type="text" placeholder="Address" required value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} className="form-input" />
              <div className="form-grid">
                <input type="text" placeholder="City" required value={checkoutData.city} onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})} className="form-input" />
                <input type="text" placeholder="State" required value={checkoutData.state} onChange={(e) => setCheckoutData({...checkoutData, state: e.target.value})} className="form-input" />
                <input type="text" placeholder="PIN Code" required value={checkoutData.zipCode} onChange={(e) => setCheckoutData({...checkoutData, zipCode: e.target.value})} className="form-input" />
              </div>
              <h3 className="form-section-title">Payment Method</h3>
              <div className="payment-options">
                {['card','upi','cod'].map(method => (
                  <label key={method} className="payment-option">
                    <input type="radio" name="payment" value={method} checked={checkoutData.paymentMethod === method} onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} className="payment-radio" />
                    {method === 'card' ? 'Credit/Debit Card' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}
                  </label>
                ))}
              </div>
              <button type="submit" className="place-order-btn">Place Order</button>
            </form>
          </div>

          <div className="order-summary-sidebar">
            <h3 className="summary-title">Order Summary</h3>
            <div className="order-items">
              {cart.map(item => (
                <div key={item._id || item.id} className="order-item">
                  <div className="order-item-info">
                    <img src={getImageSrc(item)} alt={item.name} className="order-item-image" />
                    <div>
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="order-item-price">₹{(item.sellingPrice || item.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row"><span>Subtotal:</span><span>₹{total}</span></div>
              <div className="total-row"><span>Shipping:</span><span className="free-shipping">Free</span></div>
              <div className="total-row"><span>Tax (18%):</span><span>₹{tax}</span></div>
              <div className="total-row final-total"><span>Total:</span><span>₹{finalTotal}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

// ✅ CheckoutPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

// ✅ Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "./CheckoutPage.css";

// ✅ Correct Stripe key load
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// ✅ STRIPE PAYMENT COMPONENT (NO FORM NESTED)
const StripePaymentForm = ({ finalTotal, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);

    // ✅ 1. Create PaymentIntent (backend)
    const res = await fetch("http://localhost:5000/api/payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalTotal }),
    });

    const { clientSecret } = await res.json();

    // ✅ 2. Confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      onSuccess(result.paymentIntent.id);
    }
  };

  return (
    <div className="stripe-box">
      <CardElement className="stripe-card-element" />
      <button
        type="button"
        className="place-order-btn"
        disabled={!stripe || loading}
        onClick={handleStripePayment}
      >
        {loading ? "Processing..." : `Pay ₹${finalTotal}`}
      </button>
    </div>
  );
};


// ✅ MAIN CHECKOUT PAGE
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, setCart } = useApp();
  const { user, token } = useAuth();

  const [checkoutData, setCheckoutData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    paymentMethod: "card",
  });

  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  // ✅ If cart empty → redirect
  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  // ✅ Place Order API
  const placeOrder = async (paymentId = null) => {
    const userId =
      user?.id ||
      JSON.parse(localStorage.getItem("user"))?._id ||
      JSON.parse(localStorage.getItem("adminUser"))?._id;

    const orderPayload = {
      userId,
      items: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.sellingPrice || item.price,
      })),
      shipping: checkoutData,
      paymentMethod: checkoutData.paymentMethod,
      subtotal: total,
      tax,
      totalAmount: finalTotal,
      status: paymentId ? "Paid" : "Pending",
      paymentId,
      createdAt: new Date(),
    };

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || localStorage.getItem("userToken")}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Order failed");
      return;
    }

    alert("✅ Order placed successfully!");
    setCart([]);
    navigate("/");
  };

  // ✅ COD (Normal form submit)
  const handleNormalOrder = (e) => {
    e.preventDefault();
    placeOrder(null);
  };

  const getImageSrc = (item) => {
    if (item.images?.[0]) {
      const img = item.images[0];
      return img.startsWith("data:image") ? img : `data:image/jpeg;base64,${img}`;
    }
    if (item.image) {
      return item.image.startsWith("data:image")
        ? item.image
        : `data:image/jpeg;base64,${item.image}`;
    }
    return "/placeholder.jpg";
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">

          {/* ✅ LEFT SIDE — FORM */}
          <div className="checkout-form-container">

            <form
              onSubmit={checkoutData.paymentMethod === "cod" ? handleNormalOrder : undefined}
              className="checkout-form"
            >
              <h3 className="form-section-title">Shipping Information</h3>

              <div className="form-grid">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={checkoutData.firstName}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, firstName: e.target.value })
                  }
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={checkoutData.lastName}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, lastName: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                required
                value={checkoutData.email}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, email: e.target.value })
                }
                className="form-input"
              />

              <input
                type="text"
                placeholder="Phone Number"
                required
                value={checkoutData.phone}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, phone: e.target.value })
                }
                className="form-input"
              />

              <input
                type="text"
                placeholder="Address"
                required
                value={checkoutData.address}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, address: e.target.value })
                }
                className="form-input"
              />

              <div className="form-grid">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={checkoutData.city}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, city: e.target.value })
                  }
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="State"
                  required
                  value={checkoutData.state}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, state: e.target.value })
                  }
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="PIN Code"
                  required
                  value={checkoutData.zipCode}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, zipCode: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              {/* ✅ PAYMENT OPTIONS */}
              <h3 className="form-section-title">Payment Method</h3>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    value="card"
                    name="payment"
                    checked={checkoutData.paymentMethod === "card"}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
                    }
                  />
                  <img src="/img/payments/card.png" className="payment-logo" alt="" />
                  Credit / Debit Card
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="cod"
                    name="payment"
                    checked={checkoutData.paymentMethod === "cod"}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
                    }
                  />
                  <img src="/img/payments/cod.png" className="payment-logo" alt="" />
                  Cash on Delivery
                </label>
              </div>

              {/* ✅ STRIPE PAYMENT DISPLAY (NO FORM INSIDE FORM) */}
              {checkoutData.paymentMethod === "card" && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    finalTotal={finalTotal}
                    onSuccess={(paymentId) => placeOrder(paymentId)}
                  />
                </Elements>
              )}

              {/* ✅ COD BUTTON */}
              {checkoutData.paymentMethod === "cod" && (
                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              )}
            </form>
          </div>

          {/* ✅ RIGHT SIDE — ORDER SUMMARY */}
          <div className="order-summary-sidebar">
            <h3 className="summary-title">Order Summary</h3>

            <div className="order-items">
              {cart.map((item) => (
                <div key={item._id || item.id} className="order-item">
                  <div className="order-item-info">
                    <img
                      src={getImageSrc(item)}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div>
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="order-item-price">
                    ₹{(item.sellingPrice || item.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{total}</span>
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

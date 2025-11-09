// ✅ CheckoutPage.js
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

// ✅ Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Notification from "../components/Notification";
import "./CheckoutPage.css";

// ✅ Correct Stripe key load
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// ✅ STRIPE PAYMENT COMPONENT (NO FORM NESTED)
const StripePaymentForm = ({ finalTotal, onSuccess, setNotification }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);

    try {
      // ✅ 1. Create PaymentIntent (backend)
      const res = await fetch("https://rudraksha-store.onrender.com/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        setNotification({ type: "error", message: data.error || "Failed to create PaymentIntent" });
        setLoading(false);
        return;
      }

      const clientSecret = data.clientSecret;

      // ✅ 2. Confirm card payment
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setNotification({ type: "error", message: "Payment failed: " + result.error.message });
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        setNotification({ type: "success", message: "✅ Payment successful!" });
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Something went wrong during payment!" });
    }

    setLoading(false);
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
  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Payment


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


  
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  // ✅ If cart empty → redirect
  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  // ✅ Real-time validation on input change
  const handleInputChange = (field, value) => {
    setCheckoutData({ ...checkoutData, [field]: value });

    // ✅ Validate this specific field
    const fieldErrors = { ...errors };

    switch (field) {
      case "firstName":
        fieldErrors.firstName = value.trim() ? "" : "First name is required";
        break;
      case "lastName":
        fieldErrors.lastName = value.trim() ? "" : "Last name is required";
        break;
      case "email":
        if (!value.trim()) fieldErrors.email = "Email is required";
        else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) fieldErrors.email = "Invalid email address";
        else fieldErrors.email = "";
        break;
      case "phone":
        if (!value.trim()) fieldErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(value)) fieldErrors.phone = "Phone number must be 10 digits";
        else fieldErrors.phone = "";
        break;
      case "address":
        fieldErrors.address = value.trim() ? "" : "Address is required";
        break;
      case "city":
        fieldErrors.city = value.trim() ? "" : "City is required";
        break;
      case "state":
        fieldErrors.state = value.trim() ? "" : "State is required";
        break;
      case "zipCode":
        if (!value.trim()) fieldErrors.zipCode = "PIN Code is required";
        else if (!/^\d{5,6}$/.test(value)) fieldErrors.zipCode = "Invalid PIN Code";
        else fieldErrors.zipCode = "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };
const validateForm = () => {
  const newErrors = {};

  if (!checkoutData.firstName.trim()) newErrors.firstName = "First name is required";
  if (!checkoutData.lastName.trim()) newErrors.lastName = "Last name is required";

  if (!checkoutData.email.trim()) newErrors.email = "Email is required";
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(checkoutData.email))
    newErrors.email = "Invalid email address";

  if (!checkoutData.phone.trim()) newErrors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(checkoutData.phone)) newErrors.phone = "Phone number must be 10 digits";

  if (!checkoutData.address.trim()) newErrors.address = "Address is required";
  if (!checkoutData.city.trim()) newErrors.city = "City is required";
  if (!checkoutData.state.trim()) newErrors.state = "State is required";

  if (!checkoutData.zipCode.trim()) newErrors.zipCode = "PIN Code is required";
  else if (!/^\d{5,6}$/.test(checkoutData.zipCode)) newErrors.zipCode = "Invalid PIN Code";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

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

    try {
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
        setNotification({ type: "error", message: data.message || "Order failed" });
        return;
      }

      // ✅ Redirect to Profile page and pass notification
      setCart([]);
      navigate("/profile", { state: { notification: { type: "success", message: "✅ Order placed successfully!" } } });
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Something went wrong while placing the order!" });
    }
  };

  // ✅ COD Form submission
  const handleNormalOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container">
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
                  value={checkoutData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`form-input ${errors.firstName ? "input-error" : ""}`}
                  required
                />
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}

                <input
                  type="text"
                  placeholder="Last Name"
                  value={checkoutData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`form-input ${errors.lastName ? "input-error" : ""}`}
                  required
                />
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>

              <input
                type="email"
                placeholder="Email"
                value={checkoutData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`form-input ${errors.email ? "input-error" : ""}`}
                required
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <input
                type="text"
                placeholder="Phone Number"
                value={checkoutData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`form-input ${errors.phone ? "input-error" : ""}`}
                required
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}

              <input
                type="text"
                placeholder="Address"
                value={checkoutData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`form-input ${errors.address ? "input-error" : ""}`}
                required
              />
              {errors.address && <p className="error-text">{errors.address}</p>}

              <div className="form-grid">
                <input
                  type="text"
                  placeholder="City"
                  value={checkoutData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`form-input ${errors.city ? "input-error" : ""}`}
                  required
                />
                {errors.city && <p className="error-text">{errors.city}</p>}

                <input
                  type="text"
                  placeholder="State"
                  value={checkoutData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`form-input ${errors.state ? "input-error" : ""}`}
                  required
                />
                {errors.state && <p className="error-text">{errors.state}</p>}

                <input
                  type="text"
                  placeholder="PIN Code"
                  value={checkoutData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className={`form-input ${errors.zipCode ? "input-error" : ""}`}
                  required
                />
                {errors.zipCode && <p className="error-text">{errors.zipCode}</p>}
              </div>

              {step === 1 && (
  <button
    type="button"
    className="lpgp-place-order-btn"
    onClick={() => {
      if (!validateForm()) return;
      setStep(2);
    }}
  >
    Proceed to Payment
  </button>
)}


              {/* ✅ PAYMENT OPTIONS */}
            {step === 2 && (
  <>
    <h3 className="lpgp-form-section-title">Payment Method</h3>
    <div className="lpgp-payment-options">

      {/* CARD */}
      <label className="lpgp-payment-option">
        <input
          type="radio"
          value="card"
          name="payment"
          checked={checkoutData.paymentMethod === "card"}
          onChange={(e) =>
            setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
          }
        />
        <div className="lpgp-payment-card">
          <img src="/images/credit.png" className="lpgp-payment-logo" alt="Card" />
          <span className="lpgp-payment-text">Credit / Debit Card</span>
        </div>
      </label>

      {/* COD */}
      <label className="lpgp-payment-option">
        <input
          type="radio"
          value="cod"
          name="payment"
          checked={checkoutData.paymentMethod === "cod"}
          onChange={(e) =>
            setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })
          }
        />
        <div className="lpgp-payment-card">
          <img src="/images/cash.png" className="lpgp-payment-logo" alt="COD" />
          <span className="lpgp-payment-text">Cash on Delivery</span>
        </div>
      </label>

    </div>

    {/* Stripe Form */}
    {checkoutData.paymentMethod === "card" && (
      <div className="lpgp-stripe-form">
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            finalTotal={finalTotal}
            onSuccess={(paymentId) => {
              if (!validateForm()) return;
              placeOrder(paymentId);
            }}
            setNotification={setNotification}
          />
        </Elements>
      </div>
    )}

    {/* COD Button */}
    {checkoutData.paymentMethod === "cod" && (
      <button type="submit" className="lpgp-place-order-btn">
        Place Order
      </button>
    )}
  </>
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
                    <img src={getImageSrc(item)} alt={item.name} className="order-item-image" />
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

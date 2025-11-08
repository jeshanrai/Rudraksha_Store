// src/components/StripePaymentForm.jsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const StripePaymentForm = ({ finalTotal, checkoutData, cart, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // 1) Create PaymentIntent on server and get client_secret
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
        amount: Math.round(finalTotal * 100), // in paise/cents
        currency: "inr",
        // optionally pass order or cart details
        metadata: { email: checkoutData.email },
      });

      const clientSecret = res.data.clientSecret;

      // 2) Confirm card payment using Elements
      const cardElement = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${checkoutData.firstName} ${checkoutData.lastName}`,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: {
              line1: checkoutData.address,
              city: checkoutData.city,
              state: checkoutData.state,
              postal_code: checkoutData.zipCode,
            },
          },
        },
      });

      if (confirm.error) {
        alert(confirm.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (confirm.paymentIntent && confirm.paymentIntent.status === "succeeded") {
        // Pass the payment details up for order creation
        onSuccess(confirm.paymentIntent);
      } else {
        alert("Payment not completed.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error, check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-form">
      <CardElement className="stripe-card-element" />
      <button
  type="button"
  className="place-order-btn"
  disabled={!stripe || loading || !isFormValid}
  onClick={handleStripePayment}
>
  {loading ? "Processing..." : `Pay ₹${finalTotal}`}
</button>

    </div>
  );
};

export default StripePaymentForm;

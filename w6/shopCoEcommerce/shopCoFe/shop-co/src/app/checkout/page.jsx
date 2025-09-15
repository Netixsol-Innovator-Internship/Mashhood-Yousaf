"use client";

import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOrderMutation } from "@/store/shopCoApi";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();

  const discount = totalAmount * 0.2;
  const deliveryFee = 15;
  const finalTotal = totalAmount - discount + deliveryFee;

  const [formData, setFormData] = useState({
    city: "",
    country: "",
    paymentMethod: "cod",
  });

  const [orderId, setOrderId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirmOrder = async () => {
    if (formData.city.trim().length < 3 || formData.country.trim().length < 3) {
      alert("All fields are required and must be at least 3 characters.");
      return;
    }

    try {
      setOrderLoading(true);

      // 1️⃣ Create Order
      const orderData = {
        items,
        totalAmount,
        discount,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
      };

      const res = await createOrder(orderData).unwrap();
      console.log("✅ Order created:", res);
      setOrderId(res._id);

      if (formData.paymentMethod === "stripe") {
        // 2️⃣ Create PaymentIntent
        const intentRes = await fetch(
          "https://shop-co.up.railway.app/payments/create-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: res._id }),
          }
        );
        const data = await intentRes.json();
        setClientSecret(data.clientSecret);
      } else {
        // 3️⃣ COD Flow
        dispatch(clearCart());
        router.push("/order-success");
      }
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("Something went wrong.");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Shipping Form */}
      <div className="space-y-4 bg-white shadow-sm rounded-xl p-6 mb-6">
        <input
          type="text"
          name="city"
          placeholder="City & Address"
          value={formData.city}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-sm rounded-xl p-6 space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount</span>
          <span>- ${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Stripe Payment Form */}
      {clientSecret ? (
        <Elements
          stripe={loadStripe(
            "pk_test_51S65AID6GutWOdXGTMGNjSOyoFKUW83y9LYWHunEwfyDwmPnFPbCnzadPMbYDK9gavUnSysX1avmDfwOledtLFJQ00cMwOg2Kd"
          )}
          options={{ clientSecret }}
        >
          <StripeCheckoutForm
            orderId={orderId}
            clientSecret={clientSecret}
            formData={formData}
            dispatch={dispatch}
            router={router}
          />
        </Elements>
      ) : (
        <button
          onClick={handleConfirmOrder}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium"
        >
          {orderLoading ? "Ordering..." : "Confirm Order →"}
        </button>
      )}
    </div>
  );
}

// Stripe Form Component
function StripeCheckoutForm({
  orderId,
  clientSecret,
  formData,
  dispatch,
  router,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: { name: formData.city },
        },
      }
    );

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    console.log("✅ Payment succeeded:", paymentIntent);
    dispatch(clearCart());
    router.push("/order-success");
  };

  return (
    <div className="space-y-4">
      <CardElement className="p-3 border rounded" />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

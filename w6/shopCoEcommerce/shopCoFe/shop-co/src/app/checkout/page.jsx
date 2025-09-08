"use client";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOrderMutation } from "@/store/shopCoApi";

export default function CheckoutPage() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [orderLoading, setOrderLoading] = useState(false);

  const discount = totalAmount * 0.2; // ✅ no discount
  const deliveryFee = 15;
  const finalTotal = totalAmount - discount + deliveryFee;

  const [formData, setFormData] = useState({
    city: "",
    country: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (formData.city.trim().length < 3 || formData.country.trim().length < 3) {
      alert("All fields are required and must be at least 3 characters.");
      return;
    }
    try {
      setOrderLoading(true);
      const orderData = {
        items,
        totalAmount,
        discount: totalAmount * 0.2, // ✅ fix
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod, // "cod" or "stripe"
      };

      const res = await createOrder(orderData).unwrap(); // ✅ RTK Query

      console.log("✅ Order Success:", res);

      // socket.on("orderNotification", (data) => {
      //   console.log("📦 New Order Placed:", data.message);
      //   toast.success(`📦 New Order: ${data.message}`);
      // });

      dispatch(clearCart());
      router.push("/order-success");
    } catch (err) {
      console.error("❌ Order Error:", err);
      alert("Something went wrong while confirming order.");
    } finally {
      setOrderLoading(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Shipping Form */}
      <div className="space-y-4 bg-white shadow-sm rounded-xl p-6 mb-6">
        {/* <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        /> */}
        <input
          type="text"
          name="city"
          required
          placeholder="City & Adress"
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

        {/* Payment Method */}
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
      <div className="bg-white shadow-sm rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
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

      {/* Confirm Order */}
      <button
        onClick={handleConfirmOrder}
        className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium"
      >
        {orderLoading ? (
          <p className="animate-pulse transition"> Ordering...</p>
        ) : (
          <p> Confirm Order →</p>
        )}
      </button>
    </div>
  );
}

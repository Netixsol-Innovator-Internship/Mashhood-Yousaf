import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import RecommendedProducts from "../components/RecommendedProducts";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({}); // Track which items are being updated
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://ecommerce-back-end-kohl.vercel.app/api/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const items = res.data.data.items.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        }));

        setCartItems(items);
      } catch (err) {
        console.error("Cart fetch error:", err);
        setError("Seems Cart is empty ");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCartItems]);

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        "https://ecommerce-back-end-kohl.vercel.app/api/cart/removeItem",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            productId,
          },
        }
      );

      // Update cart UI by removing the item locally
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (err) {
      console.error("Error removing item:", err);
      // Optionally show toast or error message
    }
  };

 const updateQuantity = async (productId, newQuantity) => {
   const token = localStorage.getItem("token");

   if (newQuantity < 1 || newQuantity > 10) return;

   setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

   try {
     const response = await axios.put(
       "https://ecommerce-back-end-kohl.vercel.app/api/cart/update-quantity",
       {
         productId,
         quantity: newQuantity,
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );

     console.log("Quantity update response:", response.data);

     if (response.data && response.data.success) {
       setCartItems((prevItems) =>
         prevItems.map((item) =>
           item.id === productId ? { ...item, quantity: newQuantity } : item
         )
       );
     } else {
       console.warn("Failed to update quantity:", response.data.message);
     }
   } catch (err) {
     console.error("Error updating quantity:", err);
   } finally {
     setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
   }
 };


  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < 10) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.length === 0 ? (
              <div className="p-6">Your cart is empty.</div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-6 animate-fadeIn"
                  >
                    {/* Product Info */}
                    <div className="flex items-start gap-4 w-full sm:w-2/3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 mt-6 hover:underline transition"
                          disabled={updatingItems[item.id]}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end justify-between sm:justify-end gap-3 w-full sm:w-1/3 mt-4 sm:mt-0">
                      <div className="flex w-[96px] gap-2 p-1">
                        <button
                          className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={
                            updatingItems[item.id] || item.quantity <= 1
                          }
                        >
                          -
                        </button>
                        <span className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black">
                          {updatingItems[item.id] ? "..." : item.quantity}
                        </span>
                        <button
                          className="h-6 w-6 text-[22px] leading-7 flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={
                            updatingItems[item.id] || item.quantity >= 10
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold mr-6 text-gray-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Subtotal */}
                <div className="flex justify-between items-center border-t border-gray-300 pt-6 text-lg font-medium">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900">
                    €{calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Back to Shopping */}
                <button className="mt-6 border border-gray-900 px-8 py-3 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition duration-300 rounded">
                  BACK TO SHOPPING
                </button>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto">
                {/* Order Summary */}
                <div className="w-full bg-white p-6 shadow-md border border-gray-200">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
                    Order summary
                  </h2>

                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      €{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900 font-medium">€3.95</span>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div className="flex justify-between text-lg font-bold py-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      €{(calculateSubtotal() + 3.95).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-4 mb-6 italic">
                    Estimated shipping time: 2 days
                  </p>

                  <button className="w-full bg-black text-white py-4 font-semibold hover:bg-indigo-900 transition-all duration-300 transform hover:-translate-y-1 shadow-md">
                    CHECK OUT
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="w-full bg-white p-6 shadow-md border border-gray-200 mt-6">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b pb-4">
                    Payment methods
                  </h3>
                  <div className="flex flex-wrap gap-1 items-center justify-center md:justify-start">
                    <div className="bg-black p-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      {/* <div className="bg-white p-1 rounded-sm h-8 w-12 flex items-center justify-center"> */}
                      <span className="font-bold text-black text-xs">
                        <img 
                        className="w-6"
                          src="../../public/images/ideal-logo1.svg"
                          alt=""
                        />
                      </span>
                      {/* </div> */}
                    </div>
                    <div className="bg-black p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <span className="font-bold text-black text-xs">
                        <img
                        className="w-8"
                          src="../../public/images/advancePayment.svg"
                          alt=""
                        />
                      </span>
                    </div>
                    <div className="bg-black p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <span className="font-bold text-black text-xs">
                        <img
                        className="w-8"
                          src="../../public/images/maestro-dark-large.svg"
                          alt=""
                        />
                      </span>
                    </div>
                    <div className="bg-black p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <span className="font-bold text-black text-xs">
                        <img
                        className="w-8"
                          src="../../public/images/visa-logoa.svg"
                          alt=""
                        />
                      </span>
                    </div>
                    <div className="bg-black p-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <span className="font-bold text-black text-xs">
                        <img
                        className="w-8"
                          src="../../public/images/visa-logoa.svg"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                  {/* Payment form (simplified) */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-medium mb-4 text-gray-700">
                      Enter payment details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry date
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery and retour */}
                <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Delivery and retour
                  </h4>

                  <ul className="space-y-4 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-xl leading-5 mt-0.5">›</span>
                      <span>
                        Order before 12:00 and we will ship the same day.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xl leading-5 mt-0.5">›</span>
                      <span>
                        Orders made after Friday 12:00 are processed on Monday.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xl leading-5 mt-0.5">›</span>
                      <span>
                        To return your articles, please contact us first.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xl leading-5 mt-0.5">›</span>
                      <span>Postal charges for retour are not reimbursed.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default CartPage;

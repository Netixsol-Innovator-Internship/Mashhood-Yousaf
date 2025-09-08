"use client";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CartPage() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const discount = totalAmount * 0.2; // 20% discount
  const deliveryFee = 15;
  const finalTotal = totalAmount - discount + deliveryFee;

  if (items.length === 0) {
    return <p className="p-10 text-center">Your cart is empty 🛒</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
      {/* LEFT: Cart Items */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-black">YOUR CART</h1>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border gap-4 sm:gap-0"
          >
            {/* Product Info */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Thumbnail */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base sm:text-lg truncate">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Size: {item.size || "—"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Color: {item.color || "—"}
                </p>
                <p className="mt-1 font-semibold text-sm sm:text-base">
                  ${item.price}
                </p>
              </div>
            </div>

            {/* Quantity + Delete */}
            <div className="flex items-center justify-between w-full sm:w-auto self-end sm:self-auto">
              {/* Quantity Controls */}
              <div className="flex items-center bg-gray-100 rounded-full px-2 sm:px-3 py-1">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        variants: item.variants,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-sm sm:text-base"
                >
                  −
                </button>
                <span className="w-5 sm:w-6 text-center text-sm sm:text-base">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        variants: item.variants,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-sm sm:text-base"
                >
                  +
                </button>
              </div>

              {/* Delete Icon */}
              <button
                onClick={() =>
                  dispatch(
                    removeFromCart({
                      productId: item.productId,
                      variants: item.variants,
                    })
                  )
                }
                className="text-red-500 ml-3"
              >
                <TrashIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 h-fit sticky top-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Discount (-20%)</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-base sm:text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout">
          <button className="mt-6 w-full bg-black text-white py-3 rounded-full flex items-center justify-center font-medium text-sm sm:text-base">
            Go to Checkout →
          </button>
        </Link>
      </div>
    </div>
  );
}

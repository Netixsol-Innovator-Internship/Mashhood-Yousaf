"use client";

import { useParams } from "next/navigation"; // For getting the product ID from the URL
import { useGetProductQuery } from "../../../store/shopCoApi"; // Import the query hook
import Image from "next/image";
import { useState } from "react";
import AlsoLike from "@/components/AlsoLike";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/cartSlice";
import ProductReviews from "@/components/ProductReviews";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id; // Direct id from the URL
  
  
  
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetProductQuery(id, { skip: !id });
  const product = data;

  // State to manage selected color and size
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]?.url);

  // Fetch product data using RTK query
  console.log("data for id", data);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error loading product.</p>;

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };


  const increaseQuantity = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);

    const exists = cartItems.find((item) => item.productId === product._id);
    if (exists) {
      dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
    } else {
      dispatch(
        addToCart({
          productId: product._id,
          quantity: newQty,
          price: product.price,
        })
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);

      const exists = cartItems.find((item) => item.productId === product._id);
      if (exists) {
        dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
      }
    }
  };

const handleAddToCart = () => {
  toast.success("Item Added To Cart")
  const cartItem = {
    productId: product._id,
    title: product.title,
    image: product.images?.[0]?.url,
    price: product.price,
    size: selectedSize || null,
    color: selectedColor || null,
    quantity,
    variants: [
      { name: "size", value: selectedSize || "default" },
      { name: "color", value: selectedColor || "default" },
    ],
  };

  dispatch(addToCart(cartItem));
};


  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Product Image and Details */}
        <main className="flex-1">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Product Image Gallery */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Thumbnails - horizontal on mobile, vertical on medium+ */}
              <div className="flex md:flex-col gap-2 order-2 md:order-1 justify-center md:justify-start overflow-x-auto md:overflow-x-visible py-2 md:py-0">
                {product?.images?.map((img, i) => (
                  <div
                    key={i}
                    className={`cursor-pointer border rounded-lg p-1 flex-shrink-0 ${
                      selectedImage === img.url
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${i + 1}`}
                      width={60}
                      height={60}
                      className="object-cover rounded-lg w-14 h-14 md:w-16 md:h-16"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="w-full md:w-[400px] lg:w-[500px] rounded-xl h-[300px] md:h-[400px] lg:h-[470px] relative order-1 md:order-2">
                <Image
                  src={selectedImage || product.images[0].url}
                  alt="Selected Product"
                  fill
                  className="object-contain rounded-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {product?.title}
              </h1>
              <div className="flex items-center mb-4">
                {"★".repeat(Math.floor(product?.averageRating))}
                {"☆".repeat(5 - Math.floor(product?.averageRating))}
                <span className="text-gray-600 ml-2">
                  {product?.averageRating}/5
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-lg md:text-xl font-semibold">
                  ${product?.price}
                </p>
                {product?.originalPrice && (
                  <p className="text-sm line-through text-gray-400">
                    ${product?.originalPrice}
                  </p>
                )}
              </div>

              <p className="text-sm border-b pb-4 mb-4">
                {product?.description}
              </p>

              {/* Select Color */}
              <div className="mb-4 border-b pb-4 md:pb-6">
                <h4 className="font-semibold text-sm">Select Color:</h4>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {product?.variants?.[0]?.options?.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      } ${
                        color === "Gray"
                          ? "bg-gray-600"
                          : color === "Green"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Select Size */}
              <div className="mb-4 border-b py-4 md:py-6">
                <h4 className="font-semibold text-sm">Choose Size:</h4>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {
                    <button
                      key={product.size}
                      className={`px-4 py-2 md:px-6 md:py-2 rounded-full text-sm ${
                        selectedSize === product.size
                          ? "bg-black text-white"
                          : "bg-[rgba(240,240,240,1)] text-[rgba(0,0,0,0.6)]"
                      }`}
                      onClick={() => handleSizeSelect(product.size)}
                    >
                      {product.size}
                    </button>
                  }
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-4">
                {/* Quantity Selector */}
                <ProtectedRoute>
                  <div className="flex flex-1 items-center justify-center  space-x-10 bg-[rgba(240,240,240,1)] font-bold rounded-full px-4 py-2">
                    <button
                      className="text-lg text-gray-700"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>
                    <span className="text-lg text-gray-700">{quantity}</span>
                    <button
                      className="text-lg text-gray-700"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 flex-1/2 bg-black text-white rounded-full ml-4"
                  >
                    Add to Cart
                  </button>
                </ProtectedRoute>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ProductReviews productId={id} />
      <AlsoLike />
    </section>
  );
}

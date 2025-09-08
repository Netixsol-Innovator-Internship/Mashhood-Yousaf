"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetUserOrdersQuery,
} from "@/store/shopCoApi";
import { toast } from "react-toastify";

export default function ProductReviews({ productId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const limit = 3;

  // ✅ No page/limit passed (BE returns all reviews)
  const { data, isLoading } = useGetProductReviewsQuery({ productId });
  const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery();

  const [createReview, { isLoading: creatingReview }] =
    useCreateReviewMutation();
  // console.log("createReview", createReview);

  if (isLoading) return <p>Loading reviews...</p>;
  console.log("productId from props", productId);
  console.log("orders from review", orders);
  console.log(
    "all order items productIds",
    orders?.orders?.flatMap((o) => o.items.map((i) => i.productId))
  );
  // ✅ Client-side slicing
  const visibleReviews = data?.reviews?.slice(0, page * limit) || [];

  const matchedOrder = orders?.find((order) =>
    order.items.some(
      (item) =>
        item.productId === productId || // in case BE ever sends string
        item.productId?._id === productId // when BE sends object
    )
  );

  console.log("matchedOrder", matchedOrder);

  const orderId = matchedOrder?._id;
  console.log("final orderId", orderId);

  const handleSubmit = async () => {
    if (!orderId) {
      toast.error(
        "⚠️ You need to purchase this product before writing a review."
      );
      return;
    }

    const newReview = {
      productId,
      orderId,
      rating: Number(rating), // ✅ dynamic rating
      comment: comment.trim(), // ✅ dynamic comment
    };

    try {
      const res = await createReview(newReview).unwrap();
      toast.success("✅ Review submitted successfully!");
      console.log("Review created:", res);
    } catch (error) {
      const errMsg =
        error?.data?.message || // agar backend se message aa raha ho
        error?.error || // RTK Query ka default error string
        "❌ Something went wrong"; // fallback
      toast.error(errMsg);
      console.error("Review error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  console.log("data of review", data);
  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {visibleReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-9 py-2 border border-[#0000001A] text-black rounded-4xl hover:bg-gray-900 hover:text-white transition-all duration-75"
          >
            Write a review
          </button>

          {/* Load More button */}
          {data?.reviews?.length > visibleReviews.length && (
            <div className=" ">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-9 py-2  border border-[#0000001A]  text-black rounded-4xl hover:bg-gray-900 hover:text-white transition-all duration-75"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
      {/* // Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Write a Review</h2>

            {/* Rating */}
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 w-full rounded mb-3"
              placeholder="Rating (1-5)"
            />

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 w-full rounded mb-3"
              placeholder="Your comment..."
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={creatingReview} // ✅ disable while loading
                className={`px-4 py-2 rounded-lg text-white ${
                  creatingReview
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {creatingReview ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

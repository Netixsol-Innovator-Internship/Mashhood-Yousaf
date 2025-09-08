// components/ReviewCard.jsx
import { Star } from "lucide-react";
import { format } from "date-fns";

export default function ReviewCard({ review }) {
  const { userId, rating, comment, createdAt } = review;

  return (
    <div className="border border-[#0000001A] rounded-2xl shadow-sm p-4 bg-white mt-20 ">
      {/* Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* User info */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-semibold">{userId?.name}</span>
        <span className="text-green-600 text-sm">✔</span>
      </div>

      {/* Comment */}
      <p className="mt-2  text-sm text-[#00000099] break-words whitespace-normal overflow-hidden">{comment}</p>

      {/* Date */}
      <p className="mt-2 text-[11px] text-[#00000099]">
        Posted on {format(new Date(createdAt), "MMMM dd, yyyy")}
      </p>
    </div>
  );
}


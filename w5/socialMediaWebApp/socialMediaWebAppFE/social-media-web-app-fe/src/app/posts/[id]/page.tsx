"use client";
import { useParams } from "next/navigation";
import CommentForm from "@/components/commentForm";
import CommentList from "@/components/CommentList";

export default function PostDetailPage() {
  const { id } = useParams(); // ✅ post id from route /posts/[id]

  if (!id) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Post #{id}</h1>

      {/* Add new comment */}
      <CommentForm postId={id as string} />

      {/* Show comments */}
      <CommentList postId={id as string} />
    </div>
  );
}

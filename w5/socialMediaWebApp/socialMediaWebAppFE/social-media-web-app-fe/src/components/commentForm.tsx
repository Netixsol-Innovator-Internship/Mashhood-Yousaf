"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");

  const submit = async () => {
    if (!content.trim()) return;
    await api.post("/comments", { postId, content });
    setContent("");
  };

  return (
    <div className="flex gap-2 p-2">
      <input
        className="flex-1 border rounded p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        data-placeholder="Write a comment..."
      />
      <button
        onClick={submit}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Post
      </button>
    </div>
  );
}

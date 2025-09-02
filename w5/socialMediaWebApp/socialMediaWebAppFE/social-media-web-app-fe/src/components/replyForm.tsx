"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function ReplyForm({ parentId }: { parentId: string }) {
  const [content, setContent] = useState("");

  const submit = async () => {
    if (!content.trim()) return;
    await api.post(`/comments/${parentId}/reply`, { content });
    setContent("");
  };

  return (
    <div className="ml-6 flex gap-2 mt-1">
      <input
        className="flex-1 border rounded p-1"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        data-placeholder="Reply..."
      />
      <button
        onClick={submit}
        className="bg-green-500 text-white px-2 py-1 rounded"
      >
        Reply
      </button>
    </div>
  );
}

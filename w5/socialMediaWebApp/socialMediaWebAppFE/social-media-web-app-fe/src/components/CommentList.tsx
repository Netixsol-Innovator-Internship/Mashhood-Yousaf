"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import socket from "@/lib/socket";
import ReplyForm from "./replyForm";

interface Comment {
  _id: string;
  content: string;
  author: { username: string; avatarUrl?: string };
  likesCount?: number;
}

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch comments
  const fetchComments = async () => {
    const res = await api.get(`/comments/post/${postId}`);
    setComments(res.data);
  };

  const like = async (id: string) => {
    await api.post(`/comments/${id}/like`);
  };
  const unlike = async (id: string) => {
    await api.post(`/comments/${id}/unlike`);
  };

  useEffect(() => {
    fetchComments();

    socket.on("commentCreated", (data) => {
      if (data.commentId) fetchComments();
    });

    socket.on("commentLikeUpdated", ({ commentId, likesCount }) => {
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, likesCount } : c))
      );
    });

    return () => {
      socket.off("commentCreated");
      socket.off("commentLikeUpdated");
    };
  }, [postId]);

  return (
    <div className="space-y-4 p-4">
      {comments.map((c) => (
        <div key={c._id} className="border p-2 rounded">
          <p>
            <strong>{c.author.username}</strong>: {c.content}
          </p>
          <div className="flex gap-2 text-sm mt-1">
            <button
              onClick={() => like(c._id)}
              className="text-blue-500 hover:underline"
            >
              Like
            </button>
            <button
              onClick={() => unlike(c._id)}
              className="text-red-500 hover:underline"
            >
              Unlike
            </button>
            <span>{c.likesCount || 0} likes</span>
          </div>
          <ReplyForm parentId={c._id} />
        </div>
      ))}
    </div>
  );
}

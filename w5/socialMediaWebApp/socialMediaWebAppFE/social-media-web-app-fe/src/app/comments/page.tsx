"use client";
import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

interface Comment {
  _id: string;
  author: User;
  postId: string;
  content: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  isReplying?: boolean;
  replyContent?: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [postId, setPostId] = useState("123");
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const replyInputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );
  const editorRef = useRef<HTMLDivElement>(null);

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  // Update content from editor
  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Clear formatting
  const clearFormatting = () => {
    document.execCommand("removeFormat", false, "");
    updateContent();
  };

  // Insert link
  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      formatText("createLink", url);
    }
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      // const res = await API.get("/auth/me");
      // setCurrentUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  // Fetch all comments on initial load
  const fetchComments = async () => {
    try {
      const res = await API.get("/comments/all");
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
    }
  };

  // Post a new comment
  const postComment = async () => {
    // Remove empty tags and check if content is empty
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    if (!plainText) return;

    try {
      await API.post("/comments", { postId, content });
      setContent("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment");
    }
  };

  // Like a comment
  const likeComment = async (commentId: string) => {
    try {
      await API.post(`/comments/${commentId}/like`);
    } catch (error) {
      console.error("Failed to like comment:", error);
      toast.error("Failed to like comment");
    }
  };

  // Unlike a comment
  const unlikeComment = async (commentId: string) => {
    try {
      await API.post(`/comments/${commentId}/unlike`);
    } catch (error) {
      console.error("Failed to unlike comment:", error);
      toast.error("Failed to unlike comment");
    }
  };

  // Toggle reply input visibility
  const toggleReply = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, isReplying: !comment.isReplying, replyContent: "" }
          : comment
      )
    );

    // Focus on the reply input when it becomes visible
    setTimeout(() => {
      if (replyInputRefs.current[commentId]) {
        replyInputRefs.current[commentId]?.focus();
      }
    }, 100);
  };

  // Post a reply to a comment
  const postReply = async (commentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;

    try {
      await API.post(`/comments/${commentId}/reply`, { content: replyContent });

      // Reset the reply state
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, isReplying: false, replyContent: "" }
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply");
    }
  };

  // Update reply content in state
  const updateReplyContent = (commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, replyContent: content }
          : comment
      )
    );
  };

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view comments");
      return;
    }

    fetchCurrentUser();

    // Initialize socket connection
    socketRef.current = io(
      "https://socialmediawebbeinnestjs-production.up.railway.app",
      {
        transports: ["websocket"],
        query: { token },
      }
    );

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");

      // Join the post room to receive comment updates for this specific post
      socketRef.current?.emit("joinPost", { postId });
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Listen for new comments
    socketRef.current.on("newComment", (newComment: Comment) => {
      // Only add if it belongs to the current post
      if (newComment.postId === postId) {
        setComments((prev) => [...prev, newComment]);

        // Show notification
        toast.success(
          `${
            newComment.author.username
          } commented: "${newComment.content.replace(/<[^>]*>/g, "")}"`,
          {
            icon: "💬",
            duration: 4000,
          }
        );
      }
    });

    // Listen for comment like updates
    socketRef.current.on(
      "commentLikeUpdated",
      (data: {
        commentId: string;
        likesCount: number;
        liked: boolean;
        likedBy: string | null;
      }) => {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === data.commentId
              ? { ...comment, likes: Array(data.likesCount).fill("dummy") } // Simplified for demo
              : comment
          )
        );

        // Show notification if someone liked a comment
        if (data.liked && data.likedBy && data.commentId) {
          const comment = comments.find((c) => c._id === data.commentId);
          if (comment && currentUser && data.likedBy !== currentUser.username) {
            toast.success(`${data.likedBy} liked your comment`, {
              icon: "❤️",
              duration: 3000,
            });
          }
        }
      }
    );

    // Listen for new replies
    socketRef.current.on(
      "replyCreated",
      (data: { commentId: string; parentId: string }) => {
        // Refetch replies for the parent comment
        // In a real app, you might want to fetch the specific reply
        fetchComments();

        // Show notification if it's a reply to the current user's comment
        const parentComment = comments.find((c) => c._id === data.parentId);
        if (
          parentComment &&
          currentUser &&
          parentComment.author._id === currentUser._id
        ) {
          toast.success("Someone replied to your comment", {
            icon: "↩️",
            duration: 4000,
          });
        }
      }
    );

    // Fetch initial comments
    fetchComments();

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [postId, currentUser]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postComment();
    }
  };

  const handleReplyKeyPress = (commentId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const comment = comments.find((c) => c._id === commentId);
      if (comment && comment.replyContent) {
        postReply(commentId, comment.replyContent);
      }
    }
  };

  // Check if current user has liked a comment
  const hasLiked = (comment: Comment) => {
    return currentUser && comment.likes.includes(currentUser._id);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comments</h1>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-500">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Comment input */}
      <div className="mb-6">
        {/* Rich Text Editor Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
          <button
            type="button"
            onClick={() => formatText("bold")}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => formatText("italic")}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => formatText("underline")}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200"
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200"
            title="Insert Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={clearFormatting}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200"
            title="Clear Formatting"
          >
            🧹
          </button>
        </div>

        {/* Rich Text Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="w-full p-3 border border-gray-300 border-t-0 rounded-b-lg min-h-[100px] max-h-[200px] overflow-y-auto focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-placeholder="Write a comment..."
          onInput={updateContent}
          onKeyDown={handleKeyPress}
          style={{
            outline: "none",
            lineHeight: "1.5",
          }}
        ></div>

        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={postComment}
            disabled={!content.replace(/<[^>]*>/g, "").trim()}
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {comment.author.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-blue-600 font-medium">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">
                      {comment.author.username}
                    </h3>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className="text-gray-700 mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                  <div className="flex items-center mt-2 space-x-3">
                    <button
                      className={`text-sm flex items-center ${
                        hasLiked(comment)
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                      onClick={() =>
                        hasLiked(comment)
                          ? unlikeComment(comment._id)
                          : likeComment(comment._id)
                      }
                    >
                      <span className="mr-1">❤️</span>
                      Like ({comment.likes.length})
                    </button>
                    <button
                      className="text-sm text-gray-500 hover:text-blue-600"
                      onClick={() => toggleReply(comment._id)}
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply input */}
                  {comment.isReplying && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <textarea
                        ref={(el) => {
                          replyInputRefs.current[comment._id] = el; // assignment only
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-placeholder="Write a reply..."
                        rows={2}
                        value={comment.replyContent || ""}
                        onChange={(e) =>
                          updateReplyContent(comment._id, e.target.value)
                        }
                        onKeyDown={(e) => handleReplyKeyPress(comment._id, e)}
                      />

                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          className="px-3 py-1 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                          onClick={() => toggleReply(comment._id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            postReply(comment._id, comment.replyContent || "")
                          }
                          disabled={!comment.replyContent?.trim()}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies list */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="py-2">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                {reply.author.avatarUrl ? (
                                  <img
                                    src={reply.author.avatarUrl}
                                    alt={reply.author.username}
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <span className="text-green-600 text-xs font-medium">
                                    {reply.author.username
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {reply.author.username}
                                </h4>
                                <span className="mx-1 text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div
                                className="text-sm text-gray-700 mt-1 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: reply.content,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";
import { useGetPostsQuery } from "../services/postsApi";

export default function Postist() {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error fetching posts</p>;

  return (
    <div className="space-y-4 mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Getting Posts Via rtk Query </h1>
      {data.slice(0, 10).map((post) => (
        <div key={post.id} className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   API.get(`/users/${id}`).then((res) => setUser(res.data));
  // }, [id]);

  const follow = () =>
    API.post(`/users/${id}/follow`).then(() => alert("Followed!"));
  const unfollow = () =>
    API.post(`/users/${id}/unfollow`).then(() => alert("Unfollowed!"));

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold">{user.username}</h1>
      <p>{user.bio}</p>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={follow}
        >
          Follow
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={unfollow}
        >
          Unfollow
        </button>
      </div>
    </div>
  );
}

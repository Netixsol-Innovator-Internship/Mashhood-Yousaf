"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  username: string;
  bio: string;
  avatarUrl: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  isFollowing?: boolean;
}

interface DiscoverUser {
  _id: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

interface Follower {
  _id: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoverUser[]>([]);
  const [allUsers, setAllUsers] = useState<DiscoverUser[]>([]);
  const [activeTab, setActiveTab] = useState<
    "profile" | "followers" | "following" | "discover" | "allusers"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: "", avatarUrl: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Fetch current user profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/users/me");
      setProfile(res.data);
      setEditData({
        bio: res.data.bio || "",
        avatarUrl: res.data.avatarUrl || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch followers list
  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/users/me/followers");
      setFollowers(res.data);
    } catch (error: any) {
      console.error("Failed to fetch followers:", error);
      setFollowers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch following list
  const fetchFollowing = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/users/me/following");
      setFollowing(res.data);
    } catch (error: any) {
      console.error("Failed to fetch following:", error);
      setFollowing([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch discover users (users not followed yet)
  const fetchDiscoverUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/users/discover");
      const usersWithStatus = await Promise.all(
        res.data.map(async (user: DiscoverUser) => {
          try {
            const followingStatus = await API.get(
              `/users/${user._id}/isfollowing`
            );
            return { ...user, isFollowing: followingStatus.data };
          } catch {
            return { ...user, isFollowing: false };
          }
        })
      );
      setDiscoverUsers(usersWithStatus);
    } catch (error: any) {
      console.error("Failed to fetch discover users:", error);
      setDiscoverUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all users with search
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(`/users?search=${searchQuery}`);
      const usersWithStatus = await Promise.all(
        res.data.users.map(async (user: DiscoverUser) => {
          try {
            const followingStatus = await API.get(
              `/users/${user._id}/isfollowing`
            );
            return { ...user, isFollowing: followingStatus.data };
          } catch {
            return { ...user, isFollowing: false };
          }
        })
      );
      setAllUsers(usersWithStatus);
    } catch (error: any) {
      console.error("Failed to fetch all users:", error);
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const res = await API.patch("/users/me", editData);
      setProfile(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Follow a user
  const followUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await API.post(`/users/${userId}/follow`);
      toast.success("Followed user successfully");

      // Update UI state
      setDiscoverUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: true } : user
        )
      );
      setAllUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: true } : user
        )
      );

      // Refresh counts
      fetchProfile();
      if (activeTab === "following") fetchFollowing();
      if (activeTab === "followers") fetchFollowers();
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error("Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await API.post(`/users/${userId}/unfollow`);
      toast.success("Unfollowed user successfully");

      // Update UI state
      setDiscoverUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: false } : user
        )
      );
      setAllUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: false } : user
        )
      );

      // Refresh counts
      fetchProfile();
      if (activeTab === "following") fetchFollowing();
      if (activeTab === "followers") fetchFollowers();
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      toast.error("Failed to unfollow user");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (
    tab: "profile" | "followers" | "following" | "discover" | "allusers"
  ) => {
    setActiveTab(tab);
    if (tab === "followers") fetchFollowers();
    if (tab === "following") fetchFollowing();
    if (tab === "discover") fetchDiscoverUsers();
    if (tab === "allusers") fetchAllUsers();
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAllUsers();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile && isLoading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Profile Not Found</h1>
        <p>Unable to load your profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Content */}
      <div className="mb-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={editData.avatarUrl}
                onChange={(e) =>
                  setEditData({ ...editData, avatarUrl: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                data-placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={editData.bio}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                data-placeholder="Tell us about yourself..."
              />
            </div>
            <button
              onClick={updateProfile}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 text-xl font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile.username}</h2>
              <p className="text-gray-600">{profile.email}</p>
              {profile.bio && (
                <p className="text-gray-800 mt-2">{profile.bio}</p>
              )}
              <div className="flex space-x-4 mt-3">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => handleTabChange("followers")}
                >
                  <div className="text-lg font-bold">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div
                  className="text-center cursor-pointer"
                  onClick={() => handleTabChange("following")}
                >
                  <div className="text-lg font-bold">
                    {profile.followingCount}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleTabChange("followers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "followers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Followers ({profile.followersCount})
          </button>
          <button
            onClick={() => handleTabChange("following")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "following"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Following ({profile.followingCount})
          </button>
          <button
            onClick={() => handleTabChange("discover")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "discover"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Discover Users
          </button>
          <button
            onClick={() => handleTabChange("allusers")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "allusers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Users
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {activeTab === "profile" && !isLoading && (
          <div>
            <h3 className="text-lg font-medium mb-4">Profile Information</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium">{profile.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="font-medium">{profile.bio || "No bio yet"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "followers" && !isLoading && (
          <div>
            <h3 className="text-lg font-medium mb-4">Your Followers</h3>
            {followers.length > 0 ? (
              <div className="space-y-3">
                {followers.map((follower) => (
                  <div
                    key={follower._id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {follower.avatarUrl ? (
                          <img
                            src={follower.avatarUrl}
                            alt={follower.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {follower.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{follower.username}</p>
                        {follower.bio && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {follower.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => followUser(follower._id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Follow Back
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                You don't have any followers yet.
              </p>
            )}
          </div>
        )}

        {activeTab === "following" && !isLoading && (
          <div>
            <h3 className="text-lg font-medium mb-4">People You Follow</h3>
            {following.length > 0 ? (
              <div className="space-y-3">
                {following.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => unfollowUser(user._id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                You're not following anyone yet.
              </p>
            )}
          </div>
        )}

        {activeTab === "discover" && !isLoading && (
          <div>
            <h3 className="text-lg font-medium mb-4">Discover Users</h3>
            <p className="text-gray-600 mb-4">Find new people to follow</p>
            {discoverUsers.length > 0 ? (
              <div className="space-y-3">
                {discoverUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {user.followersCount} followers
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.followingCount} following
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        user.isFollowing
                          ? unfollowUser(user._id)
                          : followUser(user._id)
                      }
                      disabled={isLoading}
                      className={`px-3 py-1 text-white text-sm rounded disabled:opacity-50 ${
                        user.isFollowing
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No users to discover right now.
              </p>
            )}
          </div>
        )}

        {activeTab === "allusers" && !isLoading && (
          <div>
            <h3 className="text-lg font-medium mb-4">All Users</h3>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  data-placeholder="Search users..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>
            {allUsers.length > 0 ? (
              <div className="space-y-3">
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {user.followersCount} followers
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.followingCount} following
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        user.isFollowing
                          ? unfollowUser(user._id)
                          : followUser(user._id)
                      }
                      disabled={isLoading}
                      className={`px-3 py-1 text-white text-sm rounded disabled:opacity-50 ${
                        user.isFollowing
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

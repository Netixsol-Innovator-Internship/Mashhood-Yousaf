import { useState, useEffect } from "react";
import axios from "axios";

const NotificationsBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/notifications/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update local state
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatNotificationMessage = (notification) => {
    switch (notification.type) {
      case "REVIEW_ADDED":
        return (
          <div>
            <p className="font-medium">{notification.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      case "REVIEW_REPLIED":
        return (
          <div>
            <p className="font-medium">{notification.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
      default:
        return <p>{notification.message}</p>;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-blue-600"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  }`}
                  onClick={() =>
                    !notification.read && markAsRead(notification._id)
                  }
                >
                  {formatNotificationMessage(notification)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;

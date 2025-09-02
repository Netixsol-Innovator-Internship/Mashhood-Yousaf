import React from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
} from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const roleOptionsForSuperAdmin = ["admin", "user"];
const roleOptionsForAdmin = ["user"]; // Admin can only change roles to user

const GetUsers = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [blockUnblockUser] = useBlockUnblockUserMutation();

  const currentUserRole = localStorage.getItem("roleOfTheUser"); // "superAdmin" or "admin"

  const roleColors = {
    superAdmin: "bg-red-500",
    admin: "bg-yellow-400",
    user: "bg-blue-400",
  };

  // Role change permission logic
  const canChangeRole = (currentUserRole, targetUserRole) => {
    // No one can change superAdmin roles
    if (targetUserRole === "superAdmin") return false;

    // SuperAdmin can change admin and user roles
    if (currentUserRole === "superAdmin") return true;

    // Admin can only change user roles (not admin or superAdmin)
    if (currentUserRole === "admin" && targetUserRole === "user") return true;

    return false;
  };

  // Block/unblock permissions logic
  const canBlockUnblock = (currentUserRole, targetUserRole) => {
    // No one can block/unblock superAdmin
    if (targetUserRole === "superAdmin") return false;

    // SuperAdmin can block/unblock anyone except superAdmin
    if (currentUserRole === "superAdmin") return true;

    // Admin can only block/unblock users
    if (currentUserRole === "admin" && targetUserRole === "user") return true;

    return false;
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, newRole }).unwrap();
      alert("Role updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Failed to update role");
    }
  };

  const handleBlockChange = async (userId, action) => {
    try {
      await blockUnblockUser({ id: userId, action }).unwrap();
      alert(`User ${action}ed successfully`);
    } catch (err) {
      alert(err?.data?.message || "Failed to update block status");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

return (
  <div className="max-w-7xl mx-auto p-6">
    <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
      Users Directory
    </h2>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {data?.data?.map((user) => {
          const canEditRole = canChangeRole(currentUserRole, user.role);
          const canEditBlock = canBlockUnblock(currentUserRole, user.role);

          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              {/* User Avatar and Basic Info */}
              <div className="flex items-start space-x-4 mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-indigo-100 bg-indigo-50 text-2xl text-indigo-600">
                    👤
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg font-semibold text-gray-900 truncate"
                    title={user.name}
                  >
                    {user.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600 truncate mb-2"
                    title={user.email}
                  >
                    {user.email}
                  </p>

                  {/* Role and Block Status */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        roleColors[user.role] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>

                    {user.isBlocked && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🔒 Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 mb-6 line-clamp-3 bg-gray-50 p-3 rounded-lg">
                {user.bio || "No bio available"}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Role Change Dropdown */}
                {canEditRole && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Change Role
                    </label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200 appearance-none bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      {currentUserRole === "superAdmin"
                        ? roleOptionsForSuperAdmin.map((roleOpt) => (
                            <option key={roleOpt} value={roleOpt}>
                              {roleOpt}
                            </option>
                          ))
                        : roleOptionsForAdmin.map((roleOpt) => (
                            <option key={roleOpt} value={roleOpt}>
                              {roleOpt}
                            </option>
                          ))}
                    </select>
                  </div>
                )}

                {/* Block/Unblock Dropdown */}
                {canEditBlock && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Account Status
                    </label>
                    <select
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200 appearance-none bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100"
                      value={user.isBlocked ? "block" : "unblock"}
                      onChange={(e) =>
                        handleBlockChange(user._id, e.target.value)
                      }
                    >
                      <option value="unblock">✅ Unblocked</option>
                      <option value="block">❌ Block</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  </div>
);
};

export default GetUsers;

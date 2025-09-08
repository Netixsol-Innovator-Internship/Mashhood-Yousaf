"use client";
import React from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/api/shopCoApi";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

export default function Users() {
  const { data: users, isLoading, refetch } = useGetAllUsersQuery();
  const [updateRole, { isLoading: updating }] = useUpdateUserRoleMutation();

  // 1. Get token and decode role
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  let currentUserRole = "user"; // fallback
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserRole = decoded?.role || "user";
    } catch {
      console.error("Invalid token");
    }
  }

  // 2. Handle Role Change
  const handleChange = async (id, role) => {
    try {
      await updateRole({ id, role }).unwrap();
      refetch();
      toast.success(`Role change to ${role}`)
    } catch {
      alert("Failed to update user role");
    }
  };

  // 3. Logic: Who can change whom?
  const canEditRole = (targetRole) => {
    // Only superadmins can change any role (except other superadmins)
    return currentUserRole === "superadmin" && targetRole !== "superadmin";
  };

  const getRoleOptions = (targetRole) => {
    // Only superadmin can change roles, and only to user or admin
    if (currentUserRole === "superadmin" && targetRole !== "superadmin") {
      return ["user", "admin"];
    }
    return [];
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
      />
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {isLoading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : (
          <table className="min-w-full table-auto border-separate border-spacing-y-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  ID
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Change Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ _id, name, email, role }) => {
                const editable = canEditRole(role);
                const options = getRoleOptions(role);

                return (
                  <tr key={_id} className="bg-white shadow rounded border-b">
                    <td className="py-2 px-4 text-sm text-gray-800">{_id}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{name}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">{email}</td>
                    <td className="py-2 px-4 text-sm text-gray-800 capitalize">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-white ${
                          role === "admin"
                            ? "bg-blue-500"
                            : role === "moderator"
                            ? "bg-purple-500"
                            : role === "superadmin"
                            ? "bg-yellow-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {role}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      {editable && options.length > 0 ? (
                        <select
                          disabled={updating}
                          value={role}
                          onChange={(e) => handleChange(_id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400 italic">
                          Not allowed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </ProtectedRoute>
  );
}

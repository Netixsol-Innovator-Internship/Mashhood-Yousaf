"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetAllOrdersQuery,
  useGetProductsQuery,
} from "../../../api/shopCoApi";
import DashboardStats from "@/components/DashboardStats";

export default function Dashboard() {
  
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const {
    data: orders,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);

  console.log("orders", orders);
  console.log("users", users);
  console.log("stats", stats);
  console.log("products", products);

  useEffect(() => {
    if (orders) {
      let ordersArray = [];

      // Handle different possible structures of orders data
      if (Array.isArray(orders)) {
        ordersArray = orders;
      } else if (orders && orders.orders && Array.isArray(orders.orders)) {
        ordersArray = orders.orders;
      }

      const pending = ordersArray.filter(
        (order) => order.status?.toLowerCase() === "pending"
      );
      setPendingOrdersCount(pending.length);
      console.log("Pending Orders:", pending);
    }
  }, [orders, refreshCounter]);

  // Function to manually refresh orders
  const refreshOrders = () => {
    refetchOrders();
    setRefreshCounter((prev) => prev + 1);
  };

  // Get pending orders array for display
  const getPendingOrders = () => {
    if (!orders) return [];

    let ordersArray = [];
    if (Array.isArray(orders)) {
      ordersArray = orders;
    } else if (orders.orders && Array.isArray(orders.orders)) {
      ordersArray = orders.orders;
    }

    return ordersArray.filter(
      (order) => order.status?.toLowerCase() === "pending"
    );
  };

  const pendingOrders = getPendingOrders();
  console.log("Pending Orders:", pendingOrders);

  return (
    <ProtectedRoute>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6 bg-[#E7E7E3] space-y-8">
        <section>
          {statsLoading || ordersLoading || usersLoading ? (
            <p>Loading stats...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* Total Orders Stat */}
              <StatBox
                title="Total Orders"
                value={
                  Array.isArray(orders) ? orders.length : orders?.total || 0
                }
                comparisonValue={34.7}
                comparisonDirection="up"
              />
              {/* Active Orders Stat */}
              <StatBox
                title="Active Orders"
                value={pendingOrdersCount}
                comparisonValue={12.3}
                comparisonDirection="up"
              />
              {/* Registered Users Stat */}
              <StatBox
                title="Registered Users"
                value={Array.isArray(users) ? users.length : users?.total || 0}
              />
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dashboard Stats</h2>
          {statsLoading ? (
            <p>Loading stats...</p>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              <DashboardStats />
            </div>
          )}
        </section>

        <section className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Users
          </h2>
          {usersLoading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : (
            <table className="min-w-full table-auto border-separate border-spacing-y-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Created At
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  (Array.isArray(users) ? users : users.users || [])
                    .slice(0, 5)
                    .map(({ _id, name, createdAt, isActive, email }) => (
                      <tr key={_id} className="border-b">
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {name}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {new Date(createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-white ${
                              isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {email}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Orders
          </h2>
          {ordersLoading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : (
            <table className="min-w-full table-auto border-separate border-spacing-y-4">
              <thead>
                <tr className="">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    User Name
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Shipping City
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  (Array.isArray(orders) ? orders : orders.orders || [])
                    .slice(0, 5)
                    .map(
                      ({
                        _id,
                        userId,
                        shippingAddress,
                        totalAmount,
                        updatedAt,
                        status,
                      }) => (
                        <tr key={_id} className="border-b">
                          <td className="py-2 px-4 text-sm text-gray-800 truncate max-w-xs">
                            {_id}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-800">
                            {userId?.name || "N/A"}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-800">
                            {userId?.email || "N/A"}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-800">{`$${
                            totalAmount || 0
                          }`}</td>
                          <td className="py-2 px-4 text-sm text-gray-800">
                            {shippingAddress?.city || "N/A"}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-800">
                            {status || "N/A"}
                          </td>
                          <td className="py-2 px-4 text-sm text-gray-800">
                            {new Date(updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    )}
              </tbody>
            </table>
          )}
        </section>

        <section className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Products
          </h2>
          {productsLoading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : (
            <table className="min-w-full table-auto border-separate border-spacing-y-4">
              <thead>
                <tr className=" ">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    P-ID
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  (Array.isArray(products) ? products : products.products || [])
                    .slice(0, 5)
                    .map(({ _id, title, category, price }) => (
                      <tr key={_id} className="border-b">
                        <td className="py-2 px-4 text-sm text-gray-800 truncate max-w-xs">
                          {_id}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {title}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">
                          {category}
                        </td>
                        <td className="py-2 px-4 text-sm text-gray-800">{`$${price}`}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}

function StatBox({ title, value, comparisonValue, comparisonDirection }) {
  const arrowIcon = comparisonDirection === "up" ? "↑" : "↓";

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg flex justify-between items-center">
      <div className="flex flex-col justify-start">
        <div className="flex justify-between items-center">
          <h3 className="text-[12px] font-semibold text-gray-700">{title}</h3>
          <div className="text-gray-500">
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>

        <p className="text-sm font-bold text-gray-900">{value}</p>

        {comparisonValue && (
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm ${
                comparisonDirection === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {arrowIcon} {comparisonValue}%
            </span>
            <p className="text-[8px] text-gray-500">
              Compared to previous month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

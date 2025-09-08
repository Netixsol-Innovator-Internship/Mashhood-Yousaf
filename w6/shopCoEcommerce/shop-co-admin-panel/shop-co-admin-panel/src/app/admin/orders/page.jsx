"use client";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/api/shopCoApi";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure you import the necessary CSS

export default function Orders() {
  const { data, isLoading, refetch } = useGetAllOrdersQuery(); // Destructure refetch here
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

   const router = useRouter();

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistically update the UI by modifying the local state
    const updatedOrders = data.orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );

    // Since we don't have a local state for `data.orders`, this won't update the UI automatically.
    // Refetch the data after mutation to get the latest orders from the server.

    try {
      // Make the mutation request to update the status
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success("status updated!");
      // Refetch orders after successful update to get the latest data
      refetch();
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("failed!");
      // Optionally, you could revert the optimistic update in case of failure
    }
  };

  const handleOrderClick = (orderId) => {
    router.push(`/admin/orders/${orderId}`); // Navigate to the OrderDetails page with orderId as a URL parameter
  };

  return (
    <ProtectedRoute>
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={false}
      />
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <h1 className="text-3xl font-bold mb-6">Recent Purchases</h1>
        {isLoading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : (
          <table className="min-w-full table-auto border-separate border-spacing-y-4">
            <thead>
              <tr className="cursor-pointer bg-gray-100">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Order ID
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  User
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map(
                ({ _id, userId, status, totalAmount, createdAt }) => (
                  <tr
                    key={_id}
                    onClick={() => handleOrderClick(_id)}
                    className="border-b cursor-pointer "
                  >
                    <td className="py-2 px-4 text-sm text-gray-800">{_id}</td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      {userId?.name} ({userId?.email})
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      <span
                        className={`inline-block px-2 py-1 rounded text-white ${
                          status === "shipped" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      ${totalAmount}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      {new Date(createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-800">
                      <button
                        onClick={() => handleStatusUpdate(_id, "shipped")}
                        disabled={isUpdating}
                        className="bg-blue-500 text-white text-[11px] p-1 rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        Mark as Shipped
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </main>
    </ProtectedRoute>
  );
}

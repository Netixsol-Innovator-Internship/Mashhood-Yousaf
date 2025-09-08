"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import { useGetOrderByIdQuery } from "@/api/shopCoApi";
import {
  FaUser,
  FaShoppingBag,
  FaCreditCard,
  FaFileDownload,
  FaPrint,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error loading order details: {error.message}</p>
      </div>
    );

  const downloadOrderInfo = () => {
    const orderDetails = `
      Order ID: #${data._id}
      Status: ${data.status}
      Customer: ${data.userId.name}
      Email: ${data.userId.email}
      Phone: ${data.userId.phone}
      Payment Method: ${data.paymentMethod}
      Delivery Address: ${data.shippingAddress?.address || "N/A"}
    `;
    const blob = new Blob([orderDetails], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Order_${data._id}_Details.txt`;
    link.click();
  };

  const handlePrint = () => print();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#003F62] text-white rounded-md lg:hidden"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      <Sidebar />
      <Header />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="lg:ml-64 pt-16 p-4 md:p-6 bg-gray-50 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Order Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-semibold">
              Order ID: #{data._id} -{" "}
              <span className="text-blue-600 capitalize">{data.status}</span>
            </h1>
            <div className="text-gray-600 text-sm md:text-base">
              <span>
                {new Date(data.createdAt).toLocaleDateString()} -{" "}
                {new Date(data.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Info Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Customer Details Card */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-black p-2 rounded mr-3">
                  <FaUser className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold">Customer</h3>
              </div>
              <div className="space-y-2 text-sm md:text-base">
                <p>
                  <strong className="text-gray-600">Full Name:</strong>{" "}
                  {data.userId.name}
                </p>
                <p>
                  <strong className="text-gray-600">Email:</strong>{" "}
                  {data.userId.email}
                </p>
                <p>
                  <strong className="text-gray-600">Phone:</strong>{" "}
                  {data.userId.phone}
                </p>
              </div>
              <button
                onClick={downloadOrderInfo}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4 text-sm w-full flex items-center justify-center"
              >
                <FaFileDownload className="mr-2" /> Download Info
              </button>
            </div>

            {/* Order Info Card */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-black p-2 rounded mr-3">
                  <FaShoppingBag className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold">Order Info</h3>
              </div>
              <div className="space-y-2 text-sm md:text-base">
                <p>
                  <strong className="text-gray-600">Shipping:</strong>{" "}
                </p>
                <p>
                  <strong className="text-gray-600">Payment Method:</strong>{" "}
                  {data.paymentMethod}
                </p>
                <p>
                  <strong className="text-gray-600">Status:</strong>{" "}
                  <span className="capitalize">{data.status}</span>
                </p>
              </div>
              <button
                onClick={downloadOrderInfo}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4 text-sm w-full flex items-center justify-center"
              >
                <FaFileDownload className="mr-2" /> Download Info
              </button>
            </div>

            {/* Shipping Info Card */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-black p-2 rounded mr-3">
                  <FaShoppingBag className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold">Deliver To</h3>
              </div>
              <div className="space-y-2 text-sm md:text-base">
                <p>
                  <strong className="text-gray-600">Address:</strong>{" "}
                  {data.shippingAddress?.address || "N/A"}
                </p>
                {data.shippingAddress?.city && (
                  <p>
                    <strong className="text-gray-600">City:</strong>{" "}
                    {data.shippingAddress.city}
                  </p>
                )}
                {data.shippingAddress?.postalCode && (
                  <p>
                    <strong className="text-gray-600">Postal Code:</strong>{" "}
                    {data.shippingAddress.postalCode}
                  </p>
                )}
              </div>
              <button
                onClick={downloadOrderInfo}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4 text-sm w-full flex items-center justify-center"
              >
                <FaFileDownload className="mr-2" /> Download Info
              </button>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-black p-2 rounded mr-3">
                <FaCreditCard className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-semibold">Payment Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
              {/* <p>
                <strong className="text-gray-600">Card Info:</strong>{" "}
                {data.paymentMethod === "MasterCard" && data.cardLast4
                  ? `**** **** ${data.cardLast4}`
                  : "N/A"}
              </p> */}
              <p>
                <strong className="text-gray-600">Business Name:</strong>{" "}
                {data.userId.name}
              </p>
              <p>
                <strong className="text-gray-600">Phone:</strong>{" "}
                {data.userId.phone}
              </p>
              <p>
                <strong className="text-gray-600">Order Total:</strong> $
                {data.totalAmount || "N/A"}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type some notes..."
              rows={4}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={handlePrint}
              className="p-3 flex items-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetails;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white/5 backdrop-blur-xl shadow-xl rounded-3xl p-10 border border-white/10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-10 tracking-tight">
          🚀 Admin Control Center
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Product */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <Link to="/add-product" className="block h-full">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <div className="text-xl font-semibold">Add Product</div>
              <p className="text-sm opacity-80 mt-1">
                Quickly add new items to your store.
              </p>
            </Link>
          </motion.div>

          {/* View Users */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-tr from-green-600 via-green-500 to-green-700 rounded-xl p-6 text-white shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <Link to="/getUsers" className="block h-full">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                👥
              </div>
              <div className="text-xl font-semibold">View Users</div>
              <p className="text-sm opacity-80 mt-1">
                Manage platform users and permissions.
              </p>
            </Link>
          </motion.div>

          {/* See Products */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-tr from-purple-600 via-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <Link to="/admin-products" className="block h-full">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                📦
              </div>
              <div className="text-xl font-semibold">Manage Products</div>
              <p className="text-sm opacity-80 mt-1">
                Edit, remove or restock existing items.
              </p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;

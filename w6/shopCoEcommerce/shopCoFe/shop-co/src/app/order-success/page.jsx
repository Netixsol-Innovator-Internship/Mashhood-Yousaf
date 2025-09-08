"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function OrderSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="flex justify-center"
        >
          <CheckCircleIcon className="w-20 h-20 text-green-500" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold mt-6"
        >
          Order Confirmed 🎉
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mt-3 text-sm sm:text-base"
        >
          Thank you for shopping with us. Your order has been placed
          successfully and is on its way! 🚚
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-lg font-medium shadow-md hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

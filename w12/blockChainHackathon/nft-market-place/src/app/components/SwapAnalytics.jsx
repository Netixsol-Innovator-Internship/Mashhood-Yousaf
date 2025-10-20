"use client";
import { motion } from "framer-motion";

export default function SwapAnalytics({
  swapFromToken,
  swapToToken,
  swapRate,
  priceImpact,
  impactDirection,
}) {
  if (!swapRate && !priceImpact) return null;

  const impactValue = parseFloat(priceImpact);

  return (
    <div className="mt-3 space-y-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
      {swapRate && (
        <div className="flex justify-between text-sm text-gray-200">
          <span>Rate:</span>
          <span className="font-medium">
            1 {swapFromToken} ≈ {swapRate.toFixed(4)} {swapToToken}
          </span>
        </div>
      )}

      {impactValue >= 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-200">Price Impact:</span>
          <span
            className={`font-semibold transition-all duration-300 ${
              impactDirection === "down" ? "text-red-400" : "text-green-400"
            }`}
          >
            {impactValue.toFixed(2)}% {impactDirection === "down" ? "🔻" : "🔺"}
          </span>
        </div>
      )}

      {impactValue > 0 && (
        <motion.div
          className="w-full h-2 rounded-full overflow-hidden bg-gray-700 mt-2"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(impactValue, 100)}%` }}
          transition={{ duration: 0.6 }}
        >
          <div
            className={`h-full ${
              impactDirection === "down" ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
        </motion.div>
      )}
    </div>
  );
}

"use client";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  return (
    <div className="w-full bg-blue-900 text-white text-sm">
      <div className="container max-w-7xl mx-auto   sm:px-6 lg:px-8 flex justify-between items-center px-4 py-3">
        {/* Left Section - Phone */}
        <div className="flex items-center space-x-2">
          <span className="font-medium">Call Us</span>
          <span className="text-gray-100">570-694-4002</span>
        </div>

        {/* Right Section - Email */}
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="h-4 w-4 text-gray-200" />
          <span className="font-medium">Email Id :</span>
          <a
            href="mailto:info@cardeposit.com"
            className="hover:underline text-gray-100"
          >
            info@cardeposit.com
          </a>
        </div>
      </div>
    </div>
  );
}

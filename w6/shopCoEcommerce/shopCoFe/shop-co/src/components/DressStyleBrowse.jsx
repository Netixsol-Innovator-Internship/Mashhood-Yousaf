'use client'
// components/DressStyleBrowse.js
import { useRouter } from "next/navigation"; // ✅ Correct import for App Router
import React from "react";

const DressStyleBrowse = () => {
   const router = useRouter();

   const handleCardClick = (dressStyle) => {
     router.push(`/products?dressStyle=${dressStyle.toLowerCase()}`);
   };
  
  return (
    <div className=" min-h-screen flex flex-col items-center py-12 px-4">
      <h2 className="text-2xl font-extrabold mb-8">BROWSE BY DRESS STYLE</h2>

      <div className="bg-gray-100 p-10  rounded-xl grid grid-cols-3 gap-4 max-w-4xl w-full">
        {/* Casual */}
        <div
          onClick={() => handleCardClick("casual")}
          className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer bg-white shadow-md"
        >
          <img
            src="/cs.png"
            alt="Casual"
            className="object-cover w-full h-full"
          />
          <span className="absolute top-3 left-3 text-black font-semibold text-lg">
            Casual
          </span>
        </div>

        {/* Formal (wide card, span 2 columns) */}
        <div
          onClick={() => handleCardClick("formal")}
          className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer bg-white shadow-md col-span-2"
        >
          <img
            src="/coatMan.png"
            alt="Formal"
            className="object-cover w-full h-full"
          />
          <span className="absolute top-3 left-3 text-black font-semibold text-lg">
            Formal
          </span>
        </div>

        {/* Party (wide card, span 2 columns) */}
        <div
          onClick={() => handleCardClick("party")}
          className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer bg-white shadow-md col-span-2"
        >
          <img
            src="/g.png"
            alt="Party"
            className="object-cover w-full h-full"
          />
          <span className="absolute top-3 left-3 text-black font-semibold text-lg">
            Party
          </span>
        </div>

        {/* Gym */}
        <div
          onClick={() => handleCardClick("gym")}
          className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer bg-white shadow-md"
        >
          <img
            src="/gymBoy.png"
            alt="Gym"
            className="object-cover w-full h-full"
          />
          <span className="absolute top-3 left-3 text-black font-semibold text-lg">
            Gym
          </span>
        </div>
      </div>
    </div>
  );
};

export default DressStyleBrowse;

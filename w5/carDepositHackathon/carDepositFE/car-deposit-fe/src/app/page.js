"use client";

import { useState } from "react";
import Header from "../components/Header"; // adjust path if needed
import { useGetAllAuctionsQuery } from "../store/apiSlice"; // adjust path
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  const { data: auctions, isLoading, isError } = useGetAllAuctionsQuery();
  console.log("auctions", auctions);
  // console.log('data', data)

  const handleSearch = () => {
    console.log({ make, model, year, price });
  };

  return (
    <>
      {/* 🔥 Hero Section with Search */}
      <section
        className="relative bg-cover bg-bottom min-h-screen text-white"
        style={{ backgroundImage: `url('/heroImg.jpg')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-0 left-0 w-full z-50">
          <Header />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-3xl">
            <div className="bg-[rgba(187,208,246,1)] text-blue-900 text-xs  p-3 font-light rounded mb-4 inline-block uppercase tracking-wide">
              Welcome to Auction
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your <br /> Dream Car
            </h1>
            <p className="text-gray-200  max-w-100 text-sm mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>

            {/* Search Box */}
            <div className="bg-white text-black p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4 items-center max-w-4xl w-full">
              <select
                className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              >
                <option value="">Make</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Jeep">Jeep</option>
              </select>

              <select
                className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="">Model</option>
                <option value="A4">A4</option>
                <option value="X5">X5</option>
                <option value="Grand Cherokee">Grand Cherokee</option>
              </select>

              <select
                className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Year</option>
                {Array.from({ length: 15 }, (_, i) => {
                  const y = 2025 - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>

              <select
                className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="">Price</option>
                <option value="under-20k">Under $20,000</option>
                <option value="20k-50k">$20,000 - $50,000</option>
                <option value="50k+">Over $50,000</option>
              </select>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 Live Auctions Section */}
      <section className="w-full py-16 bg-[rgba(46,61,131,1)]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Live Auctions
          </h2>

          {isLoading && (
            <p className="text-center py-10">Loading auctions...</p>
          )}
          {isError && (
            <p className="text-center py-10 text-red-500">
              Failed to load auctions.
            </p>
          )}

          <div className="grid gap- md:grid-cols-2 lg:grid-cols-4">
            {auctions?.slice(0, 4).map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==========================
   Auction Card Component
   ========================== */
const AuctionCard = ({ auction }) => {
  const endDate = new Date(auction.endDate).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href="/auctions"
      className="bg-white max-w-[280px] rounded-xl border border-gray-200 shadow-sm hover:shadow-md pb-3 transition overflow-hidden"
    >
      {/* Top Bar */}
      <div className="flex justify-between border-b border-gray-300 p-4 items-center px-4 pt-3">
        {/* Trending Badge */}
        <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Trending
        </div>

        {/* Car Title */}
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {auction?.car?.name || "Car Name"}
        </h3>

        {/* Bookmark Icon (placeholder star) */}
        {/* <div className="w-10 bg-amber-400"> */}
        <div className="text-blue-900 text-lg  font-bold">☆</div>
        {/* </div> */}
      </div>

      {/* Car Image */}
      <div className="relative w-full h-40 mt-2">
        <Image
          src={auction?.car?.image || "/car-placeholder.jpg"}
          alt={auction?.car?.name || "Car"}
          fill
          className="object-contain px-4"
        />
      </div>

      {/* Bid & Timer Info */}
      <div className="grid grid-cols-2 text-center px- py-3  ">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            ${auction?.currentBid?.toLocaleString() || "0.00"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current Bid</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">10 : 20 : 47</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for Bid</p>
        </div>
      </div>

      {/* Submit Bid Button */}
      <div className="px-5 py-3 ">
        <button className="w-full bg-blue-900 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-800 transition">
          Submit A Bid
        </button>
      </div>
    </Link>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import AuctionText from "@/components/AuctionText";
import Image from "next/image";
import { useGetAllAuctionsQuery } from "../../store/apiSlice";
import { getTimeLeft } from "../../hooks/getTimeLeft";
import Link from "next/link";

const AuctionsPage = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [now, setNow] = useState(Date.now());
  const { data: auctions, isLoading, isError } = useGetAllAuctionsQuery();

  // refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <p>Loading auctions...</p>;
  if (isError) return <p>Failed to load auctions</p>;

  return (
    <>
      <AuctionText
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbText="Auction"
      />
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-md">
            Showing 1–{auctions?.length} of {auctions?.length} Results
          </div>

          {auctions.map((auction) => {
            // timer hook use karo
            const timeLeft = getTimeLeft(auction.endDate, now);

            // agar auction khatam ho gaya to hide kar do
            if (!timeLeft) return null;

            return (
              <div
                key={auction._id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4"
              >
                {/* Image */}
                <div className="w-full md:w-48 h-32 relative">
                  <Image
                    src={auction?.car?.image || "/car-placeholder.jpg"}
                    alt={auction?.car?.name || "Car"}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {auction?.isTrending && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                      Trending
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-bold text-blue-900">
                    {auction?.car?.name || "Car Name"}
                  </h3>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-yellow-500 my-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 leading-snug max-w-[220px]">
                    {auction?.car?.description?.slice(0, 100) ||
                      "No description..."}
                    <span className="text-blue-700 ml-1 cursor-pointer">
                      View Details
                    </span>
                  </p>
                </div>

                {/* Bidding Info */}
                <div className="text-sm min-w-[200px]">
                  <div className="flex gap-10 justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold text-blue-800">
                        ${auction?.currentBid || "0.00"}
                      </p>
                      <p className="text-gray-500 text-xs">Current Bid</p>

                      {/* Live Countdown Timer */}
                      <div className="flex items-center gap-2 text-center text-xs text-gray-600">
                        {[
                          { label: "Days", value: timeLeft.days },
                          { label: "Hours", value: timeLeft.hours },
                          { label: "Mins", value: timeLeft.minutes },
                          { label: "Secs", value: timeLeft.seconds },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 bg-gray-100 rounded-md min-w-[45px]"
                          >
                            <p className="text-sm font-bold text-blue-900">
                              {item.value}
                            </p>
                            <p className="text-[10px]">{item.label}</p>
                          </div>
                        ))}
                      </div>
                      <p>Time Left</p>
                    </div>

                    <div className="items-center mt-2 text-xs text-gray-600">
                      <div className="flex flex-col gap-3">
                        <p className="font-semibold">
                          {auction?.totalBids || 0}
                        </p>
                        <p>Total Bids</p>
                        <p className="text-[rgba(46,61,131,1)] fo    ">
                          {new Date(auction?.endDate).toLocaleString()}
                        </p>
                        <p>End Time</p>
                      </div>
                    </div>
                  </div>

                  <Link href={`/auctions/${auction._id}`}>
                    <button className="w-full border border-blue-900 text-blue-900 font-semibold py-2 mt-4 rounded-lg hover:bg-blue-50">
                      Submit A Bid
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Filters */}
        <aside className="w-full max-h-[500px] lg:w-[320px] bg-blue-900 text-white rounded-xl space-y-4">
          <h3 className="text-lg p-3 bg-[rgba(70,88,172,1)] font-bold mb-2">
            Filter By
          </h3>
          <div className="max-w-[320px] p-4 ">
            {[
              "Any Car Type",
              "Any Color",
              "Any Makes",
              "Any Car Model",
              "Any Style",
            ].map((label, i) => (
              <select
                key={i}
                className="w-full text-sm text-[rgba(186,186,186,1)] p-3 mt-4 rounded border border-white"
              >
                <option>{label}</option>
              </select>
            ))}

            {/* Price Range */}
            <div className="flex flex-col mt-4 space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
              />
              <button className="bg-yellow-400 text-black font-bold py-2 mt-2 ">
                Filter
              </button>
              <p className="text-sm text-right mt-1">
                Price: ${priceRange[0] * 300} - ${priceRange[1] * 300}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AuctionsPage;

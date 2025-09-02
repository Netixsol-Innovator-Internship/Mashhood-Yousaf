"use client";

import { useParams } from "next/navigation";
import {
  useGetAuctionByIdQuery,
  useGetBidsByAuctionQuery,
} from "@/store/apiSlice";
import Image from "next/image";
import { getTimeLeft } from "../../../hooks/getTimeLeft";
import AuctionText from "../../../components/AuctionText";
import { useEffect, useState } from "react";
import BidSlider from "../../../components/BidSlider";

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const [now, setNow] = useState(Date.now());

  // Fetch auction data
  const {
    data: auction,
    isLoading: isAuctionLoading,
    isError: isAuctionError,
  } = useGetAuctionByIdQuery(id);

  // Fetch bids data
  const {
    data: bids,
    isLoading: isBidsLoading,
    isError: isBidsError,
  } = useGetBidsByAuctionQuery(id);

  // console.log('bids', bids)
  // console.log('auction', auction)
  // refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time left if auction exists
  const timeLeft = auction ? getTimeLeft(auction.endDate, now) : null;

  // Handle loading states
  if (isAuctionLoading || isBidsLoading) {
    return <p>Loading auction details...</p>;
  }

  // Handle error states
  if (isAuctionError) {
    return <p>Failed to load auction</p>;
  }

  if (isBidsError) {
    return <p>Failed to load bids</p>;
  }

  // Check if auction exists
  if (!auction) {
    return <p>No auction found</p>;
  }

  return (
    <>
      <AuctionText
        title={auction.car?.name || "Auction"}
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbText="Auction Details"
      />

      {/* Title Bar */}
      <div className="flex justify-between max-w-6xl p-4 rounded mt-3 mx-auto bg-[rgba(46,61,131,1)] text-white ">
        <p className="font-bold">{auction.car?.name || "Unnamed Auction"}</p>
        <img
          width={21}
          height={20}
          className=""
          src="/whiteStar.svg"
          alt="Star icon"
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl my-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Car Image */}
            <div className="my-4">
              <Image
                src={auction.car?.image || "/car-placeholder.jpg"}
                alt={auction.car?.name || "Car"}
                width={600}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="">
              {/* Bidding Info */}
              <div className="text-sm p-4">
                <div className="flex flex-col sm:flex-row gap-16 justify-center">
                  {/* Current Bid + Countdown */}
                  <div className="flex flex-col gap-2 items-">
                    <p className="font-semibold text-blue-800">
                      ${auction.currentBid?.toLocaleString() || "0.00"}
                    </p>
                    <p className="text-gray-500 text-xs">Current Bid</p>

                    {/* Countdown */}
                    {timeLeft && (
                      <div className="flex flex-col ">
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
                        <p className="mt-2">Time Left</p>
                      </div>
                    )}
                  </div>

                  {/* Total Bids + End Time */}
                  <div className="flex flex-col gap-2 items-end text-xs text-gray-600">
                    <p className="font-semibold">{bids.length || 0}</p>
                    <p>Total Bids</p>
                    <p className="text-[rgba(46,61,131,1)]">
                      {auction.endDate
                        ? new Date(auction.endDate).toLocaleString()
                        : "No end date"}
                    </p>
                    <p>End Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Bidders List */}
        <div className="flex flex-col lg:flex-row mt-6">
          <div className="desc flex-1 mb-6 lg:mb-0">
            <h3 className="font-bold text-[rgba(46,61,131,1)]">Description</h3>
            <span className="block w-20 h-1 bg-yellow-400 rounded"></span>
            <p className="mt-4 max-w-[750px] text-[rgba(141,141,141,1)]">
              {auction.car?.description || "No description available."}
            </p>
          </div>
          {/* bid submitter slider */}
          <div className="w-full lg:w-80 rounded overflow-hidden shadow-md">
            {/* bid submitter slider */}
            <BidSlider auction={auction} bids={bids} />

            <div className="bg-[rgba(46,61,131,1)] text-white px-6 mt-4 py-4 relative">
              <div className="absolute left-5 top-3 h-9 w-1 bg-yellow-400"></div>
              <h2 className="ml-4 font-semibold text-lg">Bidders List</h2>
            </div>

            <div className="bg-[rgba(241,242,255,1)] px-6 py-4 space-y-4 text-[rgba(46,61,131,1)]">
              {bids.length > 0 ? (
                bids.slice(0, 3).map((bid, index) => (
                  <div
                    key={bid._id || `bid-${index}`}
                    className="flex justify-between border-b border-[rgba(203,203,203,1)] pb-2"
                  >
                    <span>{bid.user?.username || `Bidder ${index + 1}`}</span>
                    <span className="font-semibold">
                      ${bid.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No bids yet</div>
              )}
              {bids.length > 3 && <div className="text-center text-xl">…</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

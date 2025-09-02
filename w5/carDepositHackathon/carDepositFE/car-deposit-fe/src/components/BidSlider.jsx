"use client";
import { useState } from "react";
import { usePlaceBidMutation } from "@/store/apiSlice"; // Adjust import

function BidSlider({ auction, bids }) {
  const [placeBid, { isLoading: isPlacing }] = usePlaceBidMutation();
  console.log('auction', auction)
  console.log('bids', bids)
  const startingBid = auction?.car?.price || 0;
  const currentBid =
    bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : startingBid;

  const [bidAmount, setBidAmount] = useState(currentBid);
  const step = 1000;

  const handleSubmit = async () => {
    try {
      await placeBid({
        amount: bidAmount,
        auctionId: auction._id,
        car: auction.car._id,
      }).unwrap();
      alert("Bid placed successfully!");
    } catch (err) {
      alert("Failed to place bid");
      console.log('err', err)
    }
  };

  return (
    <div className="bg-[rgba(241,242,255,1)]   ">
      <div className="px-6 py-4">
        <div className="flex justify-between text-[rgba(46,61,131,1)] font-bold  ">
          <div>
            <p>${startingBid.toLocaleString()}</p>
            <p className="text-sm text-[rgba(147,147,147,1)] font-normal">
              Bid Starts From
            </p>
          </div>
          <div>
            <p>${currentBid.toLocaleString()}</p>
            <p className="text-sm text-[rgba(147,147,147,1)]  font-normal">
              Current Bid
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="my-4">
          <input
            type="range"
            min={startingBid}
            max={startingBid + 10000000}
            value={bidAmount}
            step={step}
            className="w-full accent-[rgba(46,61,131,1)]"
            onChange={(e) => setBidAmount(Number(e.target.value))}
          />
        </div>

        {/* Total Bids and Amount Buttons */}
        <div className="flex items-center justify-between my-4 text-[rgba(46,61,131,1)]">
          <div className=" ">
            {bids.length}
            <p className="text-[rgba(147,147,147,1)]">TotalBids</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setBidAmount(Math.max(startingBid, bidAmount - step))
              }
              className="bg-white px-2  border border-gray-300 rounded"
            >
              –
            </button>
            <span className="min-w-[80px] bg-white p-1 text-[12px] border rounded border-amber-400 text-center">
              ${bidAmount.toLocaleString()}
            </span>
            <button
              onClick={() => setBidAmount(bidAmount + step)}
              className="bg-white px-2  border border-gray-300 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isPlacing}
          className="bg-[rgba(46,61,131,1)] text-white w-full py-2 font-bold rounded hover:bg-[rgba(46,61,131,0.9)] transition"
        >
          {isPlacing ? "Submitting..." : "Submit A Bid"}
        </button>
      </div>
    </div>
  );
}

export default BidSlider;

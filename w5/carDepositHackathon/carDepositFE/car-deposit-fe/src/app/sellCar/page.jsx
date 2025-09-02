"use client";

import React from "react";
import BlueClrHeader from "../../components/BlueClrHeader";
import AuctionText from "../../components/AuctionText";
import CreateCarForm from "../../components/CreateCarForm"; // ⬅️ Adjust path as needed

const SellCar = () => {
  return (
    <>
      <BlueClrHeader />

      <AuctionText
        title="Sell Your Car"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbText="Sell Your Car"
      />

      {/* Introduction Text */}
      <div className="max-w-2xl flex flex-col gap-4 mx-auto my-10 px-4">
        <h3 className="font-bold text-xl text-[rgba(0,0,0,1)]">
          Tell Us About Your Car
        </h3>
        <p className="text-sm text-[rgba(83,83,83,1)]">
          Please give us some basics about yourself and the car you’d like to
          sell. We’ll also need details about the car’s title status as well as
          photos that highlight the car’s exterior and interior condition.
        </p>
        <p className="text-sm text-[rgba(83,83,83,1)]">
          We’ll respond to your application within a business day, and we’ll
          work with you to build a professional listing and get the auction
          live.
        </p>
      </div>

      {/* Car Submission Form */}
      <div className="px-4 pb-16">
        <CreateCarForm />
      </div>
    </>
  );
};

export default SellCar;

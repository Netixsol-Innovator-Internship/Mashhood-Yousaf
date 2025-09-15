import DressStyleBrowse from "@/components/DressStyleBrowse";
import HeroSection from "@/components/HeroSection";
import LogosSection from "@/components/LogosSection";
import NewArrivals from "@/components/NewArrivals";
import TopSellings from "@/components/TopSellings";

import React, { Suspense } from "react";

const Home = () => {
  return (
    <>
      <HeroSection />
      <LogosSection />
      <Suspense fallback={<div className="text-center py-10">Loading new arrivals...</div>}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<div className="text-center py-10">Loading top selling items...</div>}>
        <TopSellings />
      </Suspense>
      <DressStyleBrowse />
    </>
  );
};

export default Home;

import DressStyleBrowse from "@/components/DressStyleBrowse";
import HeroSection from "@/components/HeroSection";
import LogosSection from "@/components/LogosSection";
import NewArrivals from "@/components/NewArrivals";
import TopSellings from "@/components/TopSellings";

import React from "react";

const Home = () => {
  return (
    <>
      <HeroSection />
      <LogosSection />
      <NewArrivals />
      <TopSellings />
      <DressStyleBrowse />
    </>
  );
};

export default Home;

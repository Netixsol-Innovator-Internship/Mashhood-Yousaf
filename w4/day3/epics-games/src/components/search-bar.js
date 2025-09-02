'use client'

import Image from "next/image";
import { useState } from "react";

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState("Discover");

  const tabs = ["Discover", "Browse", "News"];

  return (
    <section >
      <div className="flex mt-4 p-4 flex-col sm:flex-row text-white items-center gap-4">
        {/* Input with SVG icon inside */}
        <div className="relative">
          <Image
            src="/Union.svg"
            alt="search icon"
            width={14}
            height={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            className="bg-[rgba(32,32,32,1)] text-[rgba(160,160,160,1)] rounded-full px-10 py-3 focus:outline-none"
            placeholder="Search Store"
          />
        </div>

        {/* Navigation texts */}
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer ${
                activeTab === tab
                  ? "text-white "
                  : "text-[rgba(160,160,160,1)]"
              }`}
            >
              {tab}
            </p>
          ))}
        </nav>
      </div>
    </section>
  );
}

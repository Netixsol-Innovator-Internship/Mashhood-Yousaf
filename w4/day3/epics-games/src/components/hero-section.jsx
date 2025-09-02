import React, { useState } from "react";

const HeroSection = () => {
  const data = [
    {
      image: "/hwar.jpg",
      thumb: "/war.jpg",
      title: "God Of War 4",
      description:
        "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive.",
    },
    {
      image: "/ge.jpg", // Main hero image
      thumb: "/ge.jpg", // Thumbnail image
      title: "Farcry 6 Golden Edition",
      description:
        "Welcome to Yara, a tropical paradise frozen in time. As dictator of Yara, Anton Castillo is intent on restoring his nation to its former glory by any means necessary.",
    },
    {
      image: "/gta.jpg",
      thumb: "/gta.jpg",
      title: "GTA V",
      description:
        "Enter the lives of three very different criminals and explore the sprawling city of Los Santos in the ultimate open-world experience.",
    },
    {
      image: "/outlast.png",
      thumb: "/outlast.png",
      title: "Outlast 2",
      description:
        "You are Blake Langermann, a cameraman working with your wife, Lynn. You’re both investigative journalists willing to take risks and dig deep to uncover the stories no one else will dare touch.",
    },
  ];

  const [selected, setSelected] = useState(data[0]);

  return (
    <section className="flex flex-col lg:flex-row gap-6 p-4 bg-black m-h-screen text-white">
      {/* Left Hero Image Section */}
      <div
        style={{
          backgroundImage: `url(${selected.image})`,
        }}
        className="  flex items-end bg-cover bg-center w-full lg:w-[850px] min-h-[445px] rounded-xl overflow-hidden transition-all duration-500"
      >
        <div className="z-10 ml-6 p-6 sm:p-8 md:p-10 max-w-[90%] sm:max-w-[70%] lg:max-w-[50%]">
          <p className="text-xs sm:text-sm tracking-widest text-white uppercase">
            Pre-purchase available
          </p>
          <p className="text-base sm:text-lg my-4 leading-relaxed font-light">
            {selected.description}
          </p>
          <button className="mt-4 sm:mt-6 bg-white text-black   px-4 sm:px-6 py-3 rounded-md shadow hover:bg-gray-200 transition">
            PRE-PURCHASE NOW
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col justify-start gap-12 hover:bg-gray  w-full mt-1 lg:w-[25%]">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelected(item)}
            className={`flex items-center gap-4 cursor-pointer transition hover:scale-[1.03] ${
              selected.title === item.title ? "opacity-100" : "opacity-70"
            }`}
          >
            <img
              src={item.thumb}
              alt={item.title}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-14 md:h-19 rounded-lg object-cover"
            />
            <p className="text-sm sm:text-base md:text-lg">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

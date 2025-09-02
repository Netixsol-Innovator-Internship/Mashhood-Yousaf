"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const saleGames = [
  {
    id: "1",
    title: "Valorant",
    image: "/v.jpg",
    originalPrice: "₹900",
    salePrice: "₹850",
    discount: "-10%",
  },
  {
    id: "2",
    title: "Assassin's creed Valhalla",
    image: "/ac.png",
    originalPrice: "₹3,349",
    salePrice: "₹2,999",
    discount: "-20%",
  },
  {
    id: "3",
    title: "Red Dead Redemption 2",
    image: "/rd.png",
    originalPrice: "₹3,199",
    salePrice: "₹1,599",
    discount: "-50%",
  },
  {
    id: "4",
    title: "The Tomb Raider",
    image: "/tr.png",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    image: "/cp.png",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
  {
    id: "6",
    title: "Valorant",
    image: "/v.jpg",
    originalPrice: "₹900",
    salePrice: "₹850",
    discount: "-10%",
  },
  {
    id: "7",
    title: "Assassin's creed Valhalla",
    image: "/ac.png",
    originalPrice: "₹3,349",
    salePrice: "₹2,999",
    discount: "-20%",
  },
  {
    id: "8",
    title: "Red Dead Redemption 2",
    image: "/rd.png",
    originalPrice: "₹3,199",
    salePrice: "₹1,599",
    discount: "-50%",
  },
  {

    id: "9",
    title: "The Tomb Raider",
    image: "/tr.png",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {

    id: "10",
    title: "Cyberpunk 2077",
    image: "/cp.png",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
];

export function GameSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 900) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1200) {
        setItemsPerView(5);
      } else {
        setItemsPerView(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= saleGames.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? saleGames.length - itemsPerView : prev - 1
    );
  };

  return (
    <section className="max-w-[1300px] mx-auto py-8">
      <div className="px-4">
        {/* Header with navigation buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white  flex items-center gap-4 mt-2  text-2xl font-bold">
            Game on sale
            <span>
              <img src="/arrow.png" className="rotate-180 " alt="" />
            </span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(32,32,32,1)] hover:bg-gray-700 text-white"
            >
              <img src="/arrow.png" alt="Left Arrow" className="" />
            </button>

            <button
              onClick={nextSlide}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(32,32,32,1)] hover:bg-gray-700 text-white"
            >
              <img src="/arrow.png" alt="Right Arrow" className=" rotate-180" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex  transition-transform duration-300 ease-in-out"
            style={{
              width: `${(saleGames.length * 100) / itemsPerView}%`,
              transform: `translateX(-${
                (currentIndex * 100) / saleGames.length
              }%)`,
            }}
          >
            {saleGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / saleGames.length}%` }}
              >
                <div className="bg-a 0 rounded-lg  overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-[280px] object-contain bg-black"
                  />
                  <div className="border text-center lg:text-start   p-4">
                    <h3 className="text-white text-sm font-semibold mb-2">
                      {game.title}
                    </h3>
                    <div className="flex border  justify-center lg:justify-start  items-center space-x-2">
                      <span className="bg-[rgba(0,116,228,1)] text-white px-2 py-0 rounded text-[12px]  ">
                        {game.discount}
                      </span>
                      <span className="text-gray-400 line-through text-sm">
                        {game.originalPrice}
                      </span>
                      <span className="text-white ">{game.salePrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";

const topSellers = [
  {
    id: "1",
    title: "Ghostbusters: Spirits Unleashed",
    price: "₹939",
    image: "/ghostBusters.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier Edition",
    price: "₹2,499",
    image: "/gta.jpg",
  },
  {
    id: "3",
    title: "Daysgone",
    price: "₹2,699",
    image: "/daysGone.jpg",
  },
  {
    id: "4",
    title: "Last of Us",
    price: "₹1,499",
    image: "/lou.jpg",
  },
  {
    id: "5",
    title: "God of War 4",
    price: "₹2,659",
    image: "/war.jpg",
  },
];

const bestSellers = [
  {
    id: "1",
    title: "Fortnite",
    price: "Free",
    image: "/fornite.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier edition",
    price: "₹2,499",
    image: "/gta.jpg",
  },
  {
    id: "3",
    title: "IGI 2",
    price: "₹499",
    image: "/igi.jpg",
  },
  {
    id: "4",
    title: "Tomb Raider",
    price: "₹2,499",
    image: "/tr.jpg",
  },
  {
    id: "5",
    title: "Uncharted 4",
    price: "₹3,499",
    image: "/uncharted.jpg",
  },
];

const upcomingGames = [
  {
    id: "1",
    title: "Hogwarts Legacy",
    price: "₹2,999",
    image: "/hog.jpg",
  },
  {
    id: "2",
    title: "Uncharted Legacy of Thieves",
    price: "₹4,499",
    image: "/uncharted.jpg",
  },
  {
    id: "3",
    title: "Assassin's Creed Mirage",
    price: "₹3,499",
    image: "/acm.jpg",
  },
  {
    id: "4",
    title: "Last of Us II",
    price: "₹3,999",
    image: "/theLAstOfUs.jpg",
  },
  {
    id: "5",
    title: "Dead by Daylight",
    price: "Coming Soon",
    image: "/dbd.jpg",
  },
];

function GameList({ title, games, buttonText }) {
  return (
    <div className=" rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-[16px]   md:max-w-[100px] lg:max-w-full  ">{title}</h3>
        <button className="border border-white h-8 px-2 text-[14px] md:text-[12px] rounded text-gray-300   bg-transparent">
          {buttonText}
        </button>
      </div>
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <Image
              src={game.image}
              alt={game.title}
              height={60}
              width={60}
              className="w-12 h-12 rounded object-top object-cover"
            />
            <div className="flex-1">
              <h4 className="text-white text-sm font-medium">{game.title}</h4>
              <p className="text-gray-400 text-sm">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopGames() {
  return (
    <section className=" py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GameList
            title="Top Sellers"
            games={topSellers}
            buttonText="view more"
          />
          <GameList
            title="Best Seller"
            games={bestSellers}
            buttonText="view more"
          />
          <GameList
            title="Top Upcoming game"
            games={upcomingGames}
            buttonText="view more"
          />
        </div>
      </div>
    </section>
  );
}

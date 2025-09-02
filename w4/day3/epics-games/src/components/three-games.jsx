"use client";

const featuredGames = [
  {
    id: "1",
    title: "NFS UNBOUND",
    image: "/nfs.jpg",
    description:
      "Pre-purchase NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,499",
  },
  {
    id: "2",
    title: "FIFA 23",
    image: "/fifa.jpg",
    description:
      "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup",
    price: "₹3,699",
  },
  {
    id: "3",
    title: "UNCHARTED 4",
    image: "/un.jpg",
    description:
      "Get the definitive Uncharted 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,199",
  },
];

export function ThreeGamesCard() {
  return (
    <section className="py-8 px-4 max-w-[1300px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGames.map((game) => (
          <div
            key={game.id}
            className="overflow-hidden hover:bg-gray-750 transition-colors"
          >
            <div className="rounded-xl">
              <img
                src={game.image }
                alt={game.title}
                className="w-full h-48  object-cover rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">
                {game.title}
              </h3>
              <p className="text-[#FFFFFF99] text-sm mb-4 line-clamp-3">
                {game.description}
              </p>
              <div className="text-white font-bold text-lg">{game.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

const freeGames = [
  {
    id: "1",
    title: "Darkwood",
    image: "/darkWood.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "2",
    title: "Assassin's Creed Black Flag",
    image: "/bf.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "3",
    title: "NFS : Shift",
    image: "/nfsShift.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
  {
    id: "4",
    title: "Warface",
    image: "/warFace.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
];

export function FreeGames() {
  return (
    <section className=" py-8">
      <div className="container bg-[#2A2A2A] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img src="/gift.png" alt="Gift" className="w-6 h-6" />
            <h2 className="text-white text-[16px] ">Free Games</h2>
          </div>
          <button className="border border-white h-8 px-2 rounded text-gray-300   bg-transparent">
            View More
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeGames.map((game) => (
            <div
              key={game.id}
              className="bg-[#2A2A2A] border-[#2A2A2A] overflow-hidden hover:bg-gray-750 transition-colors"
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full max-h-[360px]  object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-2">{game.title}</h3>
                <p className="text-gray-400 text-sm">{game.availability}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

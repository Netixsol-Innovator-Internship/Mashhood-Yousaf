import React from 'react'

export function Catalog() {
  return (
    <section className=" text-white">
      <div className="container mx-auto px-4 py-10 ">
        <div className="flex flex-col md:flex-row items-center md:items-stretch rounded-lg overflow-hidden shadow-lg">
          {/*  Image */}
          <div className="w-full  md:w-1/2">
            <img
              src="/ct.png"
              alt="Catalog Banner"
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/*  Content */}
          <div className="w-full md:w-1/2  bg-opacity-50 flex items-center justify-center p-6 text-white">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-2xl  mb-4">
                Explore our Catalog
              </h1>
              <p className=" text-[rgba(255,255,255,0.6)] ">
                Browse by genre, features, price, and more to find your next
                favorite game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

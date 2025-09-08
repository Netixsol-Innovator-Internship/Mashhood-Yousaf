  import Image from "next/image";

  export default function HeroSection() {
    return (
      <section className="bg-[rgba(242,240,241,1)] w-full px-6 md:px-16 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div>
            <h1 className="text-2xl sm:text-4xl  md:text-5xl    font-extrabold text-black leading-tight">
              FIND CLOTHES  THAT MATCHES  YOUR STYLE
            </h1>
            <p className="mt-6 text-gray-600 text-sm max-w-lg">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <button className="mt-6 bg-black text-white px-14 py-3 rounded-full text-sm  hover:bg-gray-600 transition">
              Shop Now
            </button>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 sm:grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="  sm:text-2xl font-bold text-black">200+</p>
                <p className="text-gray-600 text-[10px] sm:text-sm mt-1">International Brands</p>
              </div>
              <div>
                <p className="  sm:text-2xl font-bold text-black">2,000+</p>
                <p className="text-gray-600 text-[10px] sm:text-sm mt-1">
                  High-Quality Products
                </p>
              </div>
              <div>
                <p className="  sm:text-2xl font-bold text-black">30,000+</p>
                <p className="text-gray-600 text-[10px] sm:text-sm mt-1">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="  flex justify-center   w-full items-center">
            <Image
              src="/hm.jpg" // Change this path
              alt="Fashion Models"
              width={400}
              height={200}
              className="object-contain w-full/2 h-auto"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

import { FaMugHot, FaThermometerHalf, FaClock } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";

export default function TeaDetails() {
  return (
    <div className="max-w-7xl p-15 mx-auto   font-sans text-gray-800 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between gap-12">
        {/* Steeping Instructions */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-medium mb-6">Steeping instructions</h2>
          <ul className="space-y-7">
            <li className="flex items-start space-x-3 border-b border-gray-300 pb-2">
              <FaMugHot className="text-xl text-gray-800 mt-1" />
              <span className="text-base text-gray-700">
                <span className="font-semibold uppercase">Serving size: </span>2
                tsp per cup, 6 tsp per pot
              </span>
            </li>
            <li className="flex items-start space-x-3 border-b border-gray-300 pb-2">
              <FaThermometerHalf className="text-xl text-gray-800 mt-1" />
              <span className="text-base text-gray-700">
                <span className="font-semibold uppercase">
                  Water temperature:{" "}
                </span>
                100°C
              </span>
            </li>
            <li className="flex items-start space-x-3 border-b border-gray-300 pb-2">
              <FaClock className="text-xl text-gray-800 mt-1" />
              <span className="text-base text-gray-700">
                <span className="font-semibold uppercase">Steeping time: </span>
                3 - 5 minutes
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <BsCircleFill className="text-base text-rose-600" />
              <span className="text-base text-gray-700">
                <span className="font-semibold uppercase">Color after </span>3
                minutes
              </span>
            </li>
          </ul>
        </div>

        {/* About this tea + Ingredients */}
        <div className="md:w-1/2 space-y-6">
          {/* About this tea */}
          <div>
            <h2 className="text-2xl font-medium mb-4">About this tea</h2>
            <div className="flex flex-wrap border-b border-gray-300 py-4">
              <div className="w-1/2 md:w-1/4 mb-4">
                <p className="text-sm font-semibold uppercase text-gray-500">
                  Flavor
                </p>
                <p>Spicy</p>
              </div>
              
              <div className="w-1/2 md:w-1/4 mb-4">
                <p className="text-sm font-semibold uppercase text-gray-500">
                  Qualities
                </p>
                <p>Smoothing</p>
              </div>
              <div className="w-1/2 md:w-1/4 mb-4">
                <p className="text-sm font-semibold uppercase text-gray-500">
                  Caffeine
                </p>
                <p>Medium</p>
              </div>
              <div className="w-1/2 md:w-1/4 mb-4">
                <p className="text-sm font-semibold uppercase text-gray-500">
                  Allergens
                </p>
                <p>Nuts-free</p>
              </div>
            </div>
          </div>

          {/* Ingredient */}
          <div>
            <h2 className="text-2xl font-medium my-2">Ingredient</h2>
            <p className="text-base text-gray-700 py-4 leading-relaxed">
              Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper,
              Cinnamon sticks, Cardamom, Cinnamon pieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

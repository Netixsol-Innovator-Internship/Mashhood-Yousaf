import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import image from "../../public/images/11098c099110f50ae3271077bf88a575d381cce4.jpg";
import Loader from "../components/Loader";
import axios from "axios";

const AccessoriesPage = () => {
  const { collectionName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredTeas, setFilteredTeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    origin: false,
    flavor: false,
    qualities: false,
    caffeine: false,
    allergens: false,
    organic: false,
  });

  const [filters, setFilters] = useState({
    collections: [],
    origin: [],
    flavor: [],
    qualities: [],
    caffeine: [],
    allergens: [],
    organic: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = {
    collections: [
      "Black tea",
      "Green tea",
      "White tea",
      "Chai",
      "Matcha",
      "Herbal teas",
      "Oolong",
      "Rooibos",
      "Tisane",
    ],
    origin: ["india", "japan", "iran", "southAfrica"],
    flavor: [
      "spice",
      "sweet",
      "citrus",
      "smooth",
      "fruity",
      "floral",
      "minty",
      "bitter",
      "creamy",
    ],
    qualities: ["detox", "energy", "relax", "digestion"],
    caffeine: ["no", "low", "medium", "high"],
    allergens: ["lactose", "gluten", "nuts", "soy"],
    organic: ["Yes", "No"],
  };

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ecommerce-back-end-kohl.vercel.app/api/products/category/accessories"
        );
        setProducts(res.data.data);
        setFilteredTeas(res.data.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.log("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.collections.length > 0) {
      filtered = filtered.filter((item) =>
        filters.collections.some(
          (c) => item.collection && item.collection.includes(c)
        )
      );
    }

    if (filters.origin.length > 0) {
      filtered = filtered.filter((item) =>
        filters.origin.some(
          (o) => item.origin && item.origin.toLowerCase() === o.toLowerCase()
        )
      );
    }

    if (filters.flavor.length > 0) {
      filtered = filtered.filter((item) =>
        filters.flavor.some(
          (f) => item.flavor && item.flavor.toLowerCase() === f.toLowerCase()
        )
      );
    }

    if (filters.qualities.length > 0) {
      filtered = filtered.filter((item) =>
        filters.qualities.some(
          (q) =>
            item.qualities && item.qualities.toLowerCase() === q.toLowerCase()
        )
      );
    }

    if (filters.caffeine.length > 0) {
      filtered = filtered.filter(
        (item) =>
          item.caffeine &&
          filters.caffeine.includes(item.caffeine.toLowerCase())
      );
    }

    // if (filters.allergens.length > 0) {
    //   filtered = filtered.filter(
    //     (item) =>
    //       item.allergens &&
    //       filters.allergens.some((a) =>
    //         item.allergens.map((x) => x.toLowerCase()).includes(a.toLowerCase())
    //       )
    //   );
    // }
    if (filters.allergens.length > 0) {
      filtered = filtered.filter(
        (item) =>
          Array.isArray(item.allergens) &&
          filters.allergens.some((a) =>
            item.allergens.map((x) => x.toLowerCase()).includes(a.toLowerCase())
          )
      );
    }

    if (filters.organic) {
      filtered = filtered.filter((item) => item.organic === "Yes");
    }

    setFilteredTeas(filtered);
  }, [filters, products]);

  // Toggle filter
  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const toggleOrganicFilter = () => {
    setFilters((prev) => ({
      ...prev,
      organic: !prev.organic,
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      collections: [],
      origin: [],
      flavor: [],
      qualities: [],
      caffeine: [],
      allergens: [],
      organic: false,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full">
        <div
          className="h-48 sm:h-64 md:h-80 lg:h-96 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          {/* <h2 className="text-3xl font-bold">{collectionName} Collection</h2> */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-md"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Mobile overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              ></div>
              <div className="absolute top-0 left-0 h-full w-3/4 max-w-sm bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-4">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </button>
                </div>

                {Object.keys(filterOptions).map((key) => (
                  <div key={key} className="mb-4 border-b pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection(key)}
                    >
                      <h4 className="font-medium text-gray-800">
                        {key.toUpperCase()}
                      </h4>
                      <span className="text-gray-500">
                        {expandedSections[key] ? "-" : "+"}
                      </span>
                    </div>
                    {expandedSections[key] && (
                      <div className="mt-3 space-y-2">
                        {key === "organic" ? (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.organic}
                              onChange={toggleOrganicFilter}
                              className="mr-2 rounded"
                            />
                            <span className="text-sm text-gray-600">
                              Organic
                            </span>
                          </label>
                        ) : (
                          filterOptions[key].map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters[key].includes(option)}
                                onChange={() => toggleFilter(key, option)}
                                className="mr-2 rounded"
                              />
                              <span className="text-sm text-gray-600">
                                {option}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className=" p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>

              {Object.keys(filterOptions).map((key) => (
                <div key={key} className="mb-4 border-b pb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(key)}
                  >
                    <h4 className="font-medium text-gray-800">
                      {key.toUpperCase()}
                    </h4>
                    <span className="text-gray-500">
                      {expandedSections[key] ? "-" : "+"}
                    </span>
                  </div>
                  {expandedSections[key] && (
                    <div className="mt-3 space-y-2">
                      {key === "organic" ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.organic}
                            onChange={toggleOrganicFilter}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-600">Organic</span>
                        </label>
                      ) : (
                        filterOptions[key].map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters[key].includes(option)}
                              onChange={() => toggleFilter(key, option)}
                              className="mr-2 rounded"
                            />
                            <span className="text-sm text-gray-600">
                              {option}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="w-full">
            <div className="grid grid-cols-1 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredTeas.map((product) => (
                <Link to={`/products/${product._id}`} key={product._id}>
                  <div
                    key={product._id}
                    className=" overflow-hidden   hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-gray-800 font-medium mt-2">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredTeas.length === 0 && (
              <div className="w-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found with selected filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoriesPage;

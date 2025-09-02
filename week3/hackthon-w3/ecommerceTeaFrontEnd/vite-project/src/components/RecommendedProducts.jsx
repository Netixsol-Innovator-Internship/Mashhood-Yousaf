import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecommendedProducts = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://ecommerce-back-end-kohl.vercel.app/api/products"
        );

        // Select first 3 products — replace logic if you want random or filtered ones
        setRecommended(response.data.data.slice(0, 3));
      } catch (err) {
        setError("Failed to load recommended products");
        console.error("Error fetching recommended products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) return null;
  if (error) return null;
  if (recommended.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
        You may also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recommended.map((product) => (
          <Link to="/accessories">
            <div
              key={product._id}
              className="bg-white  overflow-hidden text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl  mb-1">{product.name}</h3>
                {/* <p className="text-gray-500 text-sm">{product.description}</p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Collections from "../components/Collections";
import { Link } from "react-router-dom";

const CollectionsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsResponse = await axios.get(
          "https://ecommerce-back-end-kohl.vercel.app/api/products"
        );

        console.log(
          "response while gettind products for dashboard",
          productsResponse
        );

        setProducts(productsResponse.data.data);

        console.log("products", products);
      } catch (err) {
        setError("Failed to fetch data");
        console.log(
          "err cathed in statsPAge while getting products and users",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Collections />
      <div className="p-4 font-sans sm:p-6 md:p-8 max-w-7xl mx-auto">
        <p className="text-1xl md:text-2xl font-bold mb-6 text-center">
          Our Collections
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8">
          {products.map((product) => (
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
                  <p className="text-gray-500 text-sm">{product.description}</p>
                  <p className="text-gray-500 text-sm">$ {product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CollectionsPage;

// Updated Products Component

"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Correct hook for App Router
import { useGetProductsQuery } from "../../store/shopCoApi";
import Link from "next/link";

export function ProductsContent () {
  const searchParams = useSearchParams(); // ✅ useSearchParams for App Router
  const [selectedCategory, setSelectedCategory] = useState([]);
  const dressStyle = searchParams.get("dressStyle"); // Get the dressStyle from URL

  const [page, setPage] = useState(1);
  const limit = 20;

  // Log all the query parameters
  console.log("dressStyle:", dressStyle);
  console.log("page:", page);

  // Fetch products with category and dressStyle (if available)
  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    dressStyle, // Pass the dressStyle to the query
    category: selectedCategory || undefined, // Only pass category if it is not null
  });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((category) => category !== value)
        : [...prevCategories, value]
    );
  };

  // Log the API response data
  console.log("data from API:", data);
  const products = data?.products || [];
  console.log("products:", products);

  const totalPages = Math.ceil((data?.total || 0) / limit);

  // Handle loading and errors
  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center py-20">Error loading products.</p>
    );

  // Create query params for View All page
  const queryParams = dressStyle
    ? { dressStyle, category: selectedCategory }
    : { category: selectedCategory };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden md:block w-64 border-r pr-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Category</h4>
            <div className="flex flex-col gap-1 text-sm">
              <label>
                <input
                  type="checkbox"
                  value="hoodies"
                  checked={selectedCategory.includes("hoodies")}
                  onChange={handleCategoryChange}
                />{" "}
                Hoodies
              </label>
              <label>
                <input
                  type="checkbox"
                  value="jeans"
                  checked={selectedCategory.includes("jeans")}
                  onChange={handleCategoryChange}
                />{" "}
                Jeans
              </label>
              <label>
                <input
                  type="checkbox"
                  value="shirt"
                  checked={selectedCategory.includes("shirt")}
                  onChange={handleCategoryChange}
                />{" "}
                Shirts
              </label>
              <label>
                <input
                  type="checkbox"
                  value="gym"
                  checked={selectedCategory.includes("gym")}
                  onChange={handleCategoryChange}
                />{" "}
                Gym
              </label>
            </div>
          </div>

          <button className="mt-4 w-full py-2 bg-black text-white rounded">
            Apply Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {dressStyle ? `${dressStyle} Products` : "All Products"}
          </h2>

          {products.length === 0 ? (
            <p>No products found for this category or style.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => {
                const rating = product.averageRating || 0;
                const image = product.images?.[0]?.url;

                return (
                  <div key={product._id} className=" p-4 rounded-lg shadow-sm">
                    <Link href={`/products/${product._id}`}>
                      <div className="relative w-full h-60 mb-4">
                        <Image
                          src={image || "/placeholder.jpg"}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      <h3 className="font-semibold text-sm mb-1">
                        {product.title}
                      </h3>

                      <div className="flex items-center text-yellow-400 text-xs mb-1">
                        {"★".repeat(Math.floor(rating))}
                        {"☆".repeat(5 - Math.floor(rating))}
                        <span className="text-gray-600 ml-1">
                          {rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold">${product.price}</span>
                        {product.originalPrice && (
                          <span className="line-through text-gray-400">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded border ${
                  page === i + 1 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}

// 👇 Suspense ke andar wrap
export default function Products() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading products...</p>}>
      <ProductsContent />
    </Suspense>
  );
}
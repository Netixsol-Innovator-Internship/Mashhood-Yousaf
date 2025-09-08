"use client";
import Image from "next/image";
import Link from "next/link";
import { useGetProductsQuery } from "../store/shopCoApi"; // update if needed
import { useSearchParams } from "next/navigation";

export default function AlsoLike() {
  const { data, isLoading, error } = useGetProductsQuery({ limit: 4 });
  const searchParams = useSearchParams();
  const dressStyle = searchParams.get("dressStyle");

  if (isLoading)
    return <p className="text-center py-10">Loading products...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Failed to load products.</p>
    );

  const products = data?.products || [];
  console.log("products", products);

  
  
  return (
    <section className="bg-white pt-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
          You Might Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product, i) => {
            const rating = product.averageRating || 0;
            const image = products[i].images[0].url;

            return (
              <div key={product._id} className="rounded-2xl p-4 text-left">
                {/* Using layout="responsive" with width/height makes image scalable */}
                <div className="relative w-full h-64 rounded-2xl">
                  <Image
                    src={image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-sm">{product.title}</h3>

                  {/* <div className="flex items-center mt-2 text-yellow-400 text-sm">
                    {"★".repeat(Math.floor(rating))}
                    {"☆".repeat(5 - Math.floor(rating))}
                    <span className="text-gray-600 ml-2">
                      {rating.toFixed(1)}/5
                    </span>
                  </div> */}

                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-lg">${product.price}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link
            href={
              `/products?dressStyle=casual`
            }
          >
            <button className="px-6 py-3 border border-black rounded-full text-black font-medium hover:bg-black hover:text-white transition">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

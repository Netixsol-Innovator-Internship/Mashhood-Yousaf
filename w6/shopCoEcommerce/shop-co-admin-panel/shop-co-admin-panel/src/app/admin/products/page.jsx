"use client";
import React from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import { useGetProductsQuery } from "@/api/shopCoApi";
import Link from "next/link";
// import { useGetProductsQuery } from "@api/shopCoApi";

export default function Products() {
  const { data, isLoading } = useGetProductsQuery();

  return (
    <ProtectedRoute>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold mb-3">ALL Products</h3>
          <Link href="/admin/addProduct">
            <button className="bg-[#232321] text-white p-3 font-bold rounded-2xl">
              + Add New Product
            </button>
          </Link>
        </div>
        <p className="mb-4">Home - All Products</p>

        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {data.products.map(
              ({ _id, title, images, category, price, stock, description }) => (
                <Link key={_id}  href={`/admin/products/${_id}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex   items- space-x-3">
                      <img
                        src={images[0].url}
                        alt={title}
                        className="w-[40px] h-[40px] object-cover rounded-md"
                      />
                      <div className="flex flex-col  ">
                        <h3 className="font-normal text-[11px]">{title}</h3>
                        <p className="text-[10px] text-gray-500">{`category: ${category}`}</p>
                        <p className="text-[10px] font-semibold mt-1">
                          ₹{price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4  ">
                      {/* Remaining Products Section */}
                      <div className="flex justify-between items-center border border-[#2323214D] p-2 rounded-lg text-sm">
                        <p className="text-gray-500 text-[8px] ">
                          Remaining Products
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-700">{stock}</span>{" "}
                          {/* Display remaining stock */}
                          <div className="relative w-24 h-2 bg-gray-300 rounded-full">
                            <div
                              className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
                              style={{ width: `${stock * 1}%` }} // Dynamically set width based on stock
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}

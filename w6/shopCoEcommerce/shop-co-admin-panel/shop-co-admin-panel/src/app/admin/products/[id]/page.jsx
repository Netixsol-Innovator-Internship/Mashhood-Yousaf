"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import {
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/api/shopCoApi";

const EditProduct = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, isLoading } = useGetProductQuery(id);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    size: "",
    dressStyle: "",
    sku: "",
    variants: [{ name: "Color", options: [""] }],
    images: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        size: product.size || "",
        dressStyle: product.dressStyle || "",
        sku: product.sku || "",
        variants: product.variants || [{ name: "Color", options: [""] }],
        images: product.images || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await updateProduct({ id, ...updatedProduct }).unwrap();
      alert("✅ Product updated successfully!");
      router.push("/admin/products"); // redirect if needed
    } catch (error) {
      console.error("❌ Update failed:", error);
      alert("❌ Failed to update product.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id).unwrap();
      alert("🗑️ Product deleted successfully!");
      router.push("/admin/products"); // redirect if needed
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("❌ Failed to delete product.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 fixed h-full z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64">
        <Header />

        <div className="p-6">
          <div className="max-w-6xl mt-15 mx-auto mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Editable Fields */}

              <div>
                <label className="block mb-1">Title</label>
                <input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Stock</label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Read-Only Fields */}

              <div>
                <label className="block mb-1">Category</label>
                <input
                  value={formData.category}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Size</label>
                <input
                  value={formData.size}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Dress Style</label>
                <input
                  value={formData.dressStyle}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block mb-1">SKU</label>
                <input
                  value={formData.sku}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded-md p-2"
                />
              </div>

              {/* Variants (Read-only view) */}
              <div className="lg:col-span-2">
                <label className="block mb-1">Variants (Colors)</label>
                <div className="grid grid-cols-3 gap-2">
                  {formData.variants[0]?.options.map((option, index) => (
                    <input
                      key={index}
                      value={option}
                      disabled
                      className="border border-gray-300 bg-gray-100 rounded-md p-2"
                    />
                  ))}
                </div>
              </div>

              {/* Images Preview */}
              <div className="lg:col-span-2 mt-6">
                <label className="block mb-1">Product Images</label>
                <div className="flex gap-4 flex-wrap">
                  {formData.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Image ${index}`}
                      className="h-24 w-24 object-cover border rounded-md"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-2 mt-8 pt-6 border-t border-gray-200 flex gap-4 justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-green-700 font-sm"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  type="button"
                  className="px-6 py-2 bg-[#003F62] text-white rounded-md hover:bg-red-700 font-sm"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

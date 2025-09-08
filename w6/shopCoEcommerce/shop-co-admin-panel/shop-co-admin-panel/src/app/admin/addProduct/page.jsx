"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import {
  useCreateProductMutation,
  useUploadImagesMutation,
} from "@/api/shopCoApi";

const AddProduct = () => {
  const [createProduct] = useCreateProductMutation();
  const [uploadImages] = useUploadImagesMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    size: "",
    dressStyle: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
    images: [],
    variants: [{ name: "Color", options: [""] }],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, value) => {
    const updatedVariants = [...formData.variants[0].options];
    updatedVariants[index] = value;
    setFormData((prev) => ({
      ...prev,
      variants: [{ ...prev.variants[0], options: updatedVariants }],
    }));
  };

  const handleAddVariantOption = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        {
          ...prev.variants[0],
          options: [...prev.variants[0].options, ""],
        },
      ],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit to max 3 files
    if (files.length + selectedFiles.length > 3) {
      alert("Maximum 3 images allowed.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload images
      const imageFormData = new FormData();
      selectedFiles.forEach((file) => {
        imageFormData.append("files", file);
      });

      const uploadRes = await uploadImages(imageFormData).unwrap();

      const images = uploadRes.map((img) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));

      const productPayload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
      };

      await createProduct(productPayload).unwrap();

      alert("✅ Product created successfully!");
      // Optionally reset form here
      setFormData({
        title: "",
        description: "",
        size: "",
        dressStyle: "",
        price: "",
        category: "",
        stock: "",
        sku: "",
        images: [],
        variants: [{ name: "Color", options: [""] }],
      });
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("❌ Error creating product:", err);
      alert("❌ Failed to create product. See console.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 fixed h-full z-10">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <Header />

          <div className="p-6">
            <div className="max-w-6xl mt-15 mx-auto mt-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Create Product</h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cotton T Shirt"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Comfortable cotton t-shirt..."
                      rows={3}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="shirt">Shirt</option>
                      <option value="gym">Gym</option>
                      <option value="jeans">Jeans</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xl">XL</option>
                    </select>
                  </div>

                  {/* Dress Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dress Style
                    </label>
                    <select
                      name="dressStyle"
                      value={formData.dressStyle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Style</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="gym">Gym</option>
                      <option value="party">Party</option>
                    </select>
                  </div>

                  {/* Stock and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1999.99"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="GBP226-001"
                    />
                  </div>

                  {/* Variant Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colors
                    </label>
                    <div className="space-y-2">
                      {formData.variants[0].options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleVariantChange(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Color ${index + 1}`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={handleAddVariantOption}
                        className="text-sm text-blue-600 mt-2"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div>
                  {/* Image Preview Box */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image Preview
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md h-60 flex items-center justify-center bg-gray-100">
                      {selectedFiles.length > 0 ? (
                        <img
                          src={URL.createObjectURL(selectedFiles[0])}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 text-center p-4">
                          <p>Image preview will appear here</p>
                          <p className="text-xs mt-2">
                            Drop your images here, or browse to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Gallery
                    </label>

                    {/* File Input */}
                    <div className="mb-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 inline-block"
                      >
                        Select Images
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum 3 images allowed
                      </p>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="relative border rounded-md overflow-hidden group"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                          <div className="p-2">
                            <p className="text-xs truncate">{file.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Empty Slots */}
                      {Array.from({ length: 3 - selectedFiles.length }).map(
                        (_, index) => (
                          <div
                            key={index}
                            className="border border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="lg:col-span-2 mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
                  >
                    CREATE PRODUCT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;

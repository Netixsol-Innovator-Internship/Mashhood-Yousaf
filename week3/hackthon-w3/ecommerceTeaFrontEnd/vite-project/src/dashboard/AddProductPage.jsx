import React, { useState } from "react";
import { useAddProductMutation } from "../services/api";

const AddProductPage = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    origin: "",
    flavor: "",
    qualities: "",
    caffeine: "",
    allergens: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Unauthorized access, please login.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }

    try {
     const res = await addProduct(data).unwrap();
      console.log(res);
      alert("✅ Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center">Add New Product</h2>

        {[
          { name: "name", label: "Product Name" },
          { name: "description", label: "Description" },
          { name: "price", label: "Price", type: "number" },
          { name: "category", label: "Category" },
          { name: "origin", label: "Origin" },
          { name: "flavor", label: "Flavor" },
          { name: "qualities", label: "Qualities" },
          { name: "caffeine", label: "Caffeine" },
          { name: "allergens", label: "Allergens" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;

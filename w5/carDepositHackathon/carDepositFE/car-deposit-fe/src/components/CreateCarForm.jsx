"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCreateCarMutation } from "@/store/apiSlice";

const CreateCarForm = () => {
  const [form, setForm] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [createCar, { isLoading }] = useCreateCarMutation();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "make",
      "model",
      "year",
      "price",
      "image",
      "category",
    ];
    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = "* Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      data.append("owner", user._id);

      await createCar(data).unwrap();
      alert('Car Added')
      router.push("/profile");
    } catch (err) {
      console.error("Error creating car:", err);
      alert('Failed, check Console')
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-4xl mx-auto bg-blue-50 shadow-md rounded-md"
    >
      <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-800">
        Car Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "name", label: "Name" },
          { name: "make", label: "Make" },
          { name: "model", label: "Model" },
          { name: "year", label: "Year", type: "number" },
          { name: "price", label: "Price", type: "number" },
          { name: "category", label: "Category" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors[name] && (
              <p className="text-red-500 text-xs">{errors[name]}</p>
            )}
          </div>
        ))}

        <div className="col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.image && (
            <p className="text-red-500 text-xs">{errors.image}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreateCarForm;

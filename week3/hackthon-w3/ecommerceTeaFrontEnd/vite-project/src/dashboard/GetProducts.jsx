import React, { useState } from "react";
import {
  useGetProductsForAdminQuery,
  useDeleteProductMutation,
  useUpdateProductMutation, // ✅ You'll need this
} from "../services/api";
import { Navigate } from "react-router-dom";

const GetProducts = () => {
  const role = localStorage.getItem("roleOfTheUser");

  // if (role !== "admin" && role !== "superAdmin") {
  //   return <Navigate to="/login" />;
  // }

  const { data, error, isLoading } = useGetProductsForAdminQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", price: "" });
  };

  const handleInputChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    console.log('id', id)
    try {
      const updatedProduct = {
        updatedName: editForm.name,
        updatedDescription: editForm.description,
        updatedPrice: editForm.price,
      };

      console.log("🔄 Sending update:", { id, ...updatedProduct });
      const result = await updateProduct({ id, ...updatedProduct }).unwrap();
      console.log("✅ Update successful:", result);

      alert("✅ Product updated successfully!");
      setEditingId(null);
    } catch (err) {
      console.log("❌ Update failed:", err);

      if (err.data?.message) {
        alert(`Failed: ${err.data.message}`);
      } else if (err.status) {
        alert(`Failed: Error ${err.status}`);
      } else {
        alert("Failed to update product. Please check console for details.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this product?");
    if (!confirm) return;
    try {
      await deleteProduct(id).unwrap();
      alert("❌ Product deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading products...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 mt-10">Failed to load products.</p>
    );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.data?.map((product) => {
        const isEditing = editingId === product._id;

        return (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              {isEditing ? (
                <>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 mb-2"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 mb-2"
                  />
                  <input
                    name="price"
                    type="number"
                    value={editForm.price}
                    onChange={handleInputChange}
                    className="w-full border px-2 py-1 mb-2"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                  <p className="mt-2 font-semibold text-blue-600">
                    ${product.price}
                  </p>
                </>
              )}

              <div className="mt-4 flex justify-between">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleSave(product._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    {role === "superAdmin" && (
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GetProducts;

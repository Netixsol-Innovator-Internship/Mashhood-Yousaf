// services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ecommerce-back-end-kohl.vercel.app/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Token in headers:", token); // <--- add this line
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "User", "Cart"],

  // ✅ CORRECT ENDPOINT STRUCTURE
  endpoints: (builder) => ({
    // ✅ Add Product
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ Get All Products
    getProductsForAdmin: builder.query({
      query: () => ({
        url: "products/productsForAdmin",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => {
        console.log("RTK Query - ID:", id);
        console.log("RTK Query - Body:", body);

        return {
          url: `products/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, newRole }) => ({
        url: `users/${id}/role`,
        method: "PATCH",
        body: { newRole },
      }),
      invalidatesTags: ["User"], // or your tag for users data
    }),

    blockUnblockUser: builder.mutation({
      query: ({ id, action }) => ({
        url: `users/${id}/block`,
        method: "PATCH",
        body: { action }, // "block" or "unblock"
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Get Users
    getUsers: builder.query({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

// ✅ Export hooks
// ✅ Export hooks
export const {
  useAddProductMutation,
  useGetProductsForAdminQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
  useGetProductsQuery,
  useGetUsersQuery,
} = api;

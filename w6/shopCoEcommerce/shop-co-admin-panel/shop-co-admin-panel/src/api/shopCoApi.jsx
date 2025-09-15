// api/shopCoApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://shop-co.up.railway.app", // for production
  // baseUrl: "http://localhost:8000", // for localy
  // prepareHeaders: (headers) => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     headers.set("Authorization", `Bearer ${token}`);
  //   }
  //   headers.set("Content-Type", "application/json");
  //   return headers;
  // },
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // ✅ Only set content-type for non-upload requests
    if (endpoint !== "uploadImages") {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

export const shopCoApi = createApi({
  reducerPath: "shopCoApi",
  baseQuery,
  tagTypes: ["User", "Product", "Order", "Review", "Analytics", "Wishlist"],
  endpoints: (builder) => ({
    // Auth Endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    // User Endpoints
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/users/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    addAddress: builder.mutation({
      query: (address) => ({
        url: "/users/address",
        method: "PUT",
        body: address,
      }),
      invalidatesTags: ["User"],
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "PUT",
      }),
      invalidatesTags: ["User", "Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Wishlist"],
    }),

    // Product Endpoints
    getProducts: builder.query({
      query: (params = {}) => ({
        url: "/products",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          category: params.category,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          search: params.search,
          dressStyle: params.dressStyle,
        },
      }),
      providesTags: ["Product"],
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Order Endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "User"],
    }),

    getUserOrders: builder.query({
      query: () => "/orders/my-orders",
      providesTags: ["Order"],
    }),

    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    // Review Endpoints
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    getProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 20 }) => ({
        url: `/reviews/product/${productId}`,
        params: { page, limit },
      }),
      providesTags: ["Review"],
    }),

    // Admin Endpoints
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),

    getAllOrders: builder.query({
      query: (params = {}) => ({
        url: "/orders",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          status: params.status,
        },
      }),
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      // Invalidate "orders" cache by invalidating the "Order" tag
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    getAllReviews: builder.query({
      query: (params = {}) => ({
        url: "/reviews",
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
        },
      }),
      providesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    toggleReviewStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/reviews/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["Review"],
    }),

    // Analytics Endpoints
    getDashboardStats: builder.query({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),

    getSalesData: builder.query({
      query: (timeframe = "monthly") => ({
        url: "/analytics/sales",
        params: { timeframe },
      }),
      providesTags: ["Analytics"],
    }),

    getTopProducts: builder.query({
      query: (limit = 5) => ({
        url: "/analytics/top-products",
        params: { limit },
      }),
      providesTags: ["Analytics"],
    }),

    getUserGrowth: builder.query({
      query: (timeframe = "monthly") => ({
        url: "/analytics/user-growth",
        params: { timeframe },
      }),
      providesTags: ["Analytics"],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    // Upload Endpoints
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/images",
        method: "POST",
        body: formData,
      }),
    }),

    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: `/upload/images/${publicId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,

  // User
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,

  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Orders
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,

  // Reviews
  useCreateReviewMutation,
  useGetProductReviewsQuery,

  // Admin
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useToggleReviewStatusMutation,

  // Analytics
  useGetDashboardStatsQuery,
  useGetSalesDataQuery,
  useGetTopProductsQuery,
  useGetUserGrowthQuery,
  useGetOrderByIdQuery,
  // Upload
  useUploadImagesMutation,
  useDeleteImageMutation,
} = shopCoApi;

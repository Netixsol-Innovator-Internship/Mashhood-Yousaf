import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001", // apna BE ka base URL
    prepareHeaders: (headers, { getState }) => {
      // access_token add krne k liye (agar required ho)
      const access_token = getState()?.auth?.access_token;
      if (access_token) {
        headers.set("Authorization", `Bearer ${access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auctions", "Cars", "Bids", "Users", "Payments"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Auctions
    getAllAuctions: builder.query({
      query: () => "/auctions",
      providesTags: ["Auctions"],
    }),
    getAuctionById: builder.query({
      query: (id) => `/auctions/${id}`,
      providesTags: ["Auctions"],
    }),
    createAuction: builder.mutation({
      query: (body) => ({
        url: "/auctions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auctions"],
    }),

    // 🔹 Cars
    getAllCars: builder.query({
      query: () => "/cars",
      providesTags: ["Cars"],
    }),
    createCar: builder.mutation({
      query: (body) => ({
        url: "/cars",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cars"],
    }),

    getMyCars: builder.query({
      query: () => "cars/my",
      providesTags: ["Cars"],
    }),

    // 🔹 Bids
    getBidsByAuction: builder.query({
      query: (auctionId) => `/bids/${auctionId}`,
      providesTags: ["Bids"],
    }),
    placeBid: builder.mutation({
      query: (body) => ({
        url: "/bids",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bids", "Auctions"],
    }),

    // 🔹 Users
    getUserProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    // 🔹 Payments
    makePayment: builder.mutation({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAllAuctionsQuery,
  useGetAuctionByIdQuery,
  useCreateAuctionMutation,

  useGetAllCarsQuery,
  useCreateCarMutation,

  useGetBidsByAuctionQuery,
  usePlaceBidMutation,
  useGetMyCarsQuery,

  useGetUserProfileQuery,

  useMakePaymentMutation,
} = apiSlice;

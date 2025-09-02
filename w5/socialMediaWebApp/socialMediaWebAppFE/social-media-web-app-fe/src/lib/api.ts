import axios from "axios";

const API = axios.create({
  baseURL: "https://socialmediawebbeinnestjs-production.up.railway.app", // your NestJS backend
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

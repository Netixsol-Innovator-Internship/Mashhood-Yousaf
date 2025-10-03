import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(
      `Response received from: ${response.config.url}`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Backend server is not running. Please start the NestJS server on port 3000."
      );
    }

    throw error;
  }
);

// Assignment APIs
export const assignmentAPI = {
  create: (data) => api.post("/assignment", data),
  getAll: () => api.get("/assignment"),
  getById: (id) => api.get(`/assignment/${id}`),
};

// Submission APIs
export const submissionAPI = {
  // File upload
  upload: (formData) =>
    api.post("/submission/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Get submissions by assignment ID
  getByAssignment: (assignmentId) => {
    if (assignmentId) {
      return api.get(`/submission/assignment/${assignmentId}`);
    } else {
      // Return empty array if no assignment ID provided
      return Promise.resolve({ data: [] });
    }
  },

  // Get all submissions (if backend supports it)
  getAll: () => api.get("/submission"),

  // Evaluate submissions with AI
  evaluate: (assignmentId) =>
    api.post("/submission/evaluate", { assignmentId }),

  // Get marksheet (backend generated)
  getMarksheet: (assignmentId) =>
    api.get(`/submission/marksheet/${assignmentId}`),

  // Get evaluated submissions for CSV generation
  getEvaluatedSubmissions: (assignmentId) => {
    return api
      .get(`/submission/assignment/${assignmentId}`)
      .then((response) => {
        // Filter only evaluated submissions on the frontend
        const evaluated = response.data.filter((sub) => sub.score > 0);
        return { data: evaluated };
      });
  },
};

export default api;

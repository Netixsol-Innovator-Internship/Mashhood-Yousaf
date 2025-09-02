import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { api } from "./services/api";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
  // </StrictMode>
);

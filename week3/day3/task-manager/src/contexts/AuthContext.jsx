// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      console.log("Checking token...", token);  

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000; // in seconds

          if (decoded.exp < currentTime) {
            console.log("Token expired");
            logout();
          } else {
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error("Invalid token:", e);
          logout();
        }
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval); // cleanup
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      setLoading(true);
      const response = await axios.post(
        "https://day1-back-end.vercel.app/api/users/login",
        {
          email,
          password,
        }
      );
      console.log("response", response);
      const token = response.data.token; // ✅ get token from response
      localStorage.setItem("token", token); // ✅ store it
      const id = response.data.user.id;
      localStorage.setItem("idOfTheUser", id);
      console.log("id", id);
      console.log("token", token); // ✅ log it

      setError("");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setIsAuthenticated(false);
      console.log("err", err);
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("idOfTheUser");
    setIsAuthenticated(false);
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

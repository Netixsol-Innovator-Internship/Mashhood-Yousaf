import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
// import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  // const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();

  const navigate = useNavigate();

  const [state, setState] = useState({});

  const handleValue = (e) => {
    setState((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email = "", password = "" } = state;

    // Simple frontend validation
    if (!email || !password) {
      return setError("Please enter both email and password.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }

    login(email, password);

    // try {
    //   setLoading(true);
    //   const response = await axios.post(
    //     "https://day1-back-end.vercel.app/api/users/login",
    //     {
    //       email,
    //       password,
    //     }
    //   );
    //   console.log("response", response);
    //   const token = response.data.token; // ✅ get token from response
    //   localStorage.setItem("token", token); // ✅ store it
    //   const id = response.data.user.id;
    //   localStorage.setItem("idOfTheUser", id);
    //   console.log("id", id);
    //   console.log("token", token); // ✅ log it
    //   setIsLogin(true);
    //   setError("");
    //   navigate("/dashboard");
    // } catch (err) {
    //   console.log("err", err);
    //   setError(err.response.data.message);
    // } finally {
    //   setLoading(false);

    // }
  };
  // console.log("state", state);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <input
            name="email"
            onChange={handleValue}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            onChange={handleValue}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-500">
              Sign-up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

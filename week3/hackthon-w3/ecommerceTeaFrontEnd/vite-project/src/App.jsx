import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import { useAuth } from "../src/contexts/AuthContext";
import { useEffect, useState } from "react";
import AccessoriesPage from "./pages/AccessoriesPage";
import CollectionsPage from "./pages/CollectionsPage";
import CartPage from "../src/pages/CartPage";
import Footer from "./components/Footer";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./dashboard/AdminPage";
import AddProductPage from "./dashboard/AddProductPage";
import GetProducts from "./dashboard/GetProducts";
import GetUsers from "./dashboard/GetUsers";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    const role = localStorage.getItem("roleOfTheUser");
    setIsAdmin(role === "admin" || role === "superAdmin");
  }, []);

  return (
    <>
      {/* <Router> */}
      {/* {isAuthenticated && <Navbar />} */}
      <Navbar />
      <Routes>
        <Route path="/" element={<CollectionsPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signUp"
          element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route
          path="/add-product"
          element={isAdmin ? <AddProductPage /> : <Navigate to="/" />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/getUsers"
          element={isAdmin ? <GetUsers /> : <Navigate to="/" />}
        />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route
          path="/admin-products"
          element={isAdmin ? <GetProducts /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        {/* <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addTask"
          element={isAuthenticated ? <AddTaskPage /> : <Navigate to="/login" />}
        /> */}
      </Routes>
      {/* </Router> */}
      <Footer />
    </>
  );
  // return(
  //   <AccessoriesPage />
  // )
}

export default App;

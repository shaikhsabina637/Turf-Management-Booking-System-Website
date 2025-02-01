import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./components/pages/Home";
import Footer from "./components/common/Footer";
import Login from "./components/pages/Login";
import Contact from "./components/pages/Contact";
import About from "./components/pages/About";
import Otp from "./components/pages/Otp";
import ForgetPassword from "./components/pages/ForgetPassword";
import UpdatePassword from "./components/pages/UpdatePassword";
import ChangePassword from "./components/pages/ChangePassword";
import Spinner from "./components/common/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./slices/authSlice";
import Dashboard from "./components/pages/Dashboard";
import "../src/App.css";
import PrivateRoute from "./routes/PrivateRoute";
import PageNotFound from "./components/pages/PageNotFound";

const App = () => {
  const dispatch = useDispatch(); 
  const location = useLocation();
  const loader = useSelector((state) => state.auth.loader);

  // Check if current page is authentication-related
  const isAuthPage = ["/otp", "/forgetpassword", "/updatepassword", "/changepassword"].includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    if (token && user) {
      dispatch(login({ user, token }));
    }
  }, [dispatch]); 

  return (
    <>
      {loader && <Spinner />}
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/updatepassword" element={<UpdatePassword/>}/>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
        
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;

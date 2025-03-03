import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
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
import { fetchTurfLocations } from "./components/common/turfLocation";
import LocationPopup from "./components/common/locationPopup";
import TurfPage from "./components/pages/TurfPage";
import Profile from "./components/pages/Profile";
import Notification from "./components/pages/Notification";
import Chatbot from "./components/pages/Chatbot";
import { loadNotification } from "./slices/notificationSlice";
import { setNotification } from "./slices/notificationSlice";
import AdminPanel from "./components/pages/AdminPanel";
import TurfDetailPage from "./components/pages/TurfDetailPage";
import BookingPage from "./components/pages/BookingPage";
import BookedConfirmPage from "./components/pages/BookedConfirmPage";
import BookingConfirmedPage from "./components/pages/BookingConfirmedPage";
import MyBookings from "./components/pages/MyBookings";
import AutoLogout from "./utils/AutoLogout";
import BookingHistory from "./components/pages/BookingHistory";
import UserManagement from "./components/pages/UserManagement";
import AdminDashboard from "./components/pages/AdminDashboard";
import BookingManagement from "./components/pages/BookingManagement";
const App = () => {
  const dispatch = useDispatch(); 
  const location = useLocation();
  const loader = useSelector((state) => state.auth.loader);
  const notifications = useSelector((state)=>state.notification.notifications)
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
   useEffect( ()=>{
     dispatch(fetchTurfLocations()); 
   },[dispatch]);
    useEffect( ()=>{
            dispatch(loadNotification());
          },[dispatch])
   useEffect(() => {
    const storedNotifications = localStorage.getItem("userNotifications");
    if (storedNotifications) {
      dispatch(setNotification(JSON.parse(storedNotifications)));
    }
  }, [dispatch]);
  
  return (
    <>
    <DarkModeProvider>
       <LocationPopup/>
      {loader && <Spinner />}
      {!isAuthPage && <Navbar />}
      <AutoLogout/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route element={<PrivateRoute />}>
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/updatepassword" element={<UpdatePassword/>}/>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/turf" element={<TurfPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/notification" element={<Notification/>}/>
        <Route path="/chatbot" element={<Chatbot/>}/>
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="turf/turfDetails/:id" element={<TurfDetailPage/>}/>
        <Route path="/booking/:turfId/slots" element={<BookingPage/>}/>
        <Route path="/adminpanel" element={<AdminPanel/>}/>
        <Route path="/confirmBooking/:turfId/:userId" element={<BookedConfirmPage/>}/>
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmedPage />} />
        <Route path="/myBookings" element={<MyBookings/>}/>
        <Route path="/bookinghistory" element={<BookingHistory/>}/>
        <Route path="/usermanagement" element={<UserManagement/>}/>
        <Route path="/admindashboard" element={<AdminDashboard/>}/>
        <Route path="/bookingmanagement" element={<BookingManagement/>}/>

         {/* work is pending for private routing */}

      </Routes>
        
      {!isAuthPage && <Footer />}
    </DarkModeProvider>
    </>
  );
};

export default App;

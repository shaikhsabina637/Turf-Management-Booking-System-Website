import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { TbMessageChatbot } from "react-icons/tb";
import { DarkModeContext } from "../../context/DarkModeContext";
import { setNotification } from "../../slices/notificationSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { FaKey } from "react-icons/fa";
import Chatbot from "../pages/Chatbot";
import logo from "../../assets/Images/Logo.png";
import { FaFutbol } from "react-icons/fa";
import { motion } from "framer-motion";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleChatbotToggle = () => {
    setShowChatbot((prev) => !prev);
  };
  const handleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  
  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutConfirmation(true)
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/login");
    // localStorage.removeItem("token")
    // localStorage.removeItem("userData")
    toast.success("Logged out successfully!")
  }
  useEffect(() => {
    const fetchNotification = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/v1/notify/getNotifications/${user._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                withCredentials: true,
              },
            }
          );
          if (response.data.success) {
            console.log("fetch notification", response.data.currentMessage);
            dispatch(setNotification(response.data.currentMessage || []));
            console.log("notifications state", notifications);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something Went Wrong!");
        }
      }
    };
    fetchNotification();
  }, [dispatch, user]);

  const unreadCount = notifications.filter((notify) => !notify.isRead).length;
  console.log("unreadCount", unreadCount);

  return (
    <nav className="p-3 flex bg-[#5886a7] dark:bg-gray-900 text-white justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
      <img
        src={logo}
        alt="KickOnTurf Logo"
        className="w-12 h-12 md:block hidden rounded-full object-cover"
      />
      <div className="flex flex-1 ml-5 items-center gap-2">
        <Link to="/" className="text-xl font-orbitron font-bold">
          KickOnTurf
        </Link>
        <motion.div
          animate={{
            x: [0, 10, -10, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaFutbol className="text-2xl ml-2 text-white" />
        </motion.div>
      </div>
      <button className="p-2 lg:hidden" onClick={handleMenu}>
        {menuOpen ? (
          <i className="bx bx-x text-3xl"></i>
        ) : (
          <i className="bx bx-menu text-3xl"></i>
        )}
      </button>
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:gap-12 absolute lg:static top-16 left-0 right-0 bg-[#5886a7] dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent p-4 lg:p-0`}
      >
        <Link
          to="/"
          className={`block lg:inline text-[20px] font-medium font-serif pb-2 relative ${
            location.pathname === "/" ? "after:w-full" : "after:w-0"
          } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300`}
        >
          Home
        </Link>

        {/* Turf Panel Link (for Admin) */}
        {isAuthenticated && user.role === "Admin" && (
          <Link
            to="/adminpanel"
            className={`block lg:inline text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === "/adminpanel" ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300`}
          >
            Turf Panel
          </Link>
        )}
        {(!isAuthenticated || (isAuthenticated && user.role !== "Admin")) && (
          <Link
            to="/turf"
            className={`block lg:inline text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === "/turf" ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300`}
          >
            Turf
          </Link>
        )}
        {["/about", "/contact"].map((path, index) => (
          <Link
            key={index}
            to={path}
            className={`block lg:inline text-[20px] font-medium font-serif pb-2 relative ${
              location.pathname === path ? "after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300`}
          >
            {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-end gap-4 mr-5">
        <div className="text-4xl">
          <button onClick={handleChatbotToggle}>
            <TbMessageChatbot />
          </button>
        </div>
        {showChatbot && <Chatbot onClose={handleChatbotToggle} />}
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-lg rounded-full py-2 px-3 hover:bg-blue-50 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {darkMode ? (
            <i className="bx bx-moon text-2xl"></i>
          ) : (
            <i className="bx bx-sun text-2xl"></i>
          )}
        </button>
        {/* When Auth then Notification */}
        {isAuthenticated ? (
          <div className="relative flex items-center gap-4">
            <button
              onClick={() => navigate("/notification")}
              className="relative p-2 hover:bg-[#8bb0ca] dark:hover:bg-gray-700 rounded-full"
            >
              <i className="bx bx-bell text-2xl"></i>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1.5 w-1 h-1 rounded-full ">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Profile Dropdown when authenticated */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.image}
                  alt="Profileimage"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0.5 mt-6 w-96 bg-white text-black rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 scale-95 origin-top-right">
                  <div className="flex items-center gap-7 px-4 py-5 border-b">
                    <img
                      src={user.image}
                      alt=""
                      className="w-14 h-14 rounded-full border-black"
                    />
                    <div>
                      <p className="font-semibold text-xl capitalize">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-5">
                      <i className="bx bx-user text-2xl"></i> Edit Profile
                    </div>
                    <i className="bx bx-chevron-right text-2xl"></i>
                  </Link>
                  <Link
                    to={
                      user.role === "Admin" ? "/admindashboard" : "/dashboard"
                    }
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-5">
                      <i className="bx bxs-calendar-check text-2xl"></i>
                      Dashboard
                    </div>
                    <i className="bx bx-chevron-right text-2xl"></i>
                  </Link>

                  <Link
                    to="/changepassword"
                    className="flex items-center justify-between px-5 py-5 hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-5">
                      <FaKey size={20} />
                      Change Password
                    </div>
                    <i className="bx bx-chevron-right text-2xl"></i>
                  </Link>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center justify-between w-full text-left px-5 py-5 hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-5">
                      <i className="bx bx-log-out text-2xl"></i> Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex gap-2 items-center px-6 py-2 rounded-lg border transition-all duration-300 active:border-white"
          >
            <span className="font-montserrat text-[20px] font-medium">
              Login
            </span>
          </button>
        )}
      </div>
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to log out of your account? You'll need to log back in to access your profile and
                bookings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-md"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

"use client";
import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaToolbox } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx"; // Hamburger icon
import { FiSun, FiMoon } from "react-icons/fi"; // Theme toggle icons
import { db } from "../firebase/firebase";
import { doSignOut } from "../firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "./context";
import { useRouter } from "next/navigation";

const Sidebar = ({ isDarkMode, onThemeToggle, onUserDataLoaded, currentPage }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          if (onUserDataLoaded) onUserDataLoaded(); // Notify Dashboard that user data is loaded
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle menu toggle (small screens)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle theme change
  const handleThemeChange = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    onThemeToggle(newTheme); // Notify parent to toggle theme
  };

  // Handle logout
  const handleSignOut = () => {
    doSignOut();
  };

  // Redirect to home
  const handleLogoClick = () => {
    router.push("/");
  };

  // Links for the sidebar
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { href: "/toolbox", label: "Toolbox Library", icon: <FaToolbox />, pro: true },
    { href: "/networking-paths", label: "Networking + Paths", icon: <PiGraph />, pro: true },
  ];

  return (
    <div className="relative font-sans">
      {/* Main container */}
      <div
        className={`${
          isDarkMode
            ? "dashboard-color text-white border-[#2C2D33]"
            : "bg-white text-black border-gray-200"
        } px-10 flex flex-row w-full items-center space-x-10 py-6 font-sans top-0 z-50 border-b-2 sticky transition-colors duration-300`}
      >
        {/* Logo Section */}
        <picture className="flex-grow">
          <source
            media="(max-width: 767px)"
            srcSet={isDarkMode ? "/img/inverted.png" : "/img/nonprofitly_primary_no_back.png"}
          />
          <img
            className="h-10 md:h-10 max-h-full cursor-pointer"
            src={isDarkMode ? "/img/inverted.png" : "/img/nonprofitly_primary_no_back.png"}
            alt="Logo"
            onClick={handleLogoClick}
          />
        </picture>


        {/* Hamburger Menu for Small Screens */}
        <button
          onClick={toggleMenu}
          className={`lg:hidden ${isDarkMode ? "text-white" : "text-black"}`}
          aria-label="Toggle Menu"
        >
          <RxHamburgerMenu className="text-3xl" />
        </button>


        {/* Links Section for larger screens */}
        <div className="hidden lg:flex space-x-10 font-sans">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-md font-semibold flex items-center space-x-3 px-6 rounded-md ${
                currentPage === link.href
                  ? isDarkMode
                    ? "border-b-4 border-white text-lg"
                    : "border-b-4 border-black text-lg"
                  : isDarkMode
                  ? "hover:bg-[#21222D] text-lg"
                  : "hover:bg-gray-100 text-lg"
              }`}
            >
              <div className="text-2xl">{link.icon}</div>
              <span className="mt-0.5">{link.label}</span>
              {link.pro && (
                <span
                  className={`${
                    isDarkMode ? "bg-slate-700 text-white" : "bg-gray-300 text-black"
                  } rounded-md text-xs px-2 py-0.5 ml-2`}
                >
                  Pro
                </span>
              )}
            </a>
          ))}
        </div>

        <button
          onClick={handleThemeChange}
          className={`px-4 py-2 rounded-full ml-auto ${
            isDarkMode ? "hover:bg-gray-600 transition" : "hover:bg-gray-200 transition"
          }`}
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src={userData?.image || "https://via.placeholder.com/150"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </div>

      {/* Hamburger Dropdown Menu for Small Screens */}
      <div
        className={`lg:hidden ${
          isDarkMode ? "bg-[#1D1E26] text-white" : "bg-white text-black"
        } shadow-lg rounded-lg transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? "max-h-[400px] opacity-100 mb-12" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        
        <div className="py-4 px-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`block py-3 px-4 font-semibold flex items-center justify-between rounded-lg ${
                currentPage === link.href
                  ? isDarkMode
                    ? "bg-[#21222D]"
                    : "bg-gray-100"
                  : isDarkMode
                  ? "hover:bg-[#21222D]"
                  : "hover:bg-gray-200"
              } transition`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">{link.icon}</div>
                <span>{link.label}</span>
              </div>
              {link.pro && (
                <span
                  className={`${
                    isDarkMode ? "bg-slate-700 text-white" : "bg-gray-300 text-black"
                  } rounded-md text-xs px-2 py-0.5`}
                >
                  Pro
                </span>
              )}
            </a>
            
          ))}
        </div>
      </div>

      {/* Sidebar for User Profile */}
      <div
        className={`fixed top-0 right-0 h-full ${
          isDarkMode ? "bg-[#21222D] text-white" : "bg-white text-black"
        } z-40 shadow-lg transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "300px", borderRadius: "10px 0 0 10px" }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img
              src={userData?.image || "https://via.placeholder.com/150"}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-semibold">
              {userData?.firstName + " " + userData?.lastName || "User Name"}
            </span>
          </div>
          <button onClick={toggleSidebar} className="text-2xl">
            <IoClose />
          </button>
        </div>
        <div className="border-b border-gray-500 mx-4"></div>
        <div className="p-4">
          <a
            href="/profile"
            className={`flex items-center space-x-3 px-1 py-2 rounded-md ${
              isDarkMode
                ? "text-[#e7e7ea] hover:bg-[#353637]"
                : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            Profile
          </a>
          <a
            href="#"
            onClick={handleSignOut}
            className={`flex items-center space-x-3 px-1 py-2 rounded-md ${
              isDarkMode
                ? "text-[#e7e7ea] hover:bg-[#353637]"
                : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

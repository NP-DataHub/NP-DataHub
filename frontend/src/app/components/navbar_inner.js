"use client";
import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register';
import { useRouter } from 'next/navigation';
import { RxHamburgerMenu } from "react-icons/rx";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar_inner = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme toggle
  const router = useRouter();

  useEffect(() => {
    // Set the theme based on the user's preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setIsMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
    setIsMenuOpen(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);  
    setShowRegister(false);  
    router.push('/dashboard');
  };

  const handleRegisterSuccess = () => {
    setShowLogin(false);  
    setShowRegister(false);  
    router.push('/dashboard');
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow-md w-full sticky top-0 z-50 font-sans transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Responsive Logo */}
        <picture>
          {/* Logo for small screens */}
          <source media="(max-width: 767px)" srcSet="/img/nonprofitly_primary_no_back.png" />
          {/* Logo for medium screens and larger */}
          <img
            className="h-10 md:h-12 max-h-full"  
            src="/img/nonprofitly_primary_no_back.png"
            alt="Logo"
          />
        </picture>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Desktop Buttons */}
        <div className="ml-auto hidden md:flex space-x-2">
          <button
            onClick={handleLoginClick}
            className={`px-4 py-2 rounded-md transition ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className={`px-4 py-2 rounded-md transition ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="ml-auto md:hidden">
          <button
            onClick={toggleMenu}
            className="px-4 py-2 transition"
          >
            <RxHamburgerMenu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        } overflow-hidden transition-max-height duration-700 ease-in-out md:hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg mt-2`}
      >
        <button
          onClick={handleLoginClick}
          className={`block w-full px-4 py-2 text-left ${
            isDarkMode ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-300"
          } transition`}
        >
          Login
        </button>
        <button
          onClick={handleRegisterClick}
          className={`block w-full px-4 py-2 text-left ${
            isDarkMode ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-300"
          } transition`}
        >
          Register
        </button>
      </div>

      {/* Modals for Login and Register */}
      {showLogin && (
        <Login
          onClose={handleCloseLogin}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
      {showRegister && (
        <Register
          onClose={handleCloseRegister}
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </nav>
  );
};

export default Navbar_inner;

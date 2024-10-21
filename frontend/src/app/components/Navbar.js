"use client";
import React, { useState } from 'react';
import Login from './login';
import Register from './register';
import { useRouter } from 'next/navigation';
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
    <>
      {/* Main Navbar */}
      <nav className="dashboard-color px-10 flex flex-row w-full items-center space-x-10 py-6 font-sans top-0 z-50 sticky border-b-2 border-[#2C2D33]">
        {/* Responsive Logo */}
        <picture className="flex-grow">
          {/* Logo for small screens */}
          <source media="(max-width: 767px)" srcSet="/img/inverted.png" />
          {/* Logo for medium screens and larger */}
          <img className="h-10 md:h-10 max-h-full" src="/img/inverted.png" alt="Logo" />
        </picture>

        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="ml-auto px-4 py-2 transition text-white hover:text-[#A9DFD8]"
        >
          <RxHamburgerMenu className="text-2xl" />
        </button>
      </nav>

      {/* Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-xl dashboard-color`}
      >
        <div className="flex flex-col space-y-2 py-4 px-6">
          <button
            onClick={handleLoginClick}
            className="block w-full px-4 py-3 text-left bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className="block w-full px-4 py-3 text-left bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </button>
        </div>
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
    </>
  );
};

export default Navbar;

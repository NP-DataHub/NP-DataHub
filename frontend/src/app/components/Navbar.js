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
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Responsive Logo */}
        <picture>
          {/* Logo for small screens */}
          <source media="(max-width: 767px)" srcSet="/img/logo.jpg" />
          {/* Logo for medium screens and larger */}
          <img
            className="h-10 md:h-12 max-h-full"  
            src="/img/nonprofitly_primary_no_back.png"
            alt="Logo"
          />
        </picture>

        {/* Desktop Buttons */}
        <div className="ml-auto hidden md:flex space-x-2">
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 rounded-md transition text-black border-2 border-gray-200  hover:bg-gray-300"
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className="px-4 py-2 rounded-md transition text-black border-2 border-gray-200 hover:bg-gray-300"
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="ml-auto md:hidden">
          <button
            onClick={toggleMenu}
            className="px-4 py-2 transition text-black "
          >
            <RxHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Smooth Roll Down Effect */}
      <div
        className={`${
          isMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        } overflow-hidden transition-max-height duration-700 ease-in-out md:hidden bg-white shadow-lg mt-2`}
      >
        <button
          onClick={handleLoginClick}
          className="block w-full px-4 py-2 text-left bg-gray-200 text-gray-900 hover:bg-gray-300 transition"
        >
          Login
        </button>
        <button
          onClick={handleRegisterClick}
          className="block w-full px-4 py-2 text-left bg-gray-200 text-gray-900 hover:bg-gray-300 transition"
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

export default Navbar;

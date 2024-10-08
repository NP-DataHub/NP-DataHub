"use client";
import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
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

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      <div className="container px-4 py-4 flex mx-auto justify-between items-center">
        <img className = "h-10"src = '/img/nonprofitly_primary_no_back.png' ></img>
        <div className="ml-auto">
          <button
            onClick={handleLoginClick}
            className="mr-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition"
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition"
          >
            Register
          </button>
        </div>
      </div>
      {showLogin && <Login onClose={handleCloseLogin} onSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />}
      {showRegister && <Register onClose={handleCloseRegister} onSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />}
    </nav>
  );
};

export default Navbar;

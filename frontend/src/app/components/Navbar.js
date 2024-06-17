import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      <div className="container  px-4 py-4 flex  mx-auto justify-between items-center">
        <div className="text-xl font-bold text-gray-900 ">NP Data Hub</div>
        <div className="ml-auto">
          <a href = "dashboard">
          <button className="mr-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition">
            Login
          </button>
          </a>
          <a href = "dashboard">
          <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition">
            Register
          </button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

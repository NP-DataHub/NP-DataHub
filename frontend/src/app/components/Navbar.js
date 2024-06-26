import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900">NP Data Hub</div>
        <div className="ml-auto">
          <button className="mr-4 px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition">
            Login
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

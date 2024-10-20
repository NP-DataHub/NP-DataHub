"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaInfoCircle, FaQuestionCircle, FaTags, FaWrench } from 'react-icons/fa'; // Icons for About, FAQ, NTEE Code (FaTags), and Tool Suggestion

const Footer = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <footer className="dashboard-color text-white w-full py-6 border-t-2 border-[#2C2D33] px-10">
      <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Footer Text */}
        <span className="text-white text-sm md:text-base">
          &copy; 2024 Seven Point Labs
        </span>
        
        {/* Footer Links */}
        <div className="flex space-x-8">
          <button
            onClick={() => navigateTo('/about')}
            className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
          >
            <FaInfoCircle className="mr-2" /> About
          </button>
          <button
            onClick={() => navigateTo('/faq')}
            className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
          >
            <FaQuestionCircle className="mr-2" /> FAQ
          </button>
          <button
            onClick={() => navigateTo('/ntee-suggestion')}
            className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
          >
            <FaTags className="mr-2" /> NTEE Code Suggestion
          </button>
          <button
            onClick={() => navigateTo('/tool-suggestion')}
            className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
          >
            <FaWrench className="mr-2" /> Tool Suggestion
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import React, { useEffect, useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaToolbox } from "react-icons/fa";
import { PiGraph } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx"; // Hamburger icon
import { db } from '../firebase/firebase';
import { doSignOut } from '../firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './context';
import { useRouter } from 'next/navigation';

const Sidebar = ({ currentPage }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menu state
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (!userData) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    doSignOut();
  };
  const handleLogoClick = () => {
    router.push('/'); // Redirect to homepage
  };


  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { href: '/toolbox', label: 'Toolbox Library', icon: <FaToolbox />, pro: true },
    { href: '/networking-paths', label: 'Networking + Paths', icon: <PiGraph />, pro: true },
  ];

  return (
    <div className="relative">
      {/* Main container */}
      <div className="dashboard-color px-10 flex flex-row w-full items-center space-x-10 py-6 font-sans top-0 z-50 border-b-2 border-[#2C2D33] sticky">
        {/* Logo Section */}
        <picture className="flex-grow">
          <source media="(max-width: 767px)" srcSet="/img/inverted.png" />
          <img className="h-10 md:h-10 max-h-full cursor-pointer" src="/img/inverted.png" alt="Logo"  onClick={handleLogoClick}  />
          
        </picture>
        

        {/* Hamburger Menu for Small Screens */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white"
          aria-label="Toggle Menu"
        >
          <RxHamburgerMenu className="text-3xl text-white" />
        </button>

        {/* Links Section for larger screens */}
        <div className="hidden lg:flex space-x-10">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-md font-semibold flex items-center space-x-3 px-6 rounded-md ${
                currentPage === link.href
                  ? 'border-b-4 border-white hover:bg-[#21222D] hover:text-white pb-1 text-lg'
                  : 'hover:bg-[#21222D] hover:text-white pb-1 text-lg'
              }`}
            >
              <div className="text-2xl">{link.icon}</div>
              <span className="mt-0.5">{link.label}</span>
              {link.pro && (
                <span className="bg-slate-700 text-white rounded-md text-xs px-2 py-0.5 ml-2">Pro</span>
              )}
            </a>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src={userData.image || 'https://via.placeholder.com/150'}
              alt="User"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </div>

      {/* Hamburger Dropdown Menu for Small Screens */}
      <div
        className={`lg:hidden bg-[#1D1E26] shadow-lg rounded-lg transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? 'max-h-[400px] opacity-100 mb-12' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="py-4 px-6">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`block py-3 px-4 text-white font-semibold flex items-center justify-between hover:bg-[#21222D] rounded-lg transition-colors ${
                currentPage === link.href ? 'font-bold bg-[#21222D]' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">{link.icon}</div>
                <span>{link.label}</span>
              </div>
              {link.pro && (
                <span className="ml-2 bg-slate-700 text-white rounded-md text-xs px-2 py-0.5">Pro</span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Sidebar for User Profile */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#21222D] z-40 text-white shadow-lg transition-transform transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '300px', borderRadius: '10px 0 0 10px' }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img
              src={userData.image || 'https://via.placeholder.com/150'}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="font-semibold">
              {userData.firstName + ' ' + userData.lastName || 'User Name'}
            </span>
          </div>
          <button onClick={toggleSidebar} className="text-2xl">
            <IoClose />
          </button>
        </div>
        <div className="border-b border-gray-500 mx-4"></div>
        <div className="p-4">
          <a
            href="profile"
            className="text-[#e7e7ea] text-md font-semibold flex items-center space-x-3 px-1 py-2 hover:bg-[#353637] rounded-md"
          >
            <svg
              className="text-black"
              width="21"
              height="21"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6.48268C6.79565 6.48268 7.55871 6.15947 8.12132 5.58415C8.68393 5.00884 9 4.22854 9 3.41492C9 2.6013 8.68393 1.82101 8.12132 1.24569C7.55871 0.670377 6.79565 0.347168 6 0.347168C5.20435 0.347168 4.44129 0.670377 3.87868 1.24569C3.31607 1.82101 3 2.6013 3 3.41492C3 4.22854 3.31607 5.00884 3.87868 5.58415C4.44129 6.15947 5.20435 6.48268 6 6.48268ZM8 3.41492C8 3.95733 7.78929 4.47753 7.41421 4.86108C7.03914 5.24462 6.53043 5.46009 6 5.46009C5.46957 5.46009 4.96086 5.24462 4.58579 4.86108C4.21071 4.47753 4 3.95733 4 3.41492C4 2.87251 4.21071 2.35231 4.58579 1.96877C4.96086 1.58523 5.46957 1.36975 6 1.36975C6.53043 1.36975 7.03914 1.58523 7.41421 1.96877C7.78929 2.35231 8 2.87251 8 3.41492ZM12 11.5956C12 12.6182 11 12.6182 11 12.6182H1C1 12.6182 0 12.6182 0 11.5956C0 10.573 1 7.50526 6 7.50526C11 7.50526 12 10.573 12 11.5956ZM11 11.5915C10.999 11.34 10.846 10.5832 10.168 9.88993C9.516 9.2232 8.289 8.52785 6 8.52785C3.71 8.52785 2.484 9.2232 1.832 9.88993C1.154 10.5832 1.002 11.34 1 11.5915H11Z"
                className="fill-[#87888C] hover:fill-[black]"
              />
            </svg>

            <span className="mt-0">Profile</span>
          </a>

          <a
            href="#"
            className="text-[#e7e7ea] text-md font-semibold flex items-center space-x-3 px-1 py-2 hover:bg-[#353637] rounded-md"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.2852 13.5C4.29282 13.1917 3.39405 12.6214 2.6764 11.8446C2.9073 11.5597 3.05124 11.2095 3.0898 10.839C3.12835 10.4685 3.05977 10.0945 2.89283 9.76474C2.72589 9.43501 2.46819 9.1646 2.15269 8.98811C1.83719 8.81162 1.47825 8.73709 1.1218 8.77403C1.0406 8.36021 0.999789 7.9389 1 7.51654C1 6.86423 1.096 6.23502 1.2748 5.64388H1.3C1.60593 5.64398 1.90683 5.56297 2.1743 5.40847C2.44177 5.25398 2.66698 5.03112 2.82866 4.76092C2.99034 4.49073 3.08316 4.18212 3.09836 3.86423C3.11355 3.54635 3.05062 3.22968 2.9155 2.94413C3.61888 2.26274 4.46952 1.76742 5.3956 1.5C5.54631 1.80787 5.77595 2.06635 6.05911 2.24686C6.34227 2.42737 6.66791 2.52287 7 2.52278C7.33209 2.52287 7.65773 2.42737 7.94089 2.24686C8.22405 2.06635 8.45369 1.80787 8.6044 1.5C9.53048 1.76742 10.3811 2.26274 11.0845 2.94413C10.9484 3.23168 10.8855 3.55076 10.9019 3.87083C10.9182 4.19091 11.0133 4.50125 11.1779 4.77217C11.3426 5.04308 11.5713 5.2655 11.8422 5.41813C12.1131 5.57076 12.4171 5.64849 12.7252 5.64388C12.9079 6.24991 13.0006 6.88141 13 7.51654C13 7.94725 12.958 8.36798 12.8782 8.77403C12.5217 8.73709 12.1628 8.81162 11.8473 8.98811C11.5318 9.1646 11.2741 9.43501 11.1072 9.76474C10.9402 10.0945 10.8716 10.4685 10.9102 10.839C10.9488 11.2095 11.0927 11.5597 11.3236 11.8446C10.6059 12.6214 9.70718 13.1917 8.7148 13.5C8.59826 13.1221 8.36941 12.7925 8.06123 12.5587C7.75304 12.3248 7.38145 12.1988 7 12.1988C6.61855 12.1988 6.24695 12.3248 5.93877 12.5587C5.63059 12.7925 5.40173 13.1221 5.2852 13.5Z"
                stroke="#87888C"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
              <path
                d="M7.00039 9.70084C7.27617 9.70084 7.54924 9.64433 7.80402 9.53453C8.05881 9.42474 8.29031 9.26381 8.48531 9.06093C8.68032 8.85806 8.835 8.61721 8.94054 8.35214C9.04607 8.08707 9.10039 7.80298 9.10039 7.51607C9.10039 7.22916 9.04607 6.94506 8.94054 6.67999C8.835 6.41492 8.68032 6.17408 8.48531 5.9712C8.29031 5.76833 8.05881 5.6074 7.80402 5.4976C7.54924 5.38781 7.27617 5.3313 7.00039 5.3313C6.44344 5.3313 5.90929 5.56148 5.51547 5.9712C5.12164 6.38093 4.90039 6.93663 4.90039 7.51607C4.90039 8.0955 5.12164 8.65121 5.51547 9.06093C5.90929 9.47066 6.44344 9.70084 7.00039 9.70084V9.70084Z"
                stroke="#87888C"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>

            <span className="mt-0">Settings</span>
          </a>

          <a
            href="#"
            onClick={handleSignOut}
            className="text-[#e7e7ea] text-md font-semibold flex items-center space-x-3 px-1 py-2 hover:bg-[#353637] rounded-md"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.2 4.10077V2.85949C8.19999 2.67145 8.16555 2.48545 8.09886 2.31325C8.03217 2.14106 7.93467 1.98641 7.81253 1.85908C7.69039 1.73175 7.54627 1.63452 7.38927 1.57352C7.23227 1.51252 7.0658 1.48908 6.9004 1.50469L2.1004 1.95742C1.80043 1.98573 1.52081 2.14073 1.31698 2.39167C1.11315 2.64262 1.00001 2.97119 1 3.31222V11.6871C1.00001 12.0281 1.11315 12.3567 1.31698 12.6076C1.52081 12.8586 1.80043 13.0136 2.1004 13.0419L6.9004 13.4953C7.06585 13.5109 7.23237 13.4875 7.38941 13.4264C7.54645 13.3654 7.6906 13.2681 7.81275 13.1407C7.9349 13.0133 8.03238 12.8586 8.09904 12.6863C8.1657 12.514 8.20008 12.3279 8.2 12.1398V10.8986M7.6 7.49966H13H7.6ZM13 7.49966L11.0002 4.78055L13 7.49966ZM13 7.49966L11.0002 10.2188L13 7.49966Z"
                stroke="#87888C"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span className="mt-0">Logout</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

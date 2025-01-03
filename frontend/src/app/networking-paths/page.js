"use client";
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/dashboard_footer';
import SPIN from "../components/SPIN";

export default function NetworksPaths() {  // Component name updated to start with an uppercase letter
    const [isLoading, setIsLoading] = useState(true); // State to control the loading state
    const [isDarkMode, setIsDarkMode] = useState(false); 

    // If the sidebar's user data is loaded, stop the loading screen
    const handleUserDataLoaded = () => {
        setIsLoading(false);
    };

    const LoadingComponent = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
    // Load the theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const darkModeEnabled = savedTheme === "dark";
        setIsDarkMode(darkModeEnabled);
        document.documentElement.classList.toggle("dark", darkModeEnabled);
    }, []);

    // Handle theme toggle
    const handleThemeToggle = (newTheme) => {
        setIsDarkMode(newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <div>
            <div className={isDarkMode ? "dashboard-color text-white transition-colors duration-300 font-sans" : "bg-[#ffffff] text-black transition-colors duration-300 font-sans"}>
                {/* Sidebar will be hidden if isLoading is true */}
                <Sidebar onUserDataLoaded={handleUserDataLoaded} currentPage="/networking-paths" onThemeToggle = {handleThemeToggle} isDarkMode={isDarkMode}/>

                {/* Show a loading spinner for the main content until user data is loaded */}
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <div>
                        <div className="flex-col">
                            <SPIN isDarkMode={isDarkMode} />
                        </div>
                        <Footer isDarkMode={isDarkMode} />
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardNavbar from "../components/dashboardNav";
// import FiscalHealthComponent from "../components/FiscalHealthComponent";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import cities from "../components/cities";
import ntee_codes from "../components/ntee";
import { useRouter } from 'next/navigation';
import NewsFeedSection from "../components/newsfeed";
import FiscalHealthSection from "../components/FiscalHealthComponent";
import CalculatorSection from "../components/CalculatorComponent";
import Footer from "../components/dashboard_footer";
import RegionalHealthSection from "../components/RegionalHealthComponent";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaInfoCircle } from "react-icons/fa";
import COLAB from "../components/COLAB";
import AnomalyDetection from "../components/AnomalyDetection";

import dynamic from 'next/dynamic';
const ChoroplethMap = dynamic(() => import('../components/map'), { ssr: false });
    
export default function Toolbox() {
    const [selectedSection, setSelectedSection] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State to control the loading state
    const [city, setCity] = useState('');
    const [nonProfit2, setNonProfit2] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false); 
    //const nonProfitNames = NonProfitList()
    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : cities.filter(
            city => city.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    
    //console.log(nonProfitNames)

    const data2 = [
        {
          nonprofit: 'Food, Inc.',
          address: '123 Main Street, NY',
          zip: '12866',
          nteeCode: 'K: Food, Ag, Nutrition',
          revs: '$456,675',
        },
      ];

    const data = [
        {
          nonprofit: 'Food, Inc.',
          address: '123 Main Street, NY',
          zip: '12866',
          nteeCode: 'K: Food, Ag, Nutrition',
          revs: '$456,675',
        },
        {
          nonprofit: 'HealthAid, Inc.',
          address: '456 Elm Street, NY',
          zip: '12867',
          nteeCode: 'E: Health Care',
          revs: '$375,890',
        },
        {
          nonprofit: 'EduCare, Inc.',
          address: '789 Oak Avenue, NY',
          zip: '12868',
          nteeCode: 'B: Education',
          revs: '$520,000',
        },
        {
          nonprofit: 'GreenWorld, Inc.',
          address: '321 Pine Road, NY',
          zip: '12869',
          nteeCode: 'C: Environment',
          revs: '$600,250',
        },
        {
          nonprofit: 'AnimalAid, Inc.',
          address: '654 Maple Lane, NY',
          zip: '12870',
          nteeCode: 'D: Animal Welfare',
          revs: '$320,150',
        },
        {
          nonprofit: 'ArtCulture, Inc.',
          address: '987 Cedar Blvd, NY',
          zip: '12871',
          nteeCode: 'A: Arts, Culture',
          revs: '$410,675',
        },
        {
          nonprofit: 'ShelterHelp, Inc.',
          address: '123 Birch Street, NY',
          zip: '12872',
          nteeCode: 'L: Housing & Shelter',
          revs: '$290,980',
        },
        {
          nonprofit: 'LegalAid, Inc.',
          address: '456 Spruce Way, NY',
          zip: '12873',
          nteeCode: 'I: Crime & Legal',
          revs: '$350,450',
        },
        {
          nonprofit: 'YouthEmpower, Inc.',
          address: '789 Willow Dr, NY',
          zip: '12874',
          nteeCode: 'O: Youth Development',
          revs: '$430,560',
        },
        {
          nonprofit: 'TechForGood, Inc.',
          address: '321 Cypress Street, NY',
          zip: '12875',
          nteeCode: 'T: Technology',
          revs: '$480,720',
        },
      ];

      const data3 = [
        { variable: 'REVENUES', shelter: '$565,145', food: '$567,014', score: '64%', scoreColor: 'bg-green-500' },
        { variable: 'EXPENSES', shelter: '$415,148', food: '$781,542', score: '14%', scoreColor: 'bg-red-500' },
        { variable: 'ASSETS', shelter: '$124,564', food: '$367,145', score: '34%', scoreColor: 'bg-red-500' },
        { variable: 'LIABILITIES', shelter: '$565,145', food: '$587,014', score: '84%', scoreColor: 'bg-green-500' },
      ];
      
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
    
    const getSuggestionValue = suggestion => suggestion;

    const renderSuggestion = suggestion => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
            {suggestion}
        </div>
    );

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (event, { newValue }) => {
        setCity(newValue);
    };

    const onChange2 = (event, { newValue }) => {
        setNonProfit2(newValue);
    };
    

    const inputProps = {
        placeholder: 'Enter Nonprofit Name',
        value: city,
        onChange: onChange,
        className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
    };

    const inputProps2 = {
        placeholder: 'Enter Nonprofit Name',
        value: nonProfit2,
        onChange: onChange2,
        className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
    };

    const renderSuggestionsContainer = ({ containerProps, children }) => (
        <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-x-auto rounded z-10 ${suggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
            {children}
        </div>
    );

    const handleUserDataLoaded = () => {
        setIsLoading(false);
    };
    const LoadingComponent = () => (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? "" : "white"}`}>
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );

    return(
        
        <div>
             <div className={isDarkMode ? "dashboard-color text-white transition-colors duration-300" : "bg-[#ffffff] text-black transition-colors duration-300"}>

                <Sidebar
                onUserDataLoaded={handleUserDataLoaded}
                isDarkMode={isDarkMode}
                onThemeToggle={handleThemeToggle}
                    currentPage="/toolbox" />
                {isLoading ? (
                    <LoadingComponent/>
                ) : (
                <div className = "min-h-screen flex flex-col">
                <div className = "flex-grow">
                    <div className = {`flex-col px-10 ${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} rounded-md mx-10 p-10 font-sans mt-12 flex-grow mb-12`} >
                        <h1 className = "text-2xl font-semibold">NON PROFIT TOOLBOX LIBRARY</h1>
                        <span className = "text-sm text-[#A0A0A0]">Choose from one of eight analytical tools for stronger insights.</span>
                        <div
                                className={`relative ${
                                    isDarkMode ? "text-white" : "text-black"
                                }   transition-shadow duration-300 mt-6 `}
                                >
                                {/* Tint overlay */}                            
                                <div
                                    className={`absolute inset-0 ${
                                    isDarkMode ? "bg-black bg-opacity-0" : "bg-white bg-opacity-40"
                                    } rounded-lg`}
                                ></div>
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                            <div className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Fiscal Health" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                    }`}
                                    onClick={() =>
                                        setSelectedSection(
                                          selectedSection === "Fiscal Health" ? null : "Fiscal Health"
                                        )
                                      }
                                    >

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6.02589L11.452 6.53789C11.5222 6.61298 11.607 6.67285 11.7013 6.71378C11.7956 6.75471 11.8972 6.77584 12 6.77584C12.1028 6.77584 12.2044 6.75471 12.2987 6.71378C12.393 6.67285 12.4778 6.61298 12.548 6.53789L12 6.02589ZM9.434 19.2479C7.984 18.0719 6.292 16.5289 4.968 14.8399C3.629 13.1329 2.75 11.3799 2.75 9.76989H1.25C1.25 11.8869 2.38 13.9719 3.787 15.7659C5.209 17.5789 6.997 19.2019 8.489 20.4129L9.434 19.2479ZM2.75 9.76989C2.75 6.86489 4.018 5.06989 5.586 4.45489C7.151 3.84189 9.34 4.27989 11.452 6.53789L12.548 5.51389C10.16 2.95989 7.349 2.15389 5.039 3.05789C2.732 3.96189 1.25 6.44389 1.25 9.76989H2.75ZM15.51 20.4119C17.003 19.2009 18.791 17.5779 20.213 15.7649C21.62 13.9709 22.75 11.8859 22.75 9.76789H21.25C21.25 11.3799 20.37 13.1319 19.032 14.8389C17.708 16.5279 16.016 18.0709 14.566 19.2469L15.51 20.4119ZM22.75 9.76789C22.75 6.44289 21.268 3.96089 18.96 3.05789C16.65 2.15289 13.84 2.95789 11.452 5.51289L12.548 6.53789C14.66 4.27989 16.849 3.84089 18.414 4.45389C19.982 5.06789 21.25 6.86389 21.25 9.76789H22.75ZM8.489 20.4129C9.759 21.4449 10.642 22.2019 12 22.2019V20.7019C11.277 20.7019 10.827 20.3779 9.434 19.2479L8.489 20.4129ZM14.566 19.2469C13.173 20.3769 12.723 20.7019 12 20.7019V22.2019C13.358 22.2019 14.241 21.4449 15.511 20.4129L14.566 19.2469Z" fill = {isDarkMode ? "#FEB95A" : "#FFAA00" }/>
                                    <path d="M18.5 9.45189H16.5M16.5 9.45189H14.5M16.5 9.45189V7.45189M16.5 9.45189V11.4519" stroke = {isDarkMode ? "#FEB95A" : "#FFAA00" } stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                                

                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#FEB95A]" : "text-[#FFAA00]"}`} >FISCAL HEALTH</h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>Assess a nonprofit{"’"}s fiscal health based on a weighted score of various data variables. Compare the scores side-by-side with other nonprofits.</p>
                            </div>
                            <div
                                className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer  ${
                                    selectedSection === "Region Health" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                }`}
                                onClick={() =>
                                    setSelectedSection(
                                      selectedSection === "Region Health" ? null : "Region Health"
                                    )
                                  }
                                // data-tooltip-id="comparison-tooltip1"
                                // data-tooltip-content="Currently Under Development"
                                
                                >
                                {/* <ReactTooltip place="top" effect="solid" id="comparison-tooltip1" /> */}

                                    <svg className = "mb-4" width="36" height="39" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.6897 19.0367L7.93192 12.318C7.15315 11.3985 6.65164 10.2767 6.48579 9.08319C6.31994 7.8897 6.49657 6.67366 6.99513 5.57668C7.49368 4.4797 8.29363 3.54693 9.30181 2.88702C10.31 2.2271 11.4849 1.86719 12.6897 1.84921C14.3598 1.86572 15.9553 2.54343 17.1268 3.73391C18.2982 4.9244 18.9501 6.53061 18.9397 8.20078C18.9404 9.65776 18.4443 11.0714 17.5335 12.2086L12.6897 19.0367ZM12.6897 3.41171C11.4334 3.42614 10.2341 3.93857 9.35521 4.83648C8.47634 5.7344 7.98973 6.94439 8.00223 8.20078C8.00814 9.34739 8.42062 10.4547 9.16629 11.3258L12.6897 16.318L16.3069 11.2242C16.9945 10.366 17.3717 9.30046 17.3772 8.20078C17.3897 6.94439 16.9031 5.7344 16.0243 4.83648C15.1454 3.93857 13.9461 3.42614 12.6897 3.41171Z" fill={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M12.6897 8.88046C13.5527 8.88046 14.2522 8.18091 14.2522 7.31796C14.2522 6.45502 13.5527 5.75546 12.6897 5.75546C11.8268 5.75546 11.1272 6.45502 11.1272 7.31796C11.1272 8.18091 11.8268 8.88046 12.6897 8.88046Z" fill={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M22.0647 9.66171H20.5022V11.2242H22.0647V22.1617H3.31473V11.2242H4.87723V9.66171H3.31473C2.90033 9.66171 2.5029 9.82633 2.20988 10.1194C1.91685 10.4124 1.75223 10.8098 1.75223 11.2242V22.1617C1.75223 22.5761 1.91685 22.9735 2.20988 23.2666C2.5029 23.5596 2.90033 23.7242 3.31473 23.7242H22.0647C22.4791 23.7242 22.8766 23.5596 23.1696 23.2666C23.4626 22.9735 23.6272 22.5761 23.6272 22.1617V11.2242C23.6272 10.8098 23.4626 10.4124 23.1696 10.1194C22.8766 9.82633 22.4791 9.66171 22.0647 9.66171Z" fill={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                </svg>


                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#A9DFD8]" : "text-[#316498]"}`} >
                                    REGION HEALTH
                                </h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>Compare NTEE code sectors against public data that align with various regional non-profit{"'"}s missions.</p>
                            </div>
                            
                            <div
                                className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Anomaly Detection" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                }`}
                                onClick={() =>
                                    setSelectedSection(
                                      selectedSection === "Anomaly Detection" ? null : "Anomaly Detection"
                                    )
                                  }
                                >
                                <svg className="mb-4" width="36" height="39" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="6" width="6" height="6" fill={isDarkMode ? "#F2C8ED" : "#DB7093"} />
                                    <rect x="18" y="6" width="6" height="6" fill={isDarkMode ? "#F2C8ED" : "#DB7093"} />
                                    <rect x="6" y="18" width="6" height="6" fill={isDarkMode ? "#F2C8ED" : "#DB7093"} />
                                    <rect x="18" y="18" width="6" height="6" fill={isDarkMode ? "#F2C8ED" : "#DB7093"} />
                                    <circle cx="27" cy="27" r="5" stroke={isDarkMode ? "#F2C8ED" : "#DB7093"} strokeWidth="1.5" fill="none" />
                                    <line x1="30" y1="30" x2="34" y2="34" stroke={isDarkMode ? "#F2C8ED" : "#DB7093"} strokeWidth="1.5" strokeLinecap="round" />
                                </svg>


                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#F2C8ED]" : "text-[#DB7093]"}`} >
                                    ANOMALY DETECTION
                                </h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>Use a Machine Learning Model to find pototential outliers for nonprofits.</p>
                            </div>
                        
                            <div
                                className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "News Feed" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                }`}
                                onClick={() =>
                                    setSelectedSection(
                                      selectedSection === "News Feed" ? null : "News Feed"
                                    )
                                  }
                                >

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.10466 22.9153C5.50882 22.9153 4.99893 22.7033 4.57499 22.2794C4.15104 21.8554 3.93871 21.3452 3.93799 20.7486V5.58195C3.93799 4.98612 4.15032 4.47623 4.57499 4.05228C4.99966 3.62834 5.50954 3.41601 6.10466 3.41528H18.0213L23.438 8.83195V20.7486C23.438 21.3444 23.226 21.8547 22.8021 22.2794C22.3781 22.704 21.8679 22.916 21.2713 22.9153H6.10466ZM6.10466 20.7486H21.2713V9.91528H16.938V5.58195H6.10466V20.7486ZM8.27132 18.582H19.1047V16.4153H8.27132V18.582ZM8.27132 9.91528H13.688V7.74862H8.27132V9.91528ZM8.27132 14.2486H19.1047V12.082H8.27132V14.2486Z" fill = {isDarkMode ? "#FEB95A" : "#FFAA00" }/>
                                </svg>
                                
                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#FEB95A]" : "text-[#FFAA00]"}`} >NEWS FEEDS</h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>A tool to understanding larger scale problems and connecting to regional nonprofits via social media and search engines.</p>
                            </div>
                            <div
                                className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Calculator" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                }`}
                                onClick={() =>
                                    setSelectedSection(
                                      selectedSection === "Calculator" ? null : "Calculator"
                                    )
                                  }
                                >

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1349_1562)">
                                    <path d="M5.1202 25.17C6.95076 27 9.89798 27 15.7896 27C21.6827 27 24.6285 27 26.4591 25.1687C28.2896 23.34 28.2896 20.3925 28.2896 14.5C28.2896 8.6075 28.2896 5.66125 26.4591 3.83C24.6285 2 21.6813 2 15.7896 2C9.89659 2 6.95076 2 5.1202 3.83C3.28965 5.6625 3.28965 8.6075 3.28965 14.5C3.28965 20.3925 3.28965 23.34 5.1202 25.17Z" stroke={isDarkMode ? "#A9DFD8" : "#316498"} stroke-width="1.5"/>
                                    <path d="M8.8452 9.5C8.8452 8.91875 8.8452 8.62875 8.91604 8.39C9.01075 8.07233 9.19664 7.78268 9.45505 7.55011C9.71346 7.31754 10.0353 7.15024 10.3883 7.065C10.6563 7 10.9785 7 11.623 7H19.9563C20.6021 7 20.9244 7 21.1896 7.06375C21.5426 7.14899 21.8644 7.31629 22.1229 7.54886C22.3813 7.78143 22.5672 8.07108 22.6619 8.38875C22.7341 8.63 22.7341 8.92 22.7341 9.5C22.7341 10.08 22.7341 10.3712 22.6633 10.61C22.5685 10.9277 22.3827 11.2173 22.1242 11.4499C21.8658 11.6825 21.544 11.8498 21.191 11.935C20.9244 12 20.6008 12 19.9563 12H11.623C10.9771 12 10.6549 12 10.3896 11.9363C10.0367 11.851 9.71485 11.6837 9.45644 11.4511C9.19803 11.2186 9.01214 10.9289 8.91743 10.6112C8.8452 10.37 8.8452 10.08 8.8452 9.5Z" stroke={isDarkMode ? "#A9DFD8" : "#316498"} stroke-width="1.5"/>
                                    <path d="M11.123 15.75C11.123 16.116 10.7759 16.5 10.2341 16.5C9.69232 16.5 9.3452 16.116 9.3452 15.75C9.3452 15.384 9.69232 15 10.2341 15C10.7759 15 11.123 15.384 11.123 15.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M11.123 20.75C11.123 21.116 10.7759 21.5 10.2341 21.5C9.69232 21.5 9.3452 21.116 9.3452 20.75C9.3452 20.384 9.69232 20 10.2341 20C10.7759 20 11.123 20.384 11.123 20.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M16.6785 15.75C16.6785 16.116 16.3314 16.5 15.7896 16.5C15.2479 16.5 14.9008 16.116 14.9008 15.75C14.9008 15.384 15.2479 15 15.7896 15C16.3314 15 16.6785 15.384 16.6785 15.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M16.6785 20.75C16.6785 21.116 16.3314 21.5 15.7896 21.5C15.2479 21.5 14.9008 21.116 14.9008 20.75C14.9008 20.384 15.2479 20 15.7896 20C16.3314 20 16.6785 20.384 16.6785 20.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M22.2341 15.75C22.2341 16.116 21.887 16.5 21.3452 16.5C20.8034 16.5 20.4563 16.116 20.4563 15.75C20.4563 15.384 20.8034 15 21.3452 15C21.887 15 22.2341 15.384 22.2341 15.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    <path d="M22.2341 20.75C22.2341 21.116 21.887 21.5 21.3452 21.5C20.8034 21.5 20.4563 21.116 20.4563 20.75C20.4563 20.384 20.8034 20 21.3452 20C21.887 20 22.2341 20.384 22.2341 20.75Z" fill={isDarkMode ? "#A9DFD8" : "#316498"} stroke={isDarkMode ? "#A9DFD8" : "#316498"}/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_1349_1562">
                                    <rect width="24" height="24" fill="white" transform="translate(0.289646)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                

                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#A9DFD8]" : "text-[#316498]"}`} >
                                    CALCULATOR
                                </h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>Estimate and budget growth of sectors based on percentages and fiscal variables.</p>
                            </div>
                            <div
                                className={`z-10 relative p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Co:Lab" ? isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black" : isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"
                                }`}
                                //data-tooltip-id="comparison-tooltip4"
                                // data-tooltip-content="Currently Under Development"
                                
                                onClick={() =>
                                    setSelectedSection(
                                      selectedSection === "Co:Lab" ? null : "Co:Lab"
                                    )
                                  }
                                >
                                <ReactTooltip place="top" effect="solid" id="comparison-tooltip4" />

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.6875 15.4063V14.625H2.125V15.4063C2.125 16.8567 2.70117 18.2477 3.72676 19.2732C4.75235 20.2988 6.14335 20.875 7.59375 20.875H9.9375V19.3125H7.59375C6.55775 19.3125 5.56418 18.901 4.83161 18.1684C4.09905 17.4358 3.6875 16.4423 3.6875 15.4063ZM17.75 7.59375V8.375H19.3125V7.59375C19.3125 6.14335 18.7363 4.75235 17.7107 3.72676C16.6852 2.70117 15.2942 2.125 13.8438 2.125H11.5V3.6875H13.8438C14.3567 3.6875 14.8647 3.78854 15.3386 3.98485C15.8125 4.18115 16.2432 4.46889 16.6059 4.83162C16.9686 5.19434 17.2563 5.62497 17.4527 6.09889C17.649 6.57282 17.75 7.08078 17.75 7.59375ZM7.59375 7.59375H2.90625C2.28465 7.59375 1.68851 7.84068 1.24897 8.28022C0.80943 8.71976 0.5625 9.3159 0.5625 9.9375V11.5H2.125V9.9375C2.125 9.7303 2.20731 9.53159 2.35382 9.38507C2.50034 9.23856 2.69905 9.15625 2.90625 9.15625H7.59375C7.80095 9.15625 7.99966 9.23856 8.14618 9.38507C8.29269 9.53159 8.375 9.7303 8.375 9.9375V11.5H9.9375V9.9375C9.9375 9.3159 9.69057 8.71976 9.25103 8.28022C8.81149 7.84068 8.21535 7.59375 7.59375 7.59375ZM5.25 6.8125C5.86807 6.8125 6.47225 6.62922 6.98616 6.28584C7.50006 5.94246 7.9006 5.45441 8.13712 4.88339C8.37365 4.31237 8.43553 3.68403 8.31495 3.07784C8.19438 2.47165 7.89675 1.91483 7.45971 1.47779C7.02267 1.04075 6.46585 0.743126 5.85966 0.622547C5.25347 0.501969 4.62513 0.563854 4.05411 0.800378C3.4831 1.0369 2.99504 1.43744 2.65166 1.95134C2.30828 2.46525 2.125 3.06943 2.125 3.6875C2.125 4.5163 2.45424 5.31116 3.04029 5.89721C3.62634 6.48326 4.4212 6.8125 5.25 6.8125ZM5.25 2.125C5.55903 2.125 5.86113 2.21664 6.11808 2.38833C6.37503 2.56002 6.5753 2.80405 6.69356 3.08956C6.81182 3.37507 6.84277 3.68923 6.78248 3.99233C6.72219 4.29543 6.57337 4.57384 6.35485 4.79236C6.13633 5.01088 5.85792 5.15969 5.55483 5.21998C5.25173 5.28027 4.93757 5.24933 4.65206 5.13106C4.36655 5.0128 4.12252 4.81253 3.95083 4.55558C3.77914 4.29863 3.6875 3.99653 3.6875 3.6875C3.6875 3.2731 3.85212 2.87567 4.14515 2.58265C4.43817 2.28962 4.8356 2.125 5.25 2.125ZM20.0938 18.5313H15.4062C14.7846 18.5313 14.1885 18.7782 13.749 19.2177C13.3094 19.6573 13.0625 20.2534 13.0625 20.875V22.4375H14.625V20.875C14.625 20.6678 14.7073 20.4691 14.8538 20.3226C15.0003 20.1761 15.199 20.0938 15.4062 20.0938H20.0938C20.301 20.0938 20.4997 20.1761 20.6462 20.3226C20.7927 20.4691 20.875 20.6678 20.875 20.875V22.4375H22.4375V20.875C22.4375 20.2534 22.1906 19.6573 21.751 19.2177C21.3115 18.7782 20.7154 18.5313 20.0938 18.5313ZM14.625 14.625C14.625 15.2431 14.8083 15.8473 15.1517 16.3612C15.495 16.8751 15.9831 17.2756 16.5541 17.5121C17.1251 17.7486 17.7535 17.8105 18.3597 17.69C18.9658 17.5694 19.5227 17.2717 19.9597 16.8347C20.3967 16.3977 20.6944 15.8408 20.815 15.2347C20.9355 14.6285 20.8736 14.0001 20.6371 13.4291C20.4006 12.8581 20.0001 12.37 19.4862 12.0267C18.9723 11.6833 18.3681 11.5 17.75 11.5C16.9212 11.5 16.1263 11.8292 15.5403 12.4153C14.9542 13.0013 14.625 13.7962 14.625 14.625ZM19.3125 14.625C19.3125 14.934 19.2209 15.2361 19.0492 15.4931C18.8775 15.75 18.6335 15.9503 18.3479 16.0686C18.0624 16.1868 17.7483 16.2178 17.4452 16.1575C17.1421 16.0972 16.8637 15.9484 16.6451 15.7299C16.4266 15.5113 16.2778 15.2329 16.2175 14.9298C16.1572 14.6267 16.1882 14.3126 16.3064 14.0271C16.4247 13.7415 16.625 13.4975 16.8819 13.3258C17.1389 13.1541 17.441 13.0625 17.75 13.0625C18.1644 13.0625 18.5618 13.2271 18.8549 13.5201C19.1479 13.8132 19.3125 14.2106 19.3125 14.625Z" fill={isDarkMode ? "#F2C8ED" : "#DB7093"}/>
                                </svg>

                                <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-[#F2C8ED]" : "text-[#DB7093]"}`} >
                                    COLLAB:LAB
                                </h2>
                                <p className={`text-sm ${isDarkMode ? "text-white" : "text-black" } `}>Search and compare nonprofits from other sectors in your backyard that may be strong partners.</p>
                            </div>

                        </div>
                        </div>

                        { selectedSection === "" && (
                            <div className="flex-grow"></div>
                        )}
                        <div className="mt-12">
                            {selectedSection === "Fiscal Health" && (
                                <FiscalHealthSection isDarkMode={isDarkMode}/>
                                
                            )}
                            {selectedSection === "Region Health" && (
                                <RegionalHealthSection isDarkMode={isDarkMode}/>
                            )}
                            {selectedSection === "Co:Lab" && (
                                <COLAB isDarkMode={isDarkMode}></COLAB>
                            )}
                            {selectedSection === "News Feed" && (
                                <NewsFeedSection isDarkMode={isDarkMode}></NewsFeedSection>
                            )}
                            {selectedSection === "Calculator" && (
                                <CalculatorSection isDarkMode={isDarkMode}></CalculatorSection>
                            )}
                            {selectedSection === "Anomaly Detection" && (
                                <AnomalyDetection isDarkMode={isDarkMode}></AnomalyDetection>
                            )}
                        </div>
                    </div>
                </div>
                <Footer isDarkMode={isDarkMode}/>
                </div>
            )}
            </div>
        </div>
        
    );
}

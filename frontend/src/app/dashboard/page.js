"use client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardNavbar from "../components/dashboardNav";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import cities from "../components/cities";
import ntee_codes from "../components/ntee";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [state, setState] = useState('');
    const [nteeCode, setNteeCode] = useState('');
    const [city, setCity] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [NteeSuggestions, setNteeSuggestions] = useState([]);
    const [allResults, setAllResults] = useState([]); // Store all results
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [itemsPerPage] = useState(10); // Set items per page
    const [hasSearched, setHasSearched] = useState(false);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResults = allResults.slice(indexOfFirstItem, indexOfLastItem);
    const router = useRouter();
    let mostRecentYear = 0

    const formatNumber = (num) => {
        if (num >= 1000000000) {
          return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        }
        return num;
      };


    const handleNonprofitClick = (id) => {
        router.push(`/nonprofit/${id}`);
    };


    const capitalizeFirstLetter = (str) => {
        return str.split(' ')
            .map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    };


    const searchResultsRef = useRef(null); // Create a ref for the search results div

    const handleSearch = async () => {
        try {
          const response = await fetch(`/api/items?state=${state}&city=${city}&nteeCode=${nteeCode}`);
          const data = await response.json();
          if (data.success) {
            // Process data to include most recent year's revenue and expenses
            const processedData = data.data.map(item => {
              const years = Object.keys(item).filter(year => !isNaN(year)).sort();
              mostRecentYear = years[years.length - 1];
              return {
                ...item,
                annualRevenue: mostRecentYear ? item[mostRecentYear]['Total Revenue'] : 'N/A',
                annualExpenses: mostRecentYear ? item[mostRecentYear]['Total Expenses'] : 'N/A'
              };
            });
            setAllResults(processedData);
            setCurrentPage(1);
            setHasSearched(true);

            // Scroll to the search results div
            setTimeout(() => {
              if (searchResultsRef.current) {
                searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 2);
          } else {
            console.error('Failed to fetch items:', data.error);
          }
        } catch (error) {
          console.error('Failed to fetch items:', error);
        }
      };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // Render pagination controls
    const renderPaginationControls = () => {
        const pageNumbers = [];
        const totalPages = Math.ceil(allResults.length / itemsPerPage);
        const maxPageDisplay = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
        const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        return (
            <div className="flex justify-center mt-4">
                {startPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 mx-1 rounded bg-[#171821] text-white"
                    >
                        &lt;
                    </button>
                )}
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-1 mx-1 rounded ${currentPage === number ? 'bg-[#A9DFD8] text-black' : 'bg-[#171821] text-white'}`}
                    >
                        {number}
                    </button>
                ))}
                {endPage < totalPages && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 mx-1 rounded bg-[#171821] text-white"
                    >
                        &gt;
                    </button>
                )}
            </div>
        );
    };
    
    console.log("searchResults:", searchResults);


    const getNteeSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const nteeArray = Object.keys(ntee_codes).map(key => ({
            code: key,
            description: ntee_codes[key]
        }));
        return inputLength === 0 ? [] : nteeArray.filter(
            ntee => 
                ntee.code.toLowerCase().slice(0, inputLength) === inputValue ||
                ntee.description.toLowerCase().includes(inputValue)
        );
    };

    const getNteeSuggestionValue = suggestion => suggestion.code;

    const renderNteeSuggestion = suggestion => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
            {suggestion.code} - {suggestion.description}
        </div>
    );

    const onNteeSuggestionsFetchRequested = ({ value }) => {
        setNteeSuggestions(getNteeSuggestions(value));
    };
    
    const onNteeSuggestionsClearRequested = () => {
        setNteeSuggestions([]);
    };
    
    const onNteeChange = (event, { newValue }) => {
        setNteeCode(newValue);
    };
    

    const NteeInputProps = {
        placeholder: 'Enter NTEE Code or Description',
        value: nteeCode,
        onChange: onNteeChange,
        className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
    };
    

    const renderNteeSuggestionsContainer = ({ containerProps, children }) => (
        <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-x-auto rounded z-10 ${NteeSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
            {children}
        </div>
    );
    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : cities.filter(
            city => city.toLowerCase().slice(0, inputLength) === inputValue
        );
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

    const inputProps = {
        placeholder: 'Enter City',
        value: city,
        onChange: onChange,
        className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
    };

    const renderSuggestionsContainer = ({ containerProps, children }) => (
        <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-x-auto rounded z-10 ${suggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
            {children}
        </div>
    );

    return(
        <div>
            <div className = "flex dashboard-color text-white font-sans">
                <Sidebar/>
                <div className = "flex-col w-screen">
                    <DashboardNavbar/>
                    <div className = "flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
                        <h1 className = "text-2xl font-semibold">CREATING NONPROFIT ECOSYSTEMS THROUGH DATA</h1>
                        <span className = "text-sm text-[#A0A0A0]">Explore historical data and gain insight through prescriptive and predictive analytics.</span>
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.1994 7.09144L11.2237 1.22339L1.24802 7.09144V18.8276L11.2237 24.6956L21.1994 18.8276V7.09144Z" stroke="#FEB95A" stroke-width="1.95" stroke-linejoin="round"/>
                                    <path d="M6.52927 14.1332V16.4804M11.2237 11.7859V16.4804V11.7859ZM15.9182 9.43872V16.4804V9.43872Z" stroke="#FEB95A" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">FOUNDATIONS</h2>
                                <p className="text-sm text-[#FEB95A]">Assess the financial health of nonprofits to maximize ROI while directing funds and grants to those that need the infusion the most to make a difference.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.1844 2.69312H17.9502C18.2466 2.69312 18.5309 2.81201 18.7404 3.02364C18.95 3.23527 19.0677 3.5223 19.0677 3.8216V22.4415C19.0677 22.7408 18.95 23.0278 18.7404 23.2395C18.5309 23.4511 18.2466 23.57 17.9502 23.57H2.30525C2.00887 23.57 1.72463 23.4511 1.51506 23.2395C1.30548 23.0278 1.18775 22.7408 1.18775 22.4415V3.8216C1.18775 3.5223 1.30548 3.23527 1.51506 3.02364C1.72463 2.81201 2.00887 2.69312 2.30525 2.69312H6.2165V4.38584H14.039V2.69312H15.1844Z" stroke="#A9DFD8" stroke-width="1.5" stroke-linejoin="round"/>
                                    <path d="M11.8044 9.4636L7.3344 13.9781H12.9241L8.4519 18.492M6.2169 1H14.0394V4.38544H6.2169V1Z" stroke="#A9DFD8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">NONPROFITS</h2>
                                <p className = "text-sm text-[#A9DFD8]">Gain valuable insights to strengthen financial standing and find collaborators within 
                                and across different sectors.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3429 6.24471H20.9482C21.1663 6.24493 21.3765 6.32607 21.5381 6.47243C21.6998 6.61879 21.8013 6.81993 21.8231 7.0369L22.3601 12.4062H20.5891L20.149 8.00513H17.3429V10.6458C17.3429 10.8792 17.2501 11.1031 17.0851 11.2682C16.92 11.4332 16.6961 11.526 16.4627 11.526C16.2292 11.526 16.0053 11.4332 15.8403 11.2682C15.6752 11.1031 15.5825 10.8792 15.5825 10.6458V8.00513H8.5408V10.6458C8.5408 10.8792 8.44806 11.1031 8.28299 11.2682C8.11792 11.4332 7.89404 11.526 7.66059 11.526C7.42715 11.526 7.20326 11.4332 7.03819 11.2682C6.87312 11.1031 6.78038 10.8792 6.78038 10.6458V8.00513H3.97252L2.56418 22.0885H12.0616V23.8489H1.59067C1.46773 23.8488 1.34618 23.8229 1.23385 23.7729C1.12152 23.723 1.0209 23.65 0.938471 23.5588C0.856045 23.4676 0.793641 23.3601 0.755281 23.2433C0.71692 23.1265 0.703452 23.003 0.715746 22.8806L2.30012 7.0369C2.32193 6.81993 2.42349 6.61879 2.58513 6.47243C2.74678 6.32607 2.95699 6.24493 3.17505 6.24471H6.78038V5.63032C6.78038 2.57776 9.1323 0.083252 12.0616 0.083252C14.991 0.083252 17.3429 2.57776 17.3429 5.63032V6.24647V6.24471ZM15.5825 6.24471V5.63032C15.5825 3.52839 13.9946 1.84367 12.0616 1.84367C10.1287 1.84367 8.5408 3.52839 8.5408 5.63032V6.24647H15.5825V6.24471ZM21.1225 19.3422C21.2028 19.2548 21.2999 19.1846 21.4081 19.1357C21.5162 19.0869 21.6331 19.0604 21.7517 19.0578C21.8703 19.0553 21.9883 19.0768 22.0984 19.121C22.2085 19.1652 22.3086 19.2312 22.3925 19.315C22.4765 19.3988 22.5426 19.4988 22.587 19.6089C22.6313 19.7189 22.653 19.8368 22.6506 19.9555C22.6482 20.0741 22.6219 20.191 22.5732 20.2992C22.5245 20.4074 22.4544 20.5046 22.3671 20.5851L18.8463 24.1059C18.6812 24.2709 18.4574 24.3636 18.224 24.3636C17.9906 24.3636 17.7667 24.2709 17.6017 24.1059L14.0808 20.5851C13.9968 20.5039 13.9297 20.4067 13.8836 20.2994C13.8374 20.192 13.8132 20.0765 13.8121 19.9596C13.8111 19.8427 13.8334 19.7268 13.8777 19.6186C13.9219 19.5105 13.9873 19.4122 14.0699 19.3295C14.1526 19.2469 14.2508 19.1815 14.359 19.1373C14.4672 19.093 14.5831 19.0708 14.7 19.0718C14.8168 19.0728 14.9323 19.0971 15.0397 19.1432C15.1471 19.1893 15.2442 19.2564 15.3254 19.3405L17.3429 21.3596V15.0468C17.3429 14.8133 17.4356 14.5895 17.6007 14.4244C17.7658 14.2593 17.9896 14.1666 18.2231 14.1666C18.4565 14.1666 18.6804 14.2593 18.8455 14.4244C19.0106 14.5895 19.1033 14.8133 19.1033 15.0468V21.3596L21.1225 19.3405V19.3422Z" fill="#F2C8ED"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">DONORS</h2>
                                <p className = "text-sm text-[#F2C8ED]">Find pathways for strategic
                                    investments and return on
                                    investment strategies for you, your company, 
                                    or your client.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.0394 12.0001C14.0733 12.0001 16.5328 9.57496 16.5328 6.58341C16.5328 3.59187 14.0733 1.16675 11.0394 1.16675C8.00543 1.16675 5.54593 3.59187 5.54593 6.58341C5.54593 9.57496 8.00543 12.0001 11.0394 12.0001Z" stroke="#20AEF3" stroke-width="1.5"/>
                                    <path d="M15.4344 16.3335H22.0266M16.5331 22.8335H3.6411C3.32949 22.8336 3.02143 22.7683 2.73736 22.642C2.4533 22.5157 2.19973 22.3313 1.99347 22.1009C1.78722 21.8706 1.63301 21.5997 1.54106 21.3061C1.44912 21.0125 1.42156 20.703 1.4602 20.3982L1.88869 17.0138C1.98833 16.2276 2.37586 15.5043 2.9784 14.98C3.58094 14.4557 4.35698 14.1665 5.16058 14.1668H5.54622L16.5331 22.8335ZM18.7305 13.0835V19.5835V13.0835Z" stroke="#20AEF3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h2 className="text-xl font-semibold mb-2">GOVERNMENT</h2>
                                <p className = "text-sm text-[#20AEF3]">Foster relationships with mission-drive foundations 
                                    and nonprofits looking 
                                    to partner with local, state, 
                                    and federal agencies.</p>
                            </div>
                        </div>
                    </div>
                    <div className = "flex justify-center  m-8 text-2xl font-sans font-semibold">
                        <h1>CHOOSE FROM A SUITE OF ANALYTICAL TOOLS</h1>
                    </div>
                    <div className = "flex-col mx-10 font-sans">
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl text-center font-semibold mb-2">HISTORICAL PERFORMANCE</h2>
                                <div className = "flex justify-center">
                                    <svg  width="515" height="306" viewBox="0 0 215 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99623 9.02717C11.5503 13.8053 31.0025 23.3614 32.3783 23.3614C33.7541 23.3614 40.5948 23.3614 43.8432 23.3614L71.9323 15.3342L96.0086 30.2418H109.767L133.843 13.0408L145.881 17.0543L182.569 42.2826L191.167 38.269L212.378 1" stroke="#A9DFD8" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M32.3783 23.9349L1.99623 9.60066V71.4998H212.951V0.999756L190.956 38.9998L182.569 42.8561L145.881 17.6278L133.843 13.6142L109.767 30.8153H102.888H96.0086L71.9323 15.9077L43.8432 23.9349H32.3783Z" fill="url(#paint0_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="9" r="2" fill="#A9DFD8"/>
                                        <circle cx="31.9913" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="43.9883" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="70.9825" cy="15" r="2" fill="#A9DFD8"/>
                                        <circle cx="95.9767" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="109.974" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="133.969" cy="13" r="2" fill="#A9DFD8"/>
                                        <circle cx="145.966" cy="17" r="2" fill="#A9DFD8"/>
                                        <circle cx="182.958" cy="42" r="2" fill="#A9DFD8"/>
                                        <circle cx="190.957" cy="38" r="2" fill="#A9DFD8"/>
                                        <circle cx="211.952" cy="2" r="2" fill="#A9DFD8"/>
                                        <path d="M1.99623 52.7894L18.6204 51.0693L40.977 40.1753L70.7858 71.1372H102.314L138.429 60.2432L184.289 63.1101L212.378 43.0421" stroke="#F2C8ED" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M18.6204 51.6426L1.99623 53.3627V106H212.951V43.042L184.289 63.6833L161.962 62L137.967 60.5L102.314 71.7105H70.4815L40.977 40.7485L18.6204 51.6426Z" fill="url(#paint1_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="53" r="2" fill="#F2C8ED"/>
                                        <circle cx="17.9943" cy="51" r="2" fill="#F2C8ED"/>
                                        <circle cx="40.9894" cy="40" r="2" fill="#F2C8ED"/>
                                        <circle cx="70.9825" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="101.976" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="137.968" cy="60" r="2" fill="#F2C8ED"/>
                                        <circle cx="183.958" cy="63" r="2" fill="#F2C8ED"/>
                                        <circle cx="212.952" cy="42" r="2" fill="#F2C8ED"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1237_654" x1="105.474" y1="-3.88177" x2="106.95" y2="78.4434" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#A9DFD8"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_1237_654" x1="105.974" y1="37.1053" x2="106.465" y2="106.496" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F2C8ED"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center ">PREDICTIVE ANALYTICS</h2>
                                <div className = "flex justify-center">
                                    <svg  width="515" height="306" viewBox="0 0 215 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99623 9.02717C11.5503 13.8053 31.0025 23.3614 32.3783 23.3614C33.7541 23.3614 40.5948 23.3614 43.8432 23.3614L71.9323 15.3342L96.0086 30.2418H109.767L133.843 13.0408L145.881 17.0543L182.569 42.2826L191.167 38.269L212.378 1" stroke="#A9DFD8" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M32.3783 23.9349L1.99623 9.60066V71.4998H212.951V0.999756L190.956 38.9998L182.569 42.8561L145.881 17.6278L133.843 13.6142L109.767 30.8153H102.888H96.0086L71.9323 15.9077L43.8432 23.9349H32.3783Z" fill="url(#paint0_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="9" r="2" fill="#A9DFD8"/>
                                        <circle cx="31.9913" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="43.9883" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="70.9825" cy="15" r="2" fill="#A9DFD8"/>
                                        <circle cx="95.9767" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="109.974" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="133.969" cy="13" r="2" fill="#A9DFD8"/>
                                        <circle cx="145.966" cy="17" r="2" fill="#A9DFD8"/>
                                        <circle cx="182.958" cy="42" r="2" fill="#A9DFD8"/>
                                        <circle cx="190.957" cy="38" r="2" fill="#A9DFD8"/>
                                        <circle cx="211.952" cy="2" r="2" fill="#A9DFD8"/>
                                        <path d="M1.99623 52.7894L18.6204 51.0693L40.977 40.1753L70.7858 71.1372H102.314L138.429 60.2432L184.289 63.1101L212.378 43.0421" stroke="#F2C8ED" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M18.6204 51.6426L1.99623 53.3627V106H212.951V43.042L184.289 63.6833L161.962 62L137.967 60.5L102.314 71.7105H70.4815L40.977 40.7485L18.6204 51.6426Z" fill="url(#paint1_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="53" r="2" fill="#F2C8ED"/>
                                        <circle cx="17.9943" cy="51" r="2" fill="#F2C8ED"/>
                                        <circle cx="40.9894" cy="40" r="2" fill="#F2C8ED"/>
                                        <circle cx="70.9825" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="101.976" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="137.968" cy="60" r="2" fill="#F2C8ED"/>
                                        <circle cx="183.958" cy="63" r="2" fill="#F2C8ED"/>
                                        <circle cx="212.952" cy="42" r="2" fill="#F2C8ED"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1237_654" x1="105.474" y1="-3.88177" x2="106.95" y2="78.4434" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#A9DFD8"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_1237_654" x1="105.974" y1="37.1053" x2="106.465" y2="106.496" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F2C8ED"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center">NETWORKS + PATHS</h2>
                                <div className = "flex justify-center">
                                    <svg  width="515" height="306" viewBox="0 0 215 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99623 9.02717C11.5503 13.8053 31.0025 23.3614 32.3783 23.3614C33.7541 23.3614 40.5948 23.3614 43.8432 23.3614L71.9323 15.3342L96.0086 30.2418H109.767L133.843 13.0408L145.881 17.0543L182.569 42.2826L191.167 38.269L212.378 1" stroke="#A9DFD8" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M32.3783 23.9349L1.99623 9.60066V71.4998H212.951V0.999756L190.956 38.9998L182.569 42.8561L145.881 17.6278L133.843 13.6142L109.767 30.8153H102.888H96.0086L71.9323 15.9077L43.8432 23.9349H32.3783Z" fill="url(#paint0_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="9" r="2" fill="#A9DFD8"/>
                                        <circle cx="31.9913" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="43.9883" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="70.9825" cy="15" r="2" fill="#A9DFD8"/>
                                        <circle cx="95.9767" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="109.974" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="133.969" cy="13" r="2" fill="#A9DFD8"/>
                                        <circle cx="145.966" cy="17" r="2" fill="#A9DFD8"/>
                                        <circle cx="182.958" cy="42" r="2" fill="#A9DFD8"/>
                                        <circle cx="190.957" cy="38" r="2" fill="#A9DFD8"/>
                                        <circle cx="211.952" cy="2" r="2" fill="#A9DFD8"/>
                                        <path d="M1.99623 52.7894L18.6204 51.0693L40.977 40.1753L70.7858 71.1372H102.314L138.429 60.2432L184.289 63.1101L212.378 43.0421" stroke="#F2C8ED" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M18.6204 51.6426L1.99623 53.3627V106H212.951V43.042L184.289 63.6833L161.962 62L137.967 60.5L102.314 71.7105H70.4815L40.977 40.7485L18.6204 51.6426Z" fill="url(#paint1_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="53" r="2" fill="#F2C8ED"/>
                                        <circle cx="17.9943" cy="51" r="2" fill="#F2C8ED"/>
                                        <circle cx="40.9894" cy="40" r="2" fill="#F2C8ED"/>
                                        <circle cx="70.9825" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="101.976" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="137.968" cy="60" r="2" fill="#F2C8ED"/>
                                        <circle cx="183.958" cy="63" r="2" fill="#F2C8ED"/>
                                        <circle cx="212.952" cy="42" r="2" fill="#F2C8ED"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1237_654" x1="105.474" y1="-3.88177" x2="106.95" y2="78.4434" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#A9DFD8"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_1237_654" x1="105.974" y1="37.1053" x2="106.465" y2="106.496" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F2C8ED"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "flex justify-center  m-8 text-2xl font-sans font-semibold">
                        <h1>BEGIN YOUR SEARCH</h1>
                    </div>
                    <div className="flex-col mx-10 font-sans mb-10">
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ">
                            <select 
                                className="mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]" 
                                value={state} 
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Select State</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </select>
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <Autosuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        inputProps={inputProps}
                                        renderSuggestionsContainer={renderSuggestionsContainer}
                                    />
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                        <Autosuggest
                                            suggestions={NteeSuggestions}
                                            onSuggestionsFetchRequested={onNteeSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={onNteeSuggestionsClearRequested}
                                            getSuggestionValue={getNteeSuggestionValue}
                                            renderSuggestion={renderNteeSuggestion}
                                            inputProps={NteeInputProps}
                                            renderSuggestionsContainer={renderNteeSuggestionsContainer}
                                        />
                                    </div>
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                            <button 
                                className="bg-[#A9DFD8] text-black font-semibold py-2 px-4 rounded hover:bg-[#88B3AE] transition-colors duration-300"
                                onClick={handleSearch}
                            >
                                SEARCH
                            </button>
                            </div>
                            {hasSearched && (
                                <div ref={searchResultsRef} className="flex-col mt-10 bg-[#21222D] p-4 rounded-lg shadow-md mx-40 w-screen max-w-7xl">
                                    {currentResults.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-7 gap-4 mb-4 font-semibold text-sm text-center">
                                                <div>NONPROFIT NAME</div>
                                                <div>ADDRESS</div>
                                                <div>CITY</div>
                                                <div>STATE</div>
                                                <div>ZIP</div>
                                                <div>LAST RECORDED REV.</div>
                                                <div>LAST RECORDED EXP.</div>
                                            </div>
                                            <div className="flex flex-col justify-between overflow-x-auto" style={{ maxHeight: '400px' }}>
                                                <div>
                                                    {currentResults.map((result, index) => (
                                                        <div key={index} className="grid grid-cols-7 gap-4 text-sm mb-2 text-center">
                                                            <div>
                                                                <a 
                                                                    href="#"
                                                                    onClick={() => handleNonprofitClick(result._id)}
                                                                    className="text-[#A9DFD8] hover:underline font-semibold"
                                                                >
                                                                    {capitalizeFirstLetter(result.Name)}
                                                                </a>
                                                            </div>
                                                            <div>123 some street </div>
                                                            <div>{capitalizeFirstLetter(result.City)}</div>
                                                            <div>{result.State}</div>
                                                            <div>{result.Zipcode}</div>
                                                            <div>{formatNumber(result.annualRevenue)}</div>
                                                            <div>{formatNumber(result.annualExpenses)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-white text-lg flex items-center justify-center">No search results found.</div>
                                    )}
                                    <div className="flex justify-center mt-4">
                                        {renderPaginationControls()}
                                    </div>
                                </div>
                            )}

                        </div>
                        </div>

                </div>
            </div>
        </div>
    );
}

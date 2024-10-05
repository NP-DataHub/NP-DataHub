"use client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardNavbar from "../components/dashboardNav";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import cities from "../components/cities";
import ntee_codes from "../components/ntee";
import { useRouter } from 'next/navigation';
import NewsFeedSection from "../components/newsfeed";

import dynamic from 'next/dynamic';
const ChoroplethMap = dynamic(() => import('../components/map'), { ssr: false });

export default function Toolbox() {
    const [selectedSection, setSelectedSection] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [city, setCity] = useState('');
    const [nonProfit2, setNonProfit2] = useState('');
    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : cities.filter(
            city => city.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

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
    return(
        <div>
            <div className = "flex dashboard-color text-white font-sans">
                <Sidebar currentPage = '/toolbox'/>
                <div className = "flex-col w-screen">
                    <DashboardNavbar/>
                    <div className = "flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans" >
                        <h1 className = "text-2xl font-semibold">NON PROFIT TOOLBOX LIBRARY</h1>
                        <span className = "text-sm text-[#A0A0A0]">Choose from one of eight analytical tools for stronger insights.</span>
                        <div className="grid grid-cols-4 gap-4 mt-12">
                            <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Fiscal Health" ? "bg-[#34344c]" : "bg-[#171821]"
                                    }`}
                                    onClick={() => setSelectedSection("Fiscal Health")}>
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6.02589L11.452 6.53789C11.5222 6.61298 11.607 6.67285 11.7013 6.71378C11.7956 6.75471 11.8972 6.77584 12 6.77584C12.1028 6.77584 12.2044 6.75471 12.2987 6.71378C12.393 6.67285 12.4778 6.61298 12.548 6.53789L12 6.02589ZM9.434 19.2479C7.984 18.0719 6.292 16.5289 4.968 14.8399C3.629 13.1329 2.75 11.3799 2.75 9.76989H1.25C1.25 11.8869 2.38 13.9719 3.787 15.7659C5.209 17.5789 6.997 19.2019 8.489 20.4129L9.434 19.2479ZM2.75 9.76989C2.75 6.86489 4.018 5.06989 5.586 4.45489C7.151 3.84189 9.34 4.27989 11.452 6.53789L12.548 5.51389C10.16 2.95989 7.349 2.15389 5.039 3.05789C2.732 3.96189 1.25 6.44389 1.25 9.76989H2.75ZM15.51 20.4119C17.003 19.2009 18.791 17.5779 20.213 15.7649C21.62 13.9709 22.75 11.8859 22.75 9.76789H21.25C21.25 11.3799 20.37 13.1319 19.032 14.8389C17.708 16.5279 16.016 18.0709 14.566 19.2469L15.51 20.4119ZM22.75 9.76789C22.75 6.44289 21.268 3.96089 18.96 3.05789C16.65 2.15289 13.84 2.95789 11.452 5.51289L12.548 6.53789C14.66 4.27989 16.849 3.84089 18.414 4.45389C19.982 5.06789 21.25 6.86389 21.25 9.76789H22.75ZM8.489 20.4129C9.759 21.4449 10.642 22.2019 12 22.2019V20.7019C11.277 20.7019 10.827 20.3779 9.434 19.2479L8.489 20.4129ZM14.566 19.2469C13.173 20.3769 12.723 20.7019 12 20.7019V22.2019C13.358 22.2019 14.241 21.4449 15.511 20.4129L14.566 19.2469Z" fill="#FEB95A"/>
                                    <path d="M18.5 9.45189H16.5M16.5 9.45189H14.5M16.5 9.45189V7.45189M16.5 9.45189V11.4519" stroke="#FEB95A" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                                

                                <h2 className="text-xl font-semibold mb-2">FISCAL HEALTH</h2>
                                <p className="text-sm text-[#FEB95A]">Assess a nonprofit{"’"}s fiscal health based on a weighted score of various data variables. Compare the scores side-by-side with other nonproifts.</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Region Health" ? "bg-[#34344c]" : "bg-[#171821]"
                                }`}
                                onClick={() => setSelectedSection("Region Health")}
                                >

                                    <svg className = "mb-4" width="36" height="39" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.6897 19.0367L7.93192 12.318C7.15315 11.3985 6.65164 10.2767 6.48579 9.08319C6.31994 7.8897 6.49657 6.67366 6.99513 5.57668C7.49368 4.4797 8.29363 3.54693 9.30181 2.88702C10.31 2.2271 11.4849 1.86719 12.6897 1.84921C14.3598 1.86572 15.9553 2.54343 17.1268 3.73391C18.2982 4.9244 18.9501 6.53061 18.9397 8.20078C18.9404 9.65776 18.4443 11.0714 17.5335 12.2086L12.6897 19.0367ZM12.6897 3.41171C11.4334 3.42614 10.2341 3.93857 9.35521 4.83648C8.47634 5.7344 7.98973 6.94439 8.00223 8.20078C8.00814 9.34739 8.42062 10.4547 9.16629 11.3258L12.6897 16.318L16.3069 11.2242C16.9945 10.366 17.3717 9.30046 17.3772 8.20078C17.3897 6.94439 16.9031 5.7344 16.0243 4.83648C15.1454 3.93857 13.9461 3.42614 12.6897 3.41171Z" fill="#A9DFD8"/>
                                    <path d="M12.6897 8.88046C13.5527 8.88046 14.2522 8.18091 14.2522 7.31796C14.2522 6.45502 13.5527 5.75546 12.6897 5.75546C11.8268 5.75546 11.1272 6.45502 11.1272 7.31796C11.1272 8.18091 11.8268 8.88046 12.6897 8.88046Z" fill="#A9DFD8"/>
                                    <path d="M22.0647 9.66171H20.5022V11.2242H22.0647V22.1617H3.31473V11.2242H4.87723V9.66171H3.31473C2.90033 9.66171 2.5029 9.82633 2.20988 10.1194C1.91685 10.4124 1.75223 10.8098 1.75223 11.2242V22.1617C1.75223 22.5761 1.91685 22.9735 2.20988 23.2666C2.5029 23.5596 2.90033 23.7242 3.31473 23.7242H22.0647C22.4791 23.7242 22.8766 23.5596 23.1696 23.2666C23.4626 22.9735 23.6272 22.5761 23.6272 22.1617V11.2242C23.6272 10.8098 23.4626 10.4124 23.1696 10.1194C22.8766 9.82633 22.4791 9.66171 22.0647 9.66171Z" fill="#A9DFD8"/>
                                </svg>



                                <h2 className="text-xl font-semibold mb-2">REGION HEALTH</h2>
                                <p className = "text-sm text-[#A9DFD8]">Compare NTEE code sectors against public data that align with various regional non-profit{"'"}s missions.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1349_1533)">
                                    <path d="M22.6453 6.06772C21.3623 4.06772 19.5053 2.39772 17.3753 1.54772L16.7453 1.33472C16.0489 1.11907 15.3244 1.00753 14.5953 1.00372C12.2883 1.01372 10.4203 2.92372 10.4203 5.27872C10.4176 6.21743 10.7221 7.13127 11.2873 7.88072L11.0273 7.53872C11.1513 7.72472 11.2873 7.90872 11.4443 8.09472C12.1073 8.89672 13.0483 9.72972 14.2663 10.6747C17.2653 12.9947 19.2093 15.0527 19.3703 17.6047C19.4083 17.9487 19.4323 18.3007 19.4323 18.6557C19.4323 19.9527 19.1493 21.3257 18.6683 22.2907H18.6733C18.6733 22.2907 18.4663 22.6677 18.5963 22.7777C18.6623 22.8347 18.8063 22.8777 19.0563 22.7247C20.3989 21.8507 21.5546 20.7188 22.4563 19.3947C23.7867 17.4351 24.5127 15.1281 24.5443 12.7597C24.5797 10.3912 23.9191 8.06431 22.6443 6.06772H22.6453ZM13.5493 14.7857L11.6713 13.2357C7.73733 10.3657 5.69133 7.26972 6.81233 3.45272C6.91519 3.10694 7.03874 2.76766 7.18233 2.43672V2.43272C7.18233 2.43272 7.46033 1.84972 6.85533 2.13772C5.04091 3.12335 3.50968 4.55798 2.40807 6.30441C1.30646 8.05085 0.671297 10.0507 0.563327 12.1127C0.421359 14.7439 1.1422 17.3496 2.61633 19.5337C3.21126 20.369 3.93887 21.1014 4.77033 21.7017H4.76633C8.91433 24.7547 12.4723 23.1477 12.4723 23.1477H12.4753C13.3573 22.775 14.1093 22.1495 14.6364 21.3501C15.1635 20.5508 15.4422 19.6132 15.4373 18.6557C15.441 17.9089 15.2725 17.1712 14.9449 16.5001C14.6173 15.8289 14.1394 15.2423 13.5483 14.7857H13.5493Z" fill="#F2C8ED"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_1349_1533">
                                    <rect width="24" height="24" fill="white" transform="translate(0.546326 0.286713)"/>
                                    </clipPath>
                                    </defs>
                                </svg>


                                <h2 className="text-xl font-semibold mb-2">SIMILARITY SCORES</h2>
                                <p className = "text-sm text-[#F2C8ED]">Use large language models similar to ChatGPT to compare to other missions of comparable non-profits.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_dd_1349_1542)">
                                    <g clip-path="url(#clip0_1349_1542)">
                                    <path d="M20.5585 2.99321L20.5452 4.24321C21.3135 4.25171 22.0812 4.38046 22.81 4.62321L23.205 3.43721C22.3511 3.15307 21.4583 3.00328 20.5585 2.99321ZM19.2172 3.08121C18.3274 3.20833 17.4623 3.47131 16.6522 3.86096L17.1947 4.98746C17.8895 4.65351 18.6314 4.42806 19.3945 4.31896L19.2172 3.08121ZM24.4442 3.95871L23.8735 5.07046C24.5594 5.42206 25.1873 5.87686 25.7352 6.41896L26.6157 5.53171C25.9767 4.89923 25.2444 4.36871 24.4442 3.95871ZM12.9452 5.06796C8.12022 5.06796 4.19522 8.99296 4.19522 13.818C4.19522 18.643 8.12022 22.568 12.9452 22.568C15.1787 22.568 17.217 21.7245 18.764 20.342C18.7652 20.342 18.7665 20.342 18.7675 20.3425C18.7837 20.3277 18.7992 20.3122 18.8152 20.2975L18.8465 20.2687C19.0619 20.0712 19.2673 19.8629 19.4617 19.6447C19.4825 19.6217 19.5035 19.599 19.5237 19.5757C19.6235 19.462 19.7212 19.346 19.815 19.2272C19.6945 19.2172 19.5747 19.2042 19.456 19.1885C19.3765 19.1782 19.298 19.165 19.2192 19.152C19.1797 19.1455 19.1402 19.1405 19.101 19.1335C18.9852 19.1126 18.8699 19.089 18.7552 19.0627C18.6561 19.0396 18.5575 19.0146 18.4595 18.9875C18.4432 18.983 18.427 18.9792 18.411 18.9747C15.2537 18.0907 12.9452 15.1995 12.9452 11.7555C12.9434 10.7253 13.1547 9.70583 13.5659 8.76125C13.9771 7.81667 14.5792 6.96736 15.3345 6.26671C15.375 6.22896 15.4155 6.19121 15.457 6.15421C15.5192 6.09921 15.583 6.04521 15.647 5.99171C15.6865 5.95896 15.7252 5.92521 15.7655 5.89321C15.8692 5.81021 15.9747 5.72921 16.083 5.65196C15.8476 5.56127 15.6085 5.48078 15.3662 5.41071L15.3587 5.40871C15.287 5.38821 15.2145 5.36996 15.142 5.35121C15.0882 5.33721 15.0345 5.32171 14.9805 5.30871C14.8932 5.28771 14.8052 5.26996 14.7172 5.25146C14.6857 5.24496 14.6547 5.23721 14.623 5.23096L14.6225 5.23146C14.07 5.12286 13.5083 5.0681 12.9452 5.06796ZM27.4952 6.54996L26.4882 7.29171C26.9451 7.91226 27.3036 8.59949 27.5512 9.32921L28.7352 8.92771C28.4466 8.07609 28.0283 7.27408 27.4952 6.54996ZM29.0687 10.2292L27.8377 10.4467C27.9717 11.204 27.9885 11.983 27.8862 12.7442L29.125 12.9107C29.245 12.0202 29.225 11.1132 29.0687 10.2292ZM27.6452 13.8712C27.4253 14.6102 27.0934 15.3112 26.6612 15.9497L27.697 16.65C28.2008 15.9054 28.5875 15.088 28.8435 14.2262L27.6452 13.8712ZM25.9445 16.8532C25.4205 17.4175 24.8122 17.8971 24.1412 18.275L24.754 19.3645C25.5381 18.9229 26.2489 18.3623 26.861 17.7027L25.9445 16.8532ZM23.096 18.7627C22.3743 19.0341 21.6153 19.1932 20.8455 19.2345L20.9117 20.4825C21.8095 20.4347 22.6947 20.2493 23.5362 19.9327L23.096 18.7627Z" fill="#20AEF3"/>
                                    </g>

                                    </g>
                                    <defs>
                                    <filter id="filter0_dd_1349_1542" x="0.195221" y="0.286713" width="34.1952" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="4"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1349_1542"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="4"/>
                                    <feGaussianBlur stdDeviation="2"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                    <feBlend mode="normal" in2="effect1_dropShadow_1349_1542" result="effect2_dropShadow_1349_1542"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1349_1542" result="shape"/>
                                    </filter>
                                    <clipPath id="clip0_1349_1542">
                                    <rect width="25" height="25" fill="white" transform="translate(4.19522 0.286713)"/>
                                    </clipPath>
                                    </defs>
                                </svg>


                                <h2 className="text-xl font-semibold mb-2">DISPARITIES</h2>
                                <p className = "text-sm text-[#20AEF3]">Which non-profits outperform others based 
                                on region across 
                                key variables.</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "News Feed" ? "bg-[#34344c]" : "bg-[#171821]"
                                }`}
                                onClick={() => setSelectedSection("News Feed")}
                                >

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.10466 22.9153C5.50882 22.9153 4.99893 22.7033 4.57499 22.2794C4.15104 21.8554 3.93871 21.3452 3.93799 20.7486V5.58195C3.93799 4.98612 4.15032 4.47623 4.57499 4.05228C4.99966 3.62834 5.50954 3.41601 6.10466 3.41528H18.0213L23.438 8.83195V20.7486C23.438 21.3444 23.226 21.8547 22.8021 22.2794C22.3781 22.704 21.8679 22.916 21.2713 22.9153H6.10466ZM6.10466 20.7486H21.2713V9.91528H16.938V5.58195H6.10466V20.7486ZM8.27132 18.582H19.1047V16.4153H8.27132V18.582ZM8.27132 9.91528H13.688V7.74862H8.27132V9.91528ZM8.27132 14.2486H19.1047V12.082H8.27132V14.2486Z" fill="#FEB95A"/>
                                </svg>
                                

                                <h2 className="text-xl font-semibold mb-2">NEWS FEEDS</h2>
                                <p className="text-sm text-[#FEB95A]">A tool to understanding larger scale problems and connecting to regional nonprofits via social media and search engines.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1349_1562)">
                                    <path d="M5.1202 25.17C6.95076 27 9.89798 27 15.7896 27C21.6827 27 24.6285 27 26.4591 25.1687C28.2896 23.34 28.2896 20.3925 28.2896 14.5C28.2896 8.6075 28.2896 5.66125 26.4591 3.83C24.6285 2 21.6813 2 15.7896 2C9.89659 2 6.95076 2 5.1202 3.83C3.28965 5.6625 3.28965 8.6075 3.28965 14.5C3.28965 20.3925 3.28965 23.34 5.1202 25.17Z" stroke="#A9DFD8" stroke-width="1.5"/>
                                    <path d="M8.8452 9.5C8.8452 8.91875 8.8452 8.62875 8.91604 8.39C9.01075 8.07233 9.19664 7.78268 9.45505 7.55011C9.71346 7.31754 10.0353 7.15024 10.3883 7.065C10.6563 7 10.9785 7 11.623 7H19.9563C20.6021 7 20.9244 7 21.1896 7.06375C21.5426 7.14899 21.8644 7.31629 22.1229 7.54886C22.3813 7.78143 22.5672 8.07108 22.6619 8.38875C22.7341 8.63 22.7341 8.92 22.7341 9.5C22.7341 10.08 22.7341 10.3712 22.6633 10.61C22.5685 10.9277 22.3827 11.2173 22.1242 11.4499C21.8658 11.6825 21.544 11.8498 21.191 11.935C20.9244 12 20.6008 12 19.9563 12H11.623C10.9771 12 10.6549 12 10.3896 11.9363C10.0367 11.851 9.71485 11.6837 9.45644 11.4511C9.19803 11.2186 9.01214 10.9289 8.91743 10.6112C8.8452 10.37 8.8452 10.08 8.8452 9.5Z" stroke="#A9DFD8" stroke-width="1.5"/>
                                    <path d="M11.123 15.75C11.123 16.116 10.7759 16.5 10.2341 16.5C9.69232 16.5 9.3452 16.116 9.3452 15.75C9.3452 15.384 9.69232 15 10.2341 15C10.7759 15 11.123 15.384 11.123 15.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    <path d="M11.123 20.75C11.123 21.116 10.7759 21.5 10.2341 21.5C9.69232 21.5 9.3452 21.116 9.3452 20.75C9.3452 20.384 9.69232 20 10.2341 20C10.7759 20 11.123 20.384 11.123 20.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    <path d="M16.6785 15.75C16.6785 16.116 16.3314 16.5 15.7896 16.5C15.2479 16.5 14.9008 16.116 14.9008 15.75C14.9008 15.384 15.2479 15 15.7896 15C16.3314 15 16.6785 15.384 16.6785 15.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    <path d="M16.6785 20.75C16.6785 21.116 16.3314 21.5 15.7896 21.5C15.2479 21.5 14.9008 21.116 14.9008 20.75C14.9008 20.384 15.2479 20 15.7896 20C16.3314 20 16.6785 20.384 16.6785 20.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    <path d="M22.2341 15.75C22.2341 16.116 21.887 16.5 21.3452 16.5C20.8034 16.5 20.4563 16.116 20.4563 15.75C20.4563 15.384 20.8034 15 21.3452 15C21.887 15 22.2341 15.384 22.2341 15.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    <path d="M22.2341 20.75C22.2341 21.116 21.887 21.5 21.3452 21.5C20.8034 21.5 20.4563 21.116 20.4563 20.75C20.4563 20.384 20.8034 20 21.3452 20C21.887 20 22.2341 20.384 22.2341 20.75Z" fill="#A9DFA8" stroke="#A9DFD8"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_1349_1562">
                                    <rect width="24" height="24" fill="white" transform="translate(0.289646)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                

                                <h2 className="text-xl font-semibold mb-2">CALCULATOR</h2>
                                <p className = "text-sm text-[#A9DFD8]">Estimate and budget growth of sectors based on percentages and fiscal variables.</p>
                            </div>
                            <div
                                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    selectedSection === "Co:Lab" ? "bg-[#34344c]" : "bg-[#171821]"
                                }`}
                                onClick={() => setSelectedSection("Co:Lab")}
                                >

                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.6875 15.4063V14.625H2.125V15.4063C2.125 16.8567 2.70117 18.2477 3.72676 19.2732C4.75235 20.2988 6.14335 20.875 7.59375 20.875H9.9375V19.3125H7.59375C6.55775 19.3125 5.56418 18.901 4.83161 18.1684C4.09905 17.4358 3.6875 16.4423 3.6875 15.4063ZM17.75 7.59375V8.375H19.3125V7.59375C19.3125 6.14335 18.7363 4.75235 17.7107 3.72676C16.6852 2.70117 15.2942 2.125 13.8438 2.125H11.5V3.6875H13.8438C14.3567 3.6875 14.8647 3.78854 15.3386 3.98485C15.8125 4.18115 16.2432 4.46889 16.6059 4.83162C16.9686 5.19434 17.2563 5.62497 17.4527 6.09889C17.649 6.57282 17.75 7.08078 17.75 7.59375ZM7.59375 7.59375H2.90625C2.28465 7.59375 1.68851 7.84068 1.24897 8.28022C0.80943 8.71976 0.5625 9.3159 0.5625 9.9375V11.5H2.125V9.9375C2.125 9.7303 2.20731 9.53159 2.35382 9.38507C2.50034 9.23856 2.69905 9.15625 2.90625 9.15625H7.59375C7.80095 9.15625 7.99966 9.23856 8.14618 9.38507C8.29269 9.53159 8.375 9.7303 8.375 9.9375V11.5H9.9375V9.9375C9.9375 9.3159 9.69057 8.71976 9.25103 8.28022C8.81149 7.84068 8.21535 7.59375 7.59375 7.59375ZM5.25 6.8125C5.86807 6.8125 6.47225 6.62922 6.98616 6.28584C7.50006 5.94246 7.9006 5.45441 8.13712 4.88339C8.37365 4.31237 8.43553 3.68403 8.31495 3.07784C8.19438 2.47165 7.89675 1.91483 7.45971 1.47779C7.02267 1.04075 6.46585 0.743126 5.85966 0.622547C5.25347 0.501969 4.62513 0.563854 4.05411 0.800378C3.4831 1.0369 2.99504 1.43744 2.65166 1.95134C2.30828 2.46525 2.125 3.06943 2.125 3.6875C2.125 4.5163 2.45424 5.31116 3.04029 5.89721C3.62634 6.48326 4.4212 6.8125 5.25 6.8125ZM5.25 2.125C5.55903 2.125 5.86113 2.21664 6.11808 2.38833C6.37503 2.56002 6.5753 2.80405 6.69356 3.08956C6.81182 3.37507 6.84277 3.68923 6.78248 3.99233C6.72219 4.29543 6.57337 4.57384 6.35485 4.79236C6.13633 5.01088 5.85792 5.15969 5.55483 5.21998C5.25173 5.28027 4.93757 5.24933 4.65206 5.13106C4.36655 5.0128 4.12252 4.81253 3.95083 4.55558C3.77914 4.29863 3.6875 3.99653 3.6875 3.6875C3.6875 3.2731 3.85212 2.87567 4.14515 2.58265C4.43817 2.28962 4.8356 2.125 5.25 2.125ZM20.0938 18.5313H15.4062C14.7846 18.5313 14.1885 18.7782 13.749 19.2177C13.3094 19.6573 13.0625 20.2534 13.0625 20.875V22.4375H14.625V20.875C14.625 20.6678 14.7073 20.4691 14.8538 20.3226C15.0003 20.1761 15.199 20.0938 15.4062 20.0938H20.0938C20.301 20.0938 20.4997 20.1761 20.6462 20.3226C20.7927 20.4691 20.875 20.6678 20.875 20.875V22.4375H22.4375V20.875C22.4375 20.2534 22.1906 19.6573 21.751 19.2177C21.3115 18.7782 20.7154 18.5313 20.0938 18.5313ZM14.625 14.625C14.625 15.2431 14.8083 15.8473 15.1517 16.3612C15.495 16.8751 15.9831 17.2756 16.5541 17.5121C17.1251 17.7486 17.7535 17.8105 18.3597 17.69C18.9658 17.5694 19.5227 17.2717 19.9597 16.8347C20.3967 16.3977 20.6944 15.8408 20.815 15.2347C20.9355 14.6285 20.8736 14.0001 20.6371 13.4291C20.4006 12.8581 20.0001 12.37 19.4862 12.0267C18.9723 11.6833 18.3681 11.5 17.75 11.5C16.9212 11.5 16.1263 11.8292 15.5403 12.4153C14.9542 13.0013 14.625 13.7962 14.625 14.625ZM19.3125 14.625C19.3125 14.934 19.2209 15.2361 19.0492 15.4931C18.8775 15.75 18.6335 15.9503 18.3479 16.0686C18.0624 16.1868 17.7483 16.2178 17.4452 16.1575C17.1421 16.0972 16.8637 15.9484 16.6451 15.7299C16.4266 15.5113 16.2778 15.2329 16.2175 14.9298C16.1572 14.6267 16.1882 14.3126 16.3064 14.0271C16.4247 13.7415 16.625 13.4975 16.8819 13.3258C17.1389 13.1541 17.441 13.0625 17.75 13.0625C18.1644 13.0625 18.5618 13.2271 18.8549 13.5201C19.1479 13.8132 19.3125 14.2106 19.3125 14.625Z" fill="#F2C8ED"/>
                                </svg>

                                <h2 className="text-xl font-semibold mb-2">CO:LAB</h2>
                                <p className = "text-sm text-[#F2C8ED]">Search and compare nonprofits from other sectors in your backyard that may be strong partners.</p>
                            </div>
                            <div className="bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <svg className = "mb-4" width="36" height="39" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.75 6.25C6.75 5.58696 7.01339 4.95107 7.48223 4.48223C7.95107 4.01339 8.58696 3.75 9.25 3.75C9.91304 3.75 10.5489 4.01339 11.0178 4.48223C11.4866 4.95107 11.75 5.58696 11.75 6.25C11.75 6.91304 11.4866 7.54893 11.0178 8.01777C10.5489 8.48661 9.91304 8.75 9.25 8.75C8.58696 8.75 7.95107 8.48661 7.48223 8.01777C7.01339 7.54893 6.75 6.91304 6.75 6.25ZM9.25 5C8.91848 5 8.60054 5.1317 8.36612 5.36612C8.1317 5.60054 8 5.91848 8 6.25C8 6.58152 8.1317 6.89946 8.36612 7.13388C8.60054 7.3683 8.91848 7.5 9.25 7.5C9.58152 7.5 9.89946 7.3683 10.1339 7.13388C10.3683 6.89946 10.5 6.58152 10.5 6.25C10.5 5.91848 10.3683 5.60054 10.1339 5.36612C9.89946 5.1317 9.58152 5 9.25 5ZM2.375 0C1.87772 0 1.40081 0.197544 1.04917 0.549175C0.697544 0.900805 0.5 1.37772 0.5 1.875V10.625C0.5 11.1223 0.697544 11.5992 1.04917 11.9508C1.40081 12.3025 1.87772 12.5 2.375 12.5H16.125C16.6223 12.5 17.0992 12.3025 17.4508 11.9508C17.8025 11.5992 18 11.1223 18 10.625V1.875C18 1.37772 17.8025 0.900805 17.4508 0.549175C17.0992 0.197544 16.6223 0 16.125 0H2.375ZM1.75 1.875C1.75 1.70924 1.81585 1.55027 1.93306 1.43306C2.05027 1.31585 2.20924 1.25 2.375 1.25H4.25V2.5C4.25 2.83152 4.1183 3.14946 3.88388 3.38388C3.64946 3.6183 3.33152 3.75 3 3.75H1.75V1.875ZM1.75 5H3C3.66304 5 4.29893 4.73661 4.76777 4.26777C5.23661 3.79893 5.5 3.16304 5.5 2.5V1.25H13V2.5C13 3.16304 13.2634 3.79893 13.7322 4.26777C14.2011 4.73661 14.837 5 15.5 5H16.75V7.5H15.5C14.837 7.5 14.2011 7.76339 13.7322 8.23223C13.2634 8.70107 13 9.33696 13 10V11.25H5.5V10C5.5 9.33696 5.23661 8.70107 4.76777 8.23223C4.29893 7.76339 3.66304 7.5 3 7.5H1.75V5ZM14.25 1.25H16.125C16.2908 1.25 16.4497 1.31585 16.5669 1.43306C16.6842 1.55027 16.75 1.70924 16.75 1.875V3.75H15.5C15.1685 3.75 14.8505 3.6183 14.6161 3.38388C14.3817 3.14946 14.25 2.83152 14.25 2.5V1.25ZM16.75 8.75V10.625C16.75 10.7908 16.6842 10.9497 16.5669 11.0669C16.4497 11.1842 16.2908 11.25 16.125 11.25H14.25V10C14.25 9.66848 14.3817 9.35054 14.6161 9.11612C14.8505 8.8817 15.1685 8.75 15.5 8.75H16.75ZM4.25 11.25H2.375C2.20924 11.25 2.05027 11.1842 1.93306 11.0669C1.81585 10.9497 1.75 10.7908 1.75 10.625V8.75H3C3.33152 8.75 3.64946 8.8817 3.88388 9.11612C4.1183 9.35054 4.25 9.66848 4.25 10V11.25ZM19.25 10.625C19.25 11.4538 18.9208 12.2487 18.3347 12.8347C17.7487 13.4208 16.9538 13.75 16.125 13.75H3.10625C3.23555 14.1157 3.4751 14.4323 3.79189 14.6562C4.10867 14.8801 4.48709 15.0002 4.875 15H16.125C17.2853 15 18.3981 14.5391 19.2186 13.7186C20.0391 12.8981 20.5 11.7853 20.5 10.625V4.375C20.5002 3.98709 20.3801 3.60867 20.1562 3.29189C19.9323 2.9751 19.6157 2.73555 19.25 2.60625V10.625Z" fill="#20AEF3"/>
                                </svg>
                                
                                <h2 className="text-xl font-semibold mb-2">PAY + PURPOSE</h2>
                                <p className = "text-sm text-[#20AEF3]">Search from a host of other variables and compare where others stand regionally in the same or different sectors.</p>
                            </div>
                        </div>
                        <div className="mt-12">
                            {selectedSection === "Fiscal Health" && (
                                <div className="p-6 bg-[#171821] rounded-lg">
                                <h3 className="text-xl font-semibold text-[#FEB95A]">
                                    FISCAL HEALTH: SINGLE NONPROFIT
                                </h3>
                                <p className="text-white mt-2">
                                    Assess a nonprofit’s fiscal health based on a weighted score of various data variables. 
                                    Compare the scores side-by-side with other nonprofits.
                                </p>
                                <div className="mt-12 text-sm">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            SEARCH FOR A NONPROFIT
                                        </button>
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            COMPARE AGAINST ANOTHER NONPROFIT
                                        </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            <Autosuggest
                                                suggestions={suggestions}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                getSuggestionValue={getSuggestionValue}
                                                renderSuggestion={renderSuggestion}
                                                inputProps={inputProps}
                                                renderSuggestionsContainer={renderSuggestionsContainer}
                                            />
                                        </button>
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                                            getSuggestionValue={getSuggestionValue}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={inputProps2}
                                            renderSuggestionsContainer={renderSuggestionsContainer}
                                        />
                                        </button>
                                        </div>
                                        <div className="flex justify-center mb-6">
                                        <button className="px-8 py-4 bg-green-500 rounded-full text-white font-bold hover:bg-green-400 transition-colors mt-8 mb-4">
                                            CALCULATE
                                        </button>
                                        </div>
                                        <div className="flex justify-around">
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
                                            4.1
                                            </div>
                                            <span className="mt-2 text-gray-300">Nonprofit 1</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-orange-500">
                                            5.7
                                            </div>
                                            <span className="mt-2 text-gray-300">Nonprofit 2</span>
                                        </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mt-12">
                                    ANALYSIS
                                    </h3>
                                    <p className="text-white mt-2">
                                        Compared over an aggregate weighted score from three years, which included increases or decreases revenues, expenses, assets, and liabilities, the nonprofit on the right is healthier fiscally. This may be for a host of variables, so the recommendation is to explore each nonprofit’s financial data. 
                                    </p>
                                    <h3 className="text-xl font-semibold text-[#FEB95A] mt-12">
                                    FISCAL HEALTH: AGAINST LOCAL + NATIONAL SECTORS
                                    </h3>
                                    <p className="text-white mt-2">
                                    Assess a nonprofit’s fiscal health based on a weighted score of various data variables. 
                                    Compare the scores side-by-side with the same or other sectors.
                                    </p>
                                    <div className="mt-12 text-sm">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors"> 
                                            SEARCH FOR A NONPROFIT
                                        </div>
                                        <div className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            COMPARE AGAINST ANOTHER NONPROFIT
                                        </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            <Autosuggest
                                                suggestions={suggestions}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                getSuggestionValue={getSuggestionValue}
                                                renderSuggestion={renderSuggestion}
                                                inputProps={inputProps}
                                                renderSuggestionsContainer={renderSuggestionsContainer}
                                            />
                                        </button>
                                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                            <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                                            getSuggestionValue={getSuggestionValue}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={inputProps2}
                                            renderSuggestionsContainer={renderSuggestionsContainer}
                                        />
                                        </button>
                                        </div>
                                        <div className="flex justify-center mb-6 items-center">
                                        <button className="px-8 py-4 bg-green-500 rounded-full text-white font-bold hover:bg-green-400 transition-colors mt-8 mb-4  ">
                                            CALCULATE
                                        </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
                                            4.1
                                            </div>
                                            <span className="mt-2 text-gray-300">PRIMARY NONPROFIT</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
                                            4.9
                                            </div>
                                            <span className="mt-2 text-gray-300">REGIONAL</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-orange-500">
                                            5.7
                                            </div>
                                            <span className="mt-2 text-gray-300">NATIONAL</span>
                                        </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mt-12">
                                        ANALYSIS
                                        </h3>
                                        <p className="text-white mt-2">

                                        Compared over an aggregate weighted score from three years, which included increases or decreases revenues, expenses, assets, and liabilities, the nonprofit is healthier than the regional sector ecosystem but not as healthy as the national sector ecosystem. 

                                        This may be favorable when positioning your nonprofit against other nonprofits within your region when exploring grant or funding opportunities on a state level or with a local philanthropy.

                                        However, when exploring  grant or funding opportunities with a national or global philanthropy, the nonprofit may be at a disadvantage against a more competitive pool of nonprofits that may be fiscally healthier.                                        </p>
                                </div>
                                
                            )}
                            {selectedSection === "Region Health" && (
                                <div className="p-6 bg-[#171821] rounded-lg">
                                <h3 className="text-xl font-semibold text-[#A9DFD8]">
                                    REGIONAL HEALTH BY SECTOR                                
                                </h3>
                                <p className="text-white">
                                    Compare NTEE code sectors against public data that align with various regional non-profit’s missions. The public data is pulled from the U.S. Census, which offers the strongest baseline across a host of demographic variables.
                                </p>
                                <div className="mt-12 text-sm">

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                SEARCH FOR A NONPROFIT
                                            </button>
                                            <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                SEARCH BY ZIPCODE
                                            </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                            <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                <Autosuggest
                                                    suggestions={suggestions}
                                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                    getSuggestionValue={getSuggestionValue}
                                                    renderSuggestion={renderSuggestion}
                                                    inputProps={inputProps}
                                                    renderSuggestionsContainer={renderSuggestionsContainer}
                                                />
                                            </button>
                                            <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                <Autosuggest
                                                suggestions={suggestions}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                getSuggestionValue={getSuggestionValue}
                                                renderSuggestion={renderSuggestion}
                                                inputProps={inputProps2}
                                                renderSuggestionsContainer={renderSuggestionsContainer}
                                            />
                                            </button>
                                </div>
                                <div className="overflow-x-auto overflow-auto">
                                    <table className="min-w-full bg-[#21222D] rounded-lg text-white">
                                        <thead>
                                        <tr>
                                            <th className="py-3 px-6 text-left">NONPROFIT</th>
                                            <th className="py-3 px-6 text-left">ADDRESS</th>
                                            <th className="py-3 px-6 text-left">ZIP CODE</th>
                                            <th className="py-3 px-6 text-left">NTEE CODE</th>
                                            <th className="py-3 px-6 text-left">REVS</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((row, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                            <td className="py-3 px-6">{row.nonprofit}</td>
                                            <td className="py-3 px-6">{row.address}</td>
                                            <td className="py-3 px-6">{row.zip}</td>
                                            <td className="py-3 px-6">{row.nteeCode}</td>
                                            <td className="py-3 px-6">{row.revs}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mt-12">
                                    KEY DEMOGRAPHIC DATA
                                </h3>
                                <p className="text-white mt-2">
                                    With your choice of NTEE code K: Food, Agriculture, and Nutrition, the following demographic variables from the U.S. Census are included in the report below
                                </p>
                                <div className="grid grid-cols-4 gap-4 mb-6 mt-12 text-md">
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center font-bold text-green-500">
                                            AGE
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-blue-300">
                                            RACE
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-blue-500">
                                            GENDER
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-red-500">
                                            EDUCATION
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mt-2">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-orange-500">
                                            INCOME
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mt-2">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-purple-500">
                                            HOUSING
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mt-2">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-gray-500">
                                            HEALTH
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mt-2">
                                            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-pink-500">
                                            FAMILY
                                            </div>
                                        </div>
                                        </div>
                                    <h3 className="text-xl font-semibold mt-12">
                                        INTERACTIVE MAP
                                    </h3>
                                    <p className="text-white mt-2">                
                                        Choose which demographic variable to search below. Then hover over the map for detailed tool tip of the key demographic data from the zip code that aligns with your chosen nonprofit sector.
                                    </p>
                                    <div className="grid grid-cols-4 gap-4 p-4 mt-2 text-sm max-w-3xl mx-auto mb-4">
                                        <button className="bg-green-500 text-white py-2 px-4 rounded-full">
                                            AGE
                                        </button>
                                        <button className="bg-blue-400 text-white py-2 px-4 rounded-full">
                                            RACE
                                        </button>
                                        <button className="bg-blue-800 text-white py-2 px-4 rounded-full">
                                            GENDER
                                        </button>
                                        <button className="bg-red-700 text-white py-2 px-4 rounded-full">
                                            EDUCATION
                                        </button>
                                        <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
                                            INCOME
                                        </button>
                                        <button className="bg-purple-600 text-white py-2 px-4 rounded-full">
                                            HOUSING
                                        </button>
                                        <button className="bg-gray-500 text-white py-2 px-4 rounded-full">
                                            HEALTH
                                        </button>
                                        <button className="bg-pink-500 text-white py-2 px-4 rounded-full">
                                            FAMILY
                                        </button>
                                        </div>
                                    <div className = 'rounded-lg'>
                                        <ChoroplethMap/>
                                    </div>
                                </div>
                            )}
                            {selectedSection === "Co:Lab" && (
                                <div className="p-6 bg-[#171821] rounded-lg">
                                <h3 className="text-xl font-semibold text-[#F2C8ED]">
                                    CO : LAB TOOL
                                </h3>
                                <p className="text-white">
                                    Search and compare nonprofits from other sectors in your backyard that may be strong partners.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
                                    <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                    SEARCH FOR A NONPROFIT
                                                </button>
                                                <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                    SEARCH BY ZIPCODE
                                    </button>
                                </div>

                                
                                <div className="overflow-x-auto overflow-auto mt-12">
                                    <table className="min-w-full bg-[#21222D] rounded-lg text-white">
                                        <thead>
                                        <tr>
                                            <th className="py-3 px-6 text-left">NONPROFIT</th>
                                            <th className="py-3 px-6 text-left">ADDRESS</th>
                                            <th className="py-3 px-6 text-left">ZIP CODE</th>
                                            <th className="py-3 px-6 text-left">NTEE CODE</th>
                                            <th className="py-3 px-6 text-left">REVS</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data2.map((row, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                            <td className="py-3 px-6">{row.nonprofit}</td>
                                            <td className="py-3 px-6">{row.address}</td>
                                            <td className="py-3 px-6">{row.zip}</td>
                                            <td className="py-3 px-6">{row.nteeCode}</td>
                                            <td className="py-3 px-6">{row.revs}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>   

                                <div className="grid grid-cols-2 gap-4 mb-6 mt-12">
                                    <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                    SEARCH FOR A NONPROFIT
                                                </button>
                                                <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                                                    SEARCH BY ZIPCODE
                                    </button>
                                </div>

                                <div className="overflow-x-auto overflow-auto mt-4">
                                    <table className="min-w-full bg-[#21222D] rounded-lg text-white">
                                        <thead>
                                        <tr>
                                            <th className="py-3 px-6 text-left">NONPROFIT</th>
                                            <th className="py-3 px-6 text-left">ADDRESS</th>
                                            <th className="py-3 px-6 text-left">ZIP CODE</th>
                                            <th className="py-3 px-6 text-left">NTEE CODE</th>
                                            <th className="py-3 px-6 text-left">COMPARE</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((row, index) => (
                                            <tr key={index} className="border-t border-gray-700 rounded-lg">
                                            <td className="py-3 px-6">{row.nonprofit}</td>
                                            <td className="py-3 px-6">{row.address}</td>
                                            <td className="py-3 px-6">{row.zip}</td>
                                            <td className="py-3 px-6">{row.nteeCode}</td>
                                            <td className="py-3 px-6 bg-green-500">COMPARE</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 mt-12">
                                    <div className="grid grid-cols-4 gap-4 items-center text-white font-semibold mb-4">
                                        <div className="text-center bg-green-500 py-2 px-4 rounded-lg">VARIABLE</div>
                                        <div className="text-center bg-blue-500 py-2 px-4 rounded-lg">SHELTER, INC.</div>
                                        <div className="text-center bg-orange-500 py-2 px-4 rounded-lg">FOOD, INC.</div>
                                        <div className="text-center bg-green-500 py-2 px-4 rounded-lg">SCORE</div>
                                    </div>
                                    {data3.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-4 items-center text-white mb-4 ">
                                            <div className="text-center bg-green-500 py-2 px-4 rounded-lg">{item.variable}</div>
                                            <div className={`text-center bg-blue-500 py-2 px-4 rounded-lg ${item.score === '' ? 'col-span-2' : ''}`}>{item.shelter}</div>
                                            {item.score === '' ? null : (
                                            <div className="text-center bg-orange-500 py-2 px-4 rounded-lg">{item.food}</div>
                                            )}
                                            {item.score === null ? null : (
                                            <div className={`flex items-center justify-center py-2 px-4 rounded-full ${item.scoreColor} text-2xl`}>
                                                {item.score}
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                        <div className="grid grid-cols-4 gap-4 items-center text-white mb-4 ">
                                            <div className = "text-center bg-green-500 py-2 px-4 rounded-lg col-span-3">
                                                POTENTIAL FISCAL COLLABORATOR SCORE
                                            </div>
                                            <div className = 'flex items-center justify-center py-2 px-4 rounded-full text-2xl bg-red-500'>
                                                49%
                                            </div>
                                        </div>
                                        

                                    </div>
                                </div>
                            )}
                            {selectedSection === "News Feed" && (
                                <NewsFeedSection></NewsFeedSection>
                                // <div className="p-6 bg-[#171821] rounded-lg">
                                // <h3 className="text-xl font-semibold text-[#FEB95A]">
                                //     News Feeds
                                // </h3>
                                // <p className="text-white">
                                //     A tool to understanding larger scale problems and connecting to regional nonprofits via social media and search engines.
                                // </p>
                                // <div className="grid grid-cols-2 gap-4 p-4 mt-12">
                                //     <button className="flex items-center justify-center bg-[#34344c] text-white py-2 px-4 rounded-full">
                                //         <span className="mr-2">🔍</span>
                                //         SEARCH
                                //     </button>
                                //     <button className="flex items-center justify-center bg-[#34344c] text-white py-2 px-4 rounded-full">
                                //         <span className="mr-2">🔎</span>
                                //         ADVANCED SEARCH
                                //     </button>
                                //     </div>
                                //     <div className="mt-12">
                                //     <SocialMediaMentions
                                //         query="#nonprofits OR #Notforprofit OR #NonprofitsofInstagram OR #Supportnonprofits OR #Nonprofitorganizations"
                                //         limit={25} // You can adjust the limit
                                //         period="last7days" // You can adjust the period as needed
                                //     />
                                //     </div>
                                // </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

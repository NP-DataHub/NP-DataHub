/*
    This is the COLAB component. It shows a graph of nonprofits in an area, and shows the "similarity" between them in a table on the right.
    Let me know if you see anything messed up with the code.

    - Emmet Whitehead
*/


'use client';

import Select from 'react-select';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useState, useEffect, useCallback, useMemo } from 'react';
import '@/app/globals.css';
import Autosuggest from "react-autosuggest/dist/Autosuggest";
import cities from "@/app/components/cities";
import ntee_codes from "@/app/components/ntee";
import COLABGraph from '@/app/components/charts/COLABGraph';
import COLABTable from './charts/COLABTable';



export default function COLAB() {


    // Data, selection state vars
    const [areaData, setareaData] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [zipCode, setZipCode] = useState('');
    const [nonprofit, setNonprofit] = useState('');
    const [nonprofitData, setNonprofitData] = useState([0]);

    // Is there data state var for loading div
    const [dataIsLoading, setDataIsLoading] = useState(false);
    


    


    // WIP FIX THIS CRAP
    const onZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };

    const onNonprofitChange = (event) => {
        setNonprofit(event.target.value);
    };

     // This is all for the city autosuggest. Dont ask me to explain it I barely understand it :)
     const [citySuggestions, setCitySuggestions] = useState([]);
     const [inputCityValue, setInputCityValue] = useState(null);
 
     const getCitySuggestions = value => {
         const inputValue = value.trim().toLowerCase();
         const inputLength = inputValue.length;
         return inputLength === 0 ? [] : cities.filter(
             city => city.toLowerCase().slice(0, inputLength) === inputValue
         );
     };
 
     const getCitySuggestionValue = suggestion => suggestion.label;
 
     const renderCitySuggestion = suggestion => (
         <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
             {suggestion}
         </div>
     );
 
     const renderCitySuggestionContainer = ({ containerProps, children }) => (
         <div {...containerProps} className={`absolute top-full left-0 w-full max-h-96 bg-[#171821] overflow-x-auto rounded z-10 mt-3 ${citySuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
             {children}
         </div>
     );
 
     const onCitySuggestionsFetchRequested = ({ value }) => {
         setCitySuggestions(getCitySuggestions(value));
     };
 
     const onCitySuggestionsClearRequested = () => {
         setCitySuggestions([]);
     };
 
     const onCityChange = (event, { newValue }) => {
         setInputCityValue(newValue);
         if (newValue === '') {
             setSelectedCity(null); // Reset selected city when input is cleared
         }
     };
 
     const onCitySuggestionSelected = (event, { suggestion }) => {
         setSelectedCity({ value: suggestion, label: suggestion });
         setInputCityValue(suggestion);
     };
 
     const CityInputProps = {
         placeholder: 'Enter City',
         value: inputCityValue ? inputCityValue : '',
         onChange: onCityChange,
         className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
     };

    
    // Handle the click event on a nonprofit from the colab graph component
    const handleNonprofitClick = useCallback((clickedNonprofit) => {
        console.log("clicked on nonprofit:", clickedNonprofit.Nm);
        setNonprofit(clickedNonprofit.Nm);
        setNonprofitData(clickedNonprofit);
        setZipCode(clickedNonprofit.Zip); // Use clickedNonprofit directly
    }, []);




     const handleSearch = () => {
        const fetchData = async () => {

            setDataIsLoading(true);

            // If the user has entered a city/zip code, search for nonprofits in that area
            if (selectedCity || zipCode) {

                // Set defaults so that we don't blow up the API
                const CITY = selectedCity ? selectedCity.value : null;
                const ZIP = zipCode ? zipCode : null;

                // Make sure the search is not too broad. Require at least a city or zip code
                if (!CITY && !ZIP) {
                    return;
                }

                // Fetch the data
                let response = await fetch(`/api/sector?Cty=${CITY}&Zip=${ZIP}`);
                let fetched_data = await response.json();
                setareaData(fetched_data.data);

            } else if (nonprofit) {
                // If the user has entered a nonprofit name, fetch nonprofits in the same area (city or zip code)
                const NAME = nonprofit;

                // Fetch the data
                let response = await fetch(`/api/sector?Nm=${NAME}`);
                let nonprofitData = await response.json();
                setNonprofitData(nonprofitData);

                // Get the area data for the selected nonprofit
                if (nonprofitData !== null) {
                    // Extract the city and zip code of the selected nonprofit
                    const CITY = nonprofitData.data[0].Cty;
                    const ZIP = nonprofitData.data[0].Zip;

                    // Set the area data with the city and zip code of the selected nonprofit
                    let response = await fetch(`/api/sector?Cty=${CITY}&Zip=${ZIP}`);
                    let fetched_data = await response.json();

                    setareaData(fetched_data.data);

                } else { // L bozo
                    console.error("No data found for the given nonprofit name");
                }

            }

            setDataIsLoading(false);

        };
        fetchData();
    };




    // Loading component to show while data is being fetched
    const SearchLoadingComponent = () => (
        <div className="flex items-center justify-center h-full w-full">
            <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );






    return (

    <div className="flex flex-col h-full p-6 bg-[#171821] rounded-lg">
        <h3 className="text-xl font-semibold text-[#F2C8ED]">CO:LAB</h3>
        <p className="text-white">Placeholder for description and how to use, as well as what it means. Additionally, need to describe how similarity is determined</p>
        <p className="text-white">CURRENT IMPLEMENTATION: user selects city or zip, graph populates with area data and similarity between them. Additionally, the user selects a nonprofit via name that will then be used to populate the table with similarities to the selected nonprofit.</p>
        <div className="flex gap-4 mb-6 mt-4">
            <div className="relative bg-[#ada5c0] p-2 rounded flex items-center" style={{ flex: '0 0 30%' }}>
                <div className='w-full items-center'>
                    <Autosuggest
                        suggestions={citySuggestions}
                        onSuggestionsFetchRequested={onCitySuggestionsFetchRequested}
                        onSuggestionsClearRequested={onCitySuggestionsClearRequested}
                        onSuggestionSelected={onCitySuggestionSelected}
                        getSuggestionValue={getCitySuggestionValue}
                        renderSuggestion={renderCitySuggestion}
                        renderSuggestionsContainer={renderCitySuggestionContainer}
                        inputProps={CityInputProps}
                    />
                </div>
            </div>
            <div className="bg-[#78b6d3] p-2 rounded flex items-center" style={{ flex: '0 0 30%' }}>
                <input
                    type="text"
                    placeholder="Enter ZIP Code"
                    value={zipCode}
                    onChange={onZipCodeChange}
                    className="w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
                />
            </div>
            <div className="bg-[#85bce0] p-2 rounded flex items-center" style={{ flex: '0 0 30%' }}>
                <input
                    type="text"
                    placeholder="Search for Nonprofit"
                    value={nonprofit}
                    onChange={onNonprofitChange}
                    className="w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
                />
            </div>
            <div className="flex-grow flex items-center">
                <button
                    onClick={handleSearch}
                    className="w-full h-full bg-[#A9DFD8] text-black p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#F2C8ED]"
                >
                    Search
                </button>
            </div>
        </div>
        <div className="h-full">
            {dataIsLoading ? (
                <SearchLoadingComponent />
            ) : areaData ? (
                <>
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className='h-full bg-[#21222D] p-4 rounded-lg'>
                            <h2 className="text-center text-3xl">Nonprofit Network</h2>
                            <COLABGraph data={areaData} filters={[]} onNonprofitClick={handleNonprofitClick}/>
                        </div>
                        <div className="h-full bg-[#21222D] p-4 rounded-lg">
                            <h2 className="text-center text-3xl">Similarity Table</h2>
                            <COLABTable nonprofits={areaData} selectedNonprofit={nonprofitData} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="col-span-2 h-full bg-[#21222D] p-4 rounded-lg flex items-center justify-center">
                    <span className="text-center text-3xl text-white">Select a City, Zip Code, or search for a Nonprofit to get started.</span>
                </div>
            )}
        </div>
    </div>

    );

};

/*
    This is the COLAB component. It shows a graph of nonprofits in an area, and shows the "similarity" between them in a table on the right.
    Let me know if you see anything messed up with the code.

    - Emmet Whitehead
*/


'use client';

import Select from 'react-select';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import Autosuggest from "react-autosuggest/dist/Autosuggest";
import cities from "@/app/components/cities";
import ntee_codes from "@/app/components/ntee";
import COLABGraph from '@/app/components/charts/COLABGraph';



const COLAB = () => {


    // Need to decide how users will select data.
    // Let user select a city/town, and then display the nonprofits in that area.
    // Or zip code

    // Or, search for a nonprofit and display similar nonprofits in the area (city and zip code)

    // Data, selection state vars
    const [nonprofitData, setNonprofitData] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [zipCode, setZipCode] = useState('');
    const [nonprofit, setNonprofit] = useState('');

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
         //setSelectedCity({ value: newValue, label: newValue });
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


     const handleSearch = () => {
        const fetchData = async () => {
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
                let response = await fetch(`/api/sector?Cty=${CITY}&ZIP=${ZIP}`);
                let data = await response.json();
                setNonprofitData(data);

        } else if (nonprofit) {
            // If the user has entered a nonprofit name, fetch nonprofits in the same area (city or zip code)

            // Get the city and zip code of the nonprofit

        }

     }

        fetchData();

        console.log("nonprofitData", nonprofitData);



    };
    


    return (

        <div className="p-6 bg-[#171821] rounded-lg">
            <h3 className="text-xl font-semibold text-[#F2C8ED]">CO:LAB</h3>
            <p className="text-white">Placeholder for description</p>
            <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
                <div className="relative bg-[#ada5c0] p-2 rounded">
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
                <div className="bg-[#78b6d3] p-2 rounded">
                    <input
                        type="text"
                        placeholder="Enter ZIP Code"
                        value={zipCode}
                        onChange={onZipCodeChange}
                        className="w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
                    />
                </div>
                <div className="bg-[#85bce0] p-2 rounded">
                    <input
                        type="text"
                        placeholder="Search for Nonprofit"
                        value={nonprofit}
                        onChange={onNonprofitChange}
                        className="w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
                    />
                </div>
            </div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleSearch}
                    className="bg-[#A9DFD8] text-black p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#F2C8ED]"
                >
                    Search
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <COLABGraph data={nonprofitData.data} filters={ [] }/>
                </div>
                <div className="bg-[#21222D] p-4 rounded-lg">
                    <p className="text-white">Placeholder for additional content</p>
                </div>
            </div>
        </div>

    );

};

export default COLAB;
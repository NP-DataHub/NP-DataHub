"use client";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import zipData from './zipcode_data';

const CENSUS_KEY = process.env.CENSUS_KEY;

//request new key tommorow becuase some thing is wrong with api right now
async function getMedianAgeByZip(zipCode) {
    const url = `https://api.census.gov/data/2023/acs/acs5?get=B01002_001E&for=zip%20code%20tabulation%20area:${zipCode}&key=${CENSUS_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        const data = await response.json();

        console.log(data);

        // Check if there's valid data for the median age
        if (data[1] && data[1][0] !== null) {
            const medianAge = data[1][0]; // The median age is in the first position of the second array
            console.log(`The median age for ZIP code ${zipCode} is ${medianAge}.`);
        } else {
            console.log(`No median age data available for ZIP code ${zipCode}.`);
        }
    } catch (error) {
        console.error("Failed to fetch median age:", error);
    }
}

getMedianAgeByZip("11702");


import dynamic from 'next/dynamic';
const ChoroplethMap = dynamic(() => import('../components/map'), { ssr: false });


//Do name and zipcode search
export default function RegionalHealthSection() {
    const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
    const [nonprofitName, setNonprofitName] = useState(""); //The name of the Nonprofit input
    const [lastFetchedNameInput, setLastFetchedNameInput] = useState(''); //The lastFetshcedNameInput
    const [zipSuggestions, setZipSuggestions] = useState([]); //Zip code
    const [zipcode, setZipcode] = useState("");
    const [searchResults, setSearchResults] = useState([]); //Search results
    const [lastYear, setLastYear] = useState("");

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
      

    const fetchSuggestions = async (value, type) => {
        if (value === lastFetchedNameInput) return;
        
        try {
            const response = await fetch(`/api/suggestions?input=${value}&type=${type}`);
            const data = await response.json();
          if (data.success) {
            setNameSuggestions(data.data);
            setLastFetchedNameInput(value); // Update last fetched value for names
          } else {
            setNameSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
    };

    //Name autosuggestions
    const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';
    const renderNameSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
        {suggestion.Nm}
    </div>
    );
    const onNameSuggestionsFetchRequested = ({ value }) => {
        fetchSuggestions(value, 'name');
    };


    //Zip auto Suggestions
    const getZipSuggestionValue = (suggestion) => suggestion.zip || '';
    const renderZipSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
        {suggestion.zip}
    </div>
    );
    const getZipSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : zipData.filter(
            item => 
                item.zip.toLowerCase().slice(0, inputLength) === inputValue
        );
    };


    const onZipSuggestionsFetchRequested = ({ value }) => {
        setZipSuggestions(getZipSuggestions(value));
    };


    const onSuggestionsClearRequested = () => {
        setNameSuggestions([]);
    }

    const handleSearchforNonProfit = async (value) => {
        try {
            const response = await fetch(`/api/regionalHealth?input=${value}&type=name`);
            const data = await response.json();
          if (data.success) {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching Zipcode Serch:", error);
        }
    };

   const handleSearchforZip = async (value) => {
        try {
            const response = await fetch(`/api/regionalHealth?input=${value}&type=zip`);
            const data = await response.json();
          if (data.success) {
            setSearchResults(data.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching Zipcode Serch:", error);
        }
    };

    const getLatestYear = (row) => {
        const yearKeys = Object.keys(row).filter(key => !isNaN(key));


       const lastYear = Math.max(...yearKeys.map(year => parseInt(year))).toString()

        return lastYear;
    };


    return(<div className="p-6 bg-[#171821] rounded-lg">
        <h3 className="text-xl font-semibold text-[#A9DFD8]">
            REGIONAL HEALTH BY SECTOR                                
        </h3>
        <p className="text-white">
            Compare NTEE code sectors against public data that align with various regional non-profit’s missions. The public data is pulled from the U.S. Census, which offers the strongest baseline across a host of demographic variables.
        </p>
        <div className="mt-12 text-sm">

        <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors"
            onClick={() => handleSearchforNonProfit(nonprofitName)}>
                        SEARCH FOR A NONPROFIT
                    </button>
                    <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors"
                    onClick={() => handleSearchforZip(zipcode)}>
                        SEARCH BY ZIPCODE
                    </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
                            <Autosuggest
                                suggestions={nameSuggestions}
                                onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={getNameSuggestionValue}
                                renderSuggestion={renderNameSuggestion}
                                inputProps={{
                                    placeholder: 'Search for Nonprofit',
                                    value: nonprofitName,
                                    onChange: (_, { newValue }) => setNonprofitName(newValue),
                                    className: 'mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]',
                                }}
                                renderSuggestionsContainer={({ containerProps, children }) => (
                                    <div {...containerProps}  className={`top-0 left-0 right-0 bottom-full
                                     w-full max-h-96 bg-[#171821] overflow-y-auto rounded z-50 ${nameSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
                                        {children}
                                    </div>
                                )}
                            />
                        </button>
                    <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors ">
                        {<Autosuggest
                                suggestions={zipSuggestions}
                                onSuggestionsFetchRequested={onZipSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={getZipSuggestionValue}
                                renderSuggestion={renderZipSuggestion}
                                inputProps = {{
                                    placeholder: 'Enter Zipcode',
                                    value: zipcode,
                                    onChange: (_, { newValue }) => setZipcode(newValue),
                                    className: "mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]"
                                }}
                                renderSuggestionsContainer={({ containerProps, children }) => (
                                    <div 
                                        {...containerProps} 
                                        className = {`top-0 left-0 right-0 w-full max-h-96 bg-[#171821] overflow-y-auto rounded z-10 ${zipSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
                                        {children}
                                    </div>
                                )}
                            />}
                    </button>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-auto">
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
                {searchResults.map((row, index) => {
                    return (
                        <tr key={index} className="border-t border-gray-700">
                        <td className="py-3 px-6">{row.Nm}</td>
                        <td className="py-3 px-6">{row.Addr}</td>
                        <td className="py-3 px-6">{row.Zip}</td>
                        <td className="py-3 px-6">{row.MajGrp}</td>
                        <td className="py-3 px-6">{row[getLatestYear(row)].TotRev}</td>
                        </tr>
                    );
                })}
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
        </div>)
};
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import zipData from './zipcode_data';
import dynamic from 'next/dynamic';
import { get, set } from 'mongoose';
const ChoroplethMap = dynamic(() => import('../components/map'), { ssr: false });

const CENSUS_KEY = process.env.NEXT_PUBLIC_CENSUS_API_KEY;


//Do name and zipcode search
export default function RegionalHealthSection() {
    const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
    const [nonprofitName, setNonprofitName] = useState(""); //The name of the Nonprofit input
    const [lastFetchedNameInput, setLastFetchedNameInput] = useState(''); //The lastFetshcedNameInput
    const [zipSuggestions, setZipSuggestions] = useState([]); //Zip code
    const [zipcode, setZipcode] = useState("");
    const [searchResults, setSearchResults] = useState([]); //Search results
    const [medAge, setmedAge]= useState("AGE"); //Median Age
    const [majRace, setmajRace] = useState("RACE");
    const [majGender, setmajGender] = useState("GENDER");
    const [avgEdu, setavgEdu] = useState("EDUCATION");
    const [medIncome, setmedIncome] = useState("INCOME");
    const [percHousing, setpercHousing] = useState("HOUSING");
    const [percHealth, setpercHealth] = useState("HEALTH");
    const [sizeFamily, setsizeFamily] = useState("FAMILY");



    //order of groups goes Median Age, Median Income, Percent housing units occumpied, Percent with health insurance covereage,
    // Average household size, Percent EDU < 9th grade, Percent EDU 9-12 no diploma, Percent EDU HS grad, Percent EDU some college, 
    //Percent EDU Associates, Percent EDU Bachelors, Percent Graduate/Professional, Percent Male pop, Percent female pop,
    //Percent White, Percent Black/African American, Percent Native American/Alaskan Native, Percent Asian, Percent Pacific Islander, 
    // Percent some other race, Percent two or more races
    const getZipInfo = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP05_0018E,DP03_0062E,DP04_0002PE,DP03_0096PE,DP02_0016E,DP02_0060PE,DP02_0061PE,DP02_0062PE,DP02_0063PE,DP02_0064PE,DP02_0065PE,DP02_0066PE,DP05_0002PE,DP05_0003PE,DP05_0037PE,DP05_0038PE,DP05_0039PE,DP05_0044PE,DP05_0052PE,DP05_0057PE,DP05_0058PE&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            setmedAge("Median Age:\n"+data[1][0]);
            setmedIncome("Median Income: "+data[1][1]);
            setpercHousing("Housing Occupied:\n"+data[1][2]+"%");
            setpercHealth("Percent with Health Insurance:\n"+data[1][3]+"%");
            setsizeFamily("Average Household Size:\n"+data[1][4]);

            const lessThan9 = parseFloat(data[1][5]);
            const nineTo12 = parseFloat(data[1][6]);
            const hsGrad = parseFloat(data[1][7]);
            const someCollege = parseFloat(data[1][8]);
            const associates = parseFloat(data[1][9]);
            const bachelors = parseFloat(data[1][10]);
            const gradProf = parseFloat(data[1][11]);

            const edu = Math.max(lessThan9, nineTo12, hsGrad, someCollege, associates, bachelors, gradProf);

            if (edu === lessThan9) setavgEdu("Avg. Education:\nPercent with Less than 9th Grade:\n"+data[1][5]+"%");
            else if (edu === nineTo12) setavgEdu("Avg. Eduction:\nPercent with 9-12th Grade:\n"+data[1][6]+"%");
            else if (edu === hsGrad) setavgEdu("Avg. Education:\nPercent with HS Grad:\n"+data[1][7]+"%");
            else if (edu === someCollege) setavgEdu("Avg. Education:\nPercent with Some College:\n"+data[1][8]+"%");
            else if (edu === associates) setavgEdu("Avg. Education:\nPercent with Associates:\n"+data[1][9]+"%");
            else if (edu === bachelors) setavgEdu("Avg. Education:\nPercent with Bachelors:\n"+data[1][10]+"%");
            else setavgEdu("Avg. Education:\nPercent with Graduate/Professional:\n"+data[1][11]+"%");

            const male = parseFloat(data[1][12]);
            const female = parseFloat(data[1][13]);

            const gender = Math.max(male, female);

            if (gender === male) setmajGender("Majority Male:\n"+data[1][12]+"%");
            else setmajGender("Majority Female:\n"+data[1][13]+"%");

            const white = parseFloat(data[1][14]);
            const black = parseFloat(data[1][15]);
            const native = parseFloat(data[1][16]);
            const asian = parseFloat(data[1][17]);
            const pacific = parseFloat(data[1][18]);
            const other = parseFloat(data[1][19]);
            const twoOrMore = parseFloat(data[1][20]);

            const race = Math.max(white, black, native, asian, pacific, other, twoOrMore);

            if (race === white) setmajRace("Majority White:\n"+data[1][14]+"%");
            else if (race === black) setmajRace("Majority Black/African American:\n"+data[1][15]+"%");
            else if (race === native) setmajRace("Majority Native American/Alaskan Native:\n"+data[1][16]+"%");
            else if (race === asian) setmajRace("Majority Asian:\n"+data[1][17]+"%");
            else if (race === pacific) setmajRace("Majority Pacific Islander:\n"+data[1][18]+"%"); 
            else if (race === other) setmajRace("Majority Some Other Race:\n"+data[1][19]+"%");
            else setmajRace("Majority Two or More:\n"+data[1][20]+"%");

        } catch (error) {
            console.error("Failed to fetch Zip Code Data:", error);
        }
    }

      

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
            getZipInfo(data.data[0].Zip);
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
            getZipInfo(value);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching Zipcode Serch:", error);
        }
    };

    const getLatestYear = (row) => {
        const yearKeys = Object.keys(row).filter(key => !isNaN(key));
        const latestYear = Math.max(...yearKeys.map(year => parseInt(year))).toString();
        return latestYear;
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
                    {medAge}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-blue-300">
                    {majRace}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-blue-500">
                    {majGender}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-red-500">
                    {avgEdu}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-orange-500">
                    {medIncome}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-purple-500">
                    {percHousing}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-gray-500">
                    {percHealth}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                    <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center  font-bold text-pink-500">
                    {sizeFamily}
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
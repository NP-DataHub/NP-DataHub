"use client";
import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import zipData from './zipcode_data';
import dynamic from 'next/dynamic';
import debounce from 'lodash.debounce';
import { useCallback } from "react";
const Map2 = dynamic(() => import('../components/map2'), { ssr: false});

const CENSUS_KEY = process.env.NEXT_PUBLIC_CENSUS_API_KEY;

export default function RegionalHealthSection({isDarkMode}) {
    const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
    const [nonprofitName, setNonprofitName] = useState(""); //The name of the Nonprofit input
    const [lastFetchedNameInput, setLastFetchedNameInput] = useState(''); //The lastFetshcedNameInput
    const [zipSuggestions, setZipSuggestions] = useState([]); //Zip code
    const [zipcode, setZipcode] = useState("");
    const [lat, setLat] = useState(39.8097343);
    const [lng, setLng] = useState(-98.5556199);
    const [zoom, setZoom] = useState(4);
    const [searchResults, setSearchResults] = useState([]); //Search results
    const [medAge, setmedAge]= useState("AGE"); //Median Age
    const [majRace, setmajRace] = useState("RACE");
    const [majGender, setmajGender] = useState("GENDER");
    const [avgEdu, setavgEdu] = useState("EDUCATION");
    const [medIncome, setmedIncome] = useState("INCOME");
    const [percHousing, setpercHousing] = useState("HOUSING");
    const [percHealth, setpercHealth] = useState("HEALTH");
    const [sizeFamily, setsizeFamily] = useState("FAMILY");
    const [points, setPoints] = useState([]); // Points for the map


    //order of groups goes Median Age, Median Income, Percent housing units occumpied, Percent with health insurance covereage,
    // Average household size, Percent EDU Bachelors or higher, Percent Male pop, Percent female pop,
    //Percent White, Percent Black/African American, Percent Native American/Alaskan Native, Percent Asian, Percent Pacific Islander, 
    // Percent some other race, Percent two or more races
    //Check for hispanic and latino
    const getZipInfo = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP05_0018E,DP03_0062E,DP04_0002PE,DP03_0096PE,DP02_0016E,DP02_0068PE,DP05_0002PE,DP05_0003PE,DP05_0037PE,DP05_0038PE,DP05_0039PE,DP05_0044PE,DP05_0052PE,DP05_0057PE,DP05_0058PE&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;

        try {

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            // Find the latitude and longitude for the zip code
            const zipInfo = zipData.find(item => item.zip === zip);
            if (zipInfo) {
                setLat(zipInfo.latitude);
                setLng(zipInfo.longitude);
                setZoom(14); // Set zoom level
            }

            setmedAge("Median Age:\n"+data[1][0]);
            setmedIncome("Median Income: "+data[1][1]);
            setpercHousing("Housing Occupied:\n"+data[1][2]+"%");
            setpercHealth("Health Coverage:\n"+data[1][3]+"%");
            setsizeFamily("Average Household Size:\n"+data[1][4]);

            const bachelors = parseFloat(data[1][5]);

            setavgEdu("Bachelors or Higher:\n"+data[1][5]+"%");

            const male = parseFloat(data[1][6]);
            const female = parseFloat(data[1][7]);

            const gender = Math.max(male, female);

            if (gender === male) setmajGender("Majority Male:\n"+data[1][6]+"%");
            else setmajGender("Majority Female:\n"+data[1][7]+"%");

            const white = parseFloat(data[1][8]);
            const black = parseFloat(data[1][9]);
            const native = parseFloat(data[1][10]);
            const asian = parseFloat(data[1][11]);
            const pacific = parseFloat(data[1][12]);
            const other = parseFloat(data[1][13]);
            const twoOrMore = parseFloat(data[1][14]);


            const race = Math.max(white, black, native, asian, pacific, other, twoOrMore);

            if (race === white) setmajRace("Majority White:\n"+data[1][8]+"%");
            else if (race === black) setmajRace("Majority Black/African American:\n"+data[1][9]+"%");
            else if (race === native) setmajRace("Majority Native American/Alaskan Native:\n"+data[1][10]+"%");
            else if (race === asian) setmajRace("Majority Asian:\n"+data[1][11]+"%");
            else if (race === pacific) setmajRace("Majority Pacific Islander:\n"+data[1][12]+"%"); 
            else if (race === other) setmajRace("Majority Some Other Race:\n"+data[1][13]+"%");
            else setmajRace("Majority Two or More:\n"+data[1][14]+"%");

            setPoints([]);

        } catch (error) {
            console.error("Failed to fetch Zip Code Data:", error);
        }
    }

      
    //Name autosuggestions
    const fetchSuggestions = useCallback( debounce(async (value, type) => {
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
    }, 250), // 250 ms delay
    [lastFetchedNameInput]);

    const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';
    const renderNameSuggestion = (suggestion) => {
        return (
          <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
          
            {suggestion.Nm}
          </div>
        );
      };
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

    //Nonprofit Search
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


    //zipcode search
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

    //Under 5, 5-9, 10-14, 15-19, 20-24, 25-34, 35-44, 45-54, 55-59, 60-64, 65-74, 75-84, 85 and over
    const handleAgeButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP05_0005E,DP05_0006E,DP05_0007E,DP05_0008E,DP05_0009E,DP05_0010E,DP05_0011E,DP05_0012E,DP05_0013E,DP05_0014E,DP05_0015E,DP05_0016E,DP05_0017E,DP05_0018E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const zerotonineteen = parseInt(data[1][0])+parseInt(data[1][1])+parseInt(data[1][2])+parseInt(data[1][3]);
            const twentytothirtyfour = parseInt(data[1][4])+parseInt(data[1][5]);
            const thirtyfivetofiftyfour = parseInt(data[1][6])+parseInt(data[1][7]);
            const fiftyfivetosixtyfour = parseInt(data[1][8])+ parseInt(data[1][9]);
            const sixtyfiveplus = parseInt(data[1][10])+parseInt(data[1][11])+parseInt(data[1][12]);
            const Median = parseInt(data[1][13]);

            setPoints([{label: 'Under 19', val: zerotonineteen}, {label: '20-34', val: twentytothirtyfour}, {label: '35-54', val: thirtyfivetofiftyfour}, {label: '55-64', val: fiftyfivetosixtyfour}, {label: '65+', val: sixtyfiveplus}, {label: 'Median', val: Median}]);

        } catch (error) {
            console.error("Failed to fetch Age Data:", error);
        }
    };

    //White, Black, American Indian/ Alaska Native, Asian, Native Hawaiian/ Pacific Islander, Other race, Two or more, hispanic
    const handleRaceButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP05_0037E,DP05_0038E,DP05_0039E,DP05_0040E,DP05_0052E,DP05_0057E,DP05_0058E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const white = parseInt(data[1][0]);
            const black = parseInt(data[1][1]);
            const native = parseInt(data[1][2]);
            const asian = parseInt(data[1][3]);
            const pacific = parseInt(data[1][4]);
            const other = parseInt(data[1][5]);
            const twoOrMore = parseInt(data[1][6]);

            setPoints([{label: 'White', val: white}, {label: 'African American', val: black}, {label: 'Native American/Alaskian', val: native}, {label: 'Asian', val: asian}, {label: 'Native Hawaiian/Pacific Islander', val: pacific}, {label: 'Other', val: other}, {label: 'Two or More', val: twoOrMore}]);

        } catch (error) {
            console.error("Failed to fetch Race Data:", error);
        }
    };

     //Male, Female
     const handleGenderButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP05_0002E,DP05_0003E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const male = parseInt(data[1][0]);
            const female = parseInt(data[1][1]);

            setPoints([{label: 'Male', val: male}, {label: 'Female', val: female}]);

        } catch (error) {
            console.error("Failed to fetch Gender Data:", error);
        }
    };

    //less than 9, 9-12, High School, Some College, Assiciates, Bachelors, Graduate
    const handleEduButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP02_0060E,DP02_0061E,DP02_0062E,DP02_0063E,DP02_0064E,DP02_0065E,DP02_0066E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const lessthan9 = parseInt(data[1][0]);
            const nineto12 = parseInt(data[1][1]);
            const highSchool = parseInt(data[1][2]);
            const someCollege = parseInt(data[1][3]);
            const associates = parseInt(data[1][4]);
            const bachelors = parseInt(data[1][5]);
            const graduate = parseInt(data[1][6]);

            setPoints([{label: 'Less than 9th', val: lessthan9}, {label: 'Some Highschool', val: nineto12}, {label: 'High School', val: highSchool}, {label: 'Some College', val: someCollege}, {label: 'Associates', val: associates}, {label: 'Bachelors', val: bachelors}, {label: 'Graduate', val: graduate}]);

        } catch (error) {
            console.error("Failed to fetch Gender Data:", error);
        }
    };

     //less than 10,000, 10,000-14,999, 15,000-24,999, 25,000-34,999, 35,000-49,999, 50,000-74,999, 75,000-99,999, 100,000-149,999, 150,000-199,999, 200,000+
     const handleIncomeButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP03_0052E,DP03_0053E,DP03_0054E,DP03_0055E,DP03_0056E,DP03_0057E,DP03_0058E,DP03_0059E,DP03_0060E,DP03_0061E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const lessthan10 = parseInt(data[1][0]);
            const tento15 = parseInt(data[1][1]);
            const fifteento25 = parseInt(data[1][2]);
            const twentyfiveto35 = parseInt(data[1][3]);
            const thirtyfiveto50 = parseInt(data[1][4]);
            const fiftyto75 = parseInt(data[1][5]);
            const seventyfiveto100 = parseInt(data[1][6]);
            const hundredto150 = parseInt(data[1][7]);
            const hundredfiftyto200 = parseInt(data[1][8]);
            const twohundredplus = parseInt(data[1][9]);

            setPoints([{label: '$0-$9,999', val: lessthan10}, {label: '$10,000-$14,999', val: tento15}, {label: '$15,000-$24,999', val: fifteento25}, {label: '$25,000-$34,999', val: twentyfiveto35}, {label: '$35,000-$49,999', val: thirtyfiveto50}, {label: '$50,000-$74,999', val: fiftyto75}, {label: '$75,000-$99,999', val: seventyfiveto100}, {label: '$100,000-$149,999', val: hundredto150}, {label: '$150,000-$199,999', val: hundredfiftyto200}, {label: '$200,000+', val: twohundredplus}]);

        } catch (error) {
            console.error("Failed to fetch Gender Data:", error);
        }
    };

    //Occupied, Vacant
    const handleHousingButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP04_0002E,DP04_0003E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const occupied = parseInt(data[1][0]);
            const vacant = parseInt(data[1][1]);

            setPoints([{label: 'Occupied', val: occupied}, {label: 'Vacant', val: vacant}]);
        } catch (error) {
            console.error("Failed to fetch Gender Data:", error);
        }
    };

    //Private, Public, None
    const handleHealthButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP03_0097E,DP03_0098E,DP03_0099E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
       
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const Private = parseInt(data[1][0]);
            const Public = parseInt(data[1][1]);
            const none = parseInt(data[1][2]);

            setPoints([{label: 'Private', val: Private}, {label: 'Public', val: Public}, {label: 'None', val: none}]);

        } catch (error) {
            console.error("Failed to fetch Gender Data:", error);
        }
    };

    //Married, Male Single, Female
    const handleFamiliesButtonClick = async (zip) => {
        const url = `https://api.census.gov/data/2022/acs/acs5/profile?get=DP02_0002E,DP02_0006E,DP02_0010E&for=zip%20code%20tabulation%20area:${zip}&key=${CENSUS_KEY}`;
    
        try{
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const data = await response.json();

            const Married = parseInt(data[1][0]);
            const Male = parseInt(data[1][1]);
            const Female = parseInt(data[1][2]);

            setPoints([{label: 'Married Households', val: Married}, {label: "Male Single Households", val: Male}, {label: "Female Single Household", val: Female}]);

        } catch (error) {
            console.error("Failed to fetch Families Data:", error);
        }
    };


    return(<div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#A9DFD8]' : 'text-[#316498]'}`}>REGIONAL HEALTH BY SECTOR</h3>
        <p>
            Compare NTEE code sectors against public data that align with various regional non-profit’s missions. The public data is pulled from the U.S. Census, which offers the strongest baseline across a host of demographic variables.
        </p>
        <div className="mt-12 text-sm">

        <div className="grid grid-cols-3 gap-4 mb-6">
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className={`p-4 ${isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black"} rounded-md  transition-colors col-span-2`}>
                            <div className = 'relative'>
                                <Autosuggest
                                    suggestions={nameSuggestions}
                                    onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={getNameSuggestionValue}
                                    renderSuggestionsContainer={({ containerProps, children }) => (
                                        <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 ${
                                            isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                                        } overflow-y-auto rounded z-10 ${nameSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
                                            {children}
                                        </div>
                                    )}
                                    renderSuggestion={renderNameSuggestion}
                                    inputProps={{
                                    placeholder: 'Search for Nonprofit',
                                    value: nonprofitName,
                                    onChange: (_, { newValue }) => setNonprofitName(newValue),
                                    className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
                                    }}
                                    
                                />
                                </div>
                        </div>
                    <button className={`p-4 ${isDarkMode ? "bg-[#34344c] text-white hover:bg-gray-500" : "bg-[#F1F1F1] text-black hover:bg-gray-200"} rounded-md  transition-colors`}
                    onClick={() => handleSearchforNonProfit(nonprofitName)}>
                        SEARCH FOR A NONPROFIT
                    </button>
                    </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 ${isDarkMode ? "bg-[#34344c] text-white" : "bg-[#F1F1F1] text-black"} rounded-md  transition-colors col-span-2`}>
                        <div className = 'relative'>
                            {<Autosuggest
                                        suggestions={zipSuggestions}
                                        onSuggestionsFetchRequested={onZipSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                                        getSuggestionValue={getZipSuggestionValue}
                                        renderSuggestionsContainer={({ containerProps, children }) => (
                                            <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 ${
                                                isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                                            } overflow-y-auto rounded z-10 ${zipSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
                                                {children}
                                            </div>
                                        )}
                                        renderSuggestion={renderZipSuggestion}
                                        inputProps={{
                                        placeholder: 'Enter Zipcode',
                                        value: zipcode,
                                        onChange: (_, { newValue }) => setZipcode(newValue),
                                        className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
                                        }}
                                    />}
                        </div>
                    </div>
                    <button className={`p-4 ${isDarkMode ? "bg-[#34344c] text-white hover:bg-gray-500" : "bg-[#F1F1F1] text-black hover:bg-gray-200"} rounded-md  transition-colors`}
                    onClick={() => handleSearchforZip(zipcode)}>
                        SEARCH BY ZIPCODE
                    </button>
        </div>
        
        {searchResults.length > 0 && (

                    <div className="overflow-x-auto max-h-96 overflow-auto">
                        <table className={`min-w-full ${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} rounded-lg`}>
                            <thead className="sticky top-0 z-10">
                                <tr>
                                    <th className="py-3 px-6 text-left bg-[#21222D]">NONPROFIT</th>
                                    <th className="py-3 px-6 text-left bg-[#21222D]">ADDRESS</th>
                                    <th className="py-3 px-6 text-left bg-[#21222D]">ZIP CODE</th>
                                    <th className="py-3 px-6 text-left bg-[#21222D]">NTEE CODE</th>
                                    <th className="py-3 px-6 text-left bg-[#21222D]">REVS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((row, index) => {
                                    const nonprofitUrl = `/nonprofit/${encodeURIComponent(row._id)}`;
                                    return (
                                        <tr key={index} className="border-t border-gray-700">
                                            <td className="py-3 px-6">
                                                <a href={nonprofitUrl} className="hover:underline">
                                                    {row.Nm}
                                                </a>
                                            </td>
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
                )}
                </div>
        {/* Add in loading bar while searching have it display in this area*/}
                
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#A9DFD8]' : 'text-[#316498]'}`}>KEY DEMOGRAPHIC DATA</h3>
        <p className="mt-2">
            With your choice of Zipcode, the following demographic variables from the U.S. Census are included in the report below. (However, Not all zipcodes line up with the census data, so if you are not getting a result try a zipcode near the one you are looking for.)
        </p>
        <div className="flex justify-center items-center ">
            <div className="grid grid-cols-4 gap-x-32 gap-y-8 mb-6 mt-12 text-md mx-auto">
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-green-500">
                    {medAge}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-blue-300">
                    {majRace}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-blue-500">
                    {majGender}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-red-500">
                    {avgEdu}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-orange-500">
                    {medIncome}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-purple-500">
                    {percHousing}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-gray-500">
                    {percHealth}
                </div>
                </div>
                <div className="flex flex-col items-center w-32 h-32 p-4 rounded-full bg-gray-300 border-white border-2 shadow-lg justify-center">
                <div className="flex text-center font-bold text-pink-500">
                    {sizeFamily}
                </div>
                </div>
            </div>
            </div>

            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#A9DFD8]' : 'text-[#316498]'}`}>INTERACTIVE MAP</h3>
            <p className="mt-2">                
                Choose which demographic variable to search below. Then hover over the map for detailed tool tip of the key demographic data from the zip code that aligns with your chosen nonprofit sector.
            </p>
            <div className="grid grid-cols-4 gap-4 p-4 mt-2 text-sm max-w-3xl mx-auto mb-4">
                <button className="bg-green-500 text-white py-8 px-16 text-center rounded-full"
                 onClick={() => handleAgeButtonClick(zipcode)}>
                    AGE
                </button>
                <button className="bg-blue-400 text-white py-8 px-16 text-center rounded-full"
                onClick={() => handleRaceButtonClick(zipcode)}>
                    RACE
                </button>
                <button className="bg-blue-800 text-white text-center rounded-full"
                onClick={() => handleGenderButtonClick(zipcode)}>
                    GENDER
                </button>
                <button className="bg-red-700 text-white  text-center rounded-full"
                onClick={() => handleEduButtonClick(zipcode)}>
                    EDUCATION
                </button>
                <button className="bg-yellow-500 text-white rounded-full"
                onClick={() => handleIncomeButtonClick(zipcode)}>
                    INCOME
                </button>
                <button className="bg-purple-600 text-white  rounded-full"
                onClick={() => handleHousingButtonClick(zipcode)}>
                    HOUSING
                </button>
                <button className="bg-gray-500 text-white  text-center rounded-full"
                onClick={() => handleHealthButtonClick(zipcode)}>
                    HEALTH
                </button>
                <button className="bg-pink-500 text-white py-8 px-16 text-center rounded-full"
                onClick={() => handleFamiliesButtonClick(zipcode)}>
                    FAMILY
                </button>
                </div>
            <div className = 'rounded-lg'>
                <Map2 points={points} lat={lat} lng={lng} zoom={zoom}/>
            </div>
        </div>)
};
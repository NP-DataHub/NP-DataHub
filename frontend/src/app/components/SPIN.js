// This is the self contained SPIN (Scatter Plot for Identifying Nonprofits) page code. Its wants to be large, so don't try to put it in a small space.
// - Emmet Whitehead the Actual GOAT


"use client";

import ScatterPlot from "@/app/components/charts/Scatterplot";
import Select from 'react-select';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import Autosuggest from "react-autosuggest/dist/Autosuggest";
import cities from "@/app/components/cities";
import ntee_codes from "@/app/components/ntee";



const SPIN = ({isDarkMode}) => {

    // State variable for data
    const [sectorData, setSectorData] = useState(null);
    const [sectorFilters, setSectorFilters] = useState(null);

    // State variables for filters
    const [selectedState, setSelectedState] =   useState(null);
    const [selectedCity, setSelectedCity] =     useState(null);
    const [selectedZIP, setSelectedZIP] =       useState(null);
    const [selectedNTEE1, setSelectedNTEE1] =   useState(null);
    const [selectedNTEE2, setSelectedNTEE2] =   useState(null);
    const [selectedNTEE3, setSelectedNTEE3] =   useState(null);

    // State variables for selected variable options
    const [selectedXAxis, setSelectedXAxis] = useState({ value: "TotRev", label: "Total Revenue" });
    const [selectedYAxis, setSelectedYAxis] = useState({ value: "TotExp", label: "Total Expenses" });

    // Keep track of loading state
    const [loading, setLoading] = useState(false);

    // List of all states in the US and their abbreviations
    const stateOptions = [
        { value: "", label: "Select State" },
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" }
    ];

    // Currently not used as I felt it made the page a bit more clutered. Can easily be added if we feel its useful.
    const zipOptions = [
        // Add zip options here
    ];

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
        <div {...containerProps} className={`absolute top-full left-0 w-full max-h-96 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} overflow-x-auto rounded z-10 mt-3 ${citySuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
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
        className: `w-full ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]`
    };


    // NTEE autosuggest functions
    const [suggestions, setSuggestions] = useState({ NTEE1: [], NTEE2: [], NTEE3: [] });
    const [inputNTEEValue, setInputNTEEValue] = useState({ NTEE1: '', NTEE2: '', NTEE3: '' });


    const getSuggestions = (value, type) => {
        const inputValue = (value || '').trim().toLowerCase();
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

    const getSuggestionValue = suggestion => suggestion.code;

    const renderSuggestion = suggestion => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
            {suggestion.code} - {suggestion.description}
        </div>
    );

    const renderSuggestionsContainer = ({ containerProps, children, type }) => (
        <div {...containerProps} className={`absolute top-full left-0 w-full max-h-96  ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} overflow-x-auto rounded z-10 mt-3 ${suggestions[type].length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
            {children}
        </div>
    );

    const onSuggestionsFetchRequested = ({ value }, type) => {
        setSuggestions(prev => ({ ...prev, [type]: getSuggestions(value, type) }));
    };

    const onSuggestionsClearRequested = (type) => {
        setSuggestions(prev => ({ ...prev, [type]: [] }));
    };

    const onNTEEChange = (event, { newValue }, type) => {
        setInputNTEEValue(prev => ({ ...prev, [type]: newValue }));
        if (newValue === '') {
            if (type === 'NTEE1') setSelectedNTEE1(null); // Reset selected NTEE1 when input is cleared
            if (type === 'NTEE2') setSelectedNTEE2(null); // Reset selected NTEE2 when input is cleared
            if (type === 'NTEE3') setSelectedNTEE3(null); // Reset selected NTEE3 when input is cleared
        }
    };

    const onSuggestionSelected = (event, { suggestion }, type) => {
        if (type === 'NTEE1') setSelectedNTEE1({ value: suggestion.code, label: suggestion.description });
        if (type === 'NTEE2') setSelectedNTEE2({ value: suggestion.code, label: suggestion.description });
        if (type === 'NTEE3') setSelectedNTEE3({ value: suggestion.code, label: suggestion.description });
        setInputNTEEValue(prev => ({ ...prev, [type]: `${suggestion.code} - ${suggestion.description}` }));
    };

    const createInputProps = (type, selectedValue) => ({
        placeholder: `Enter ${type} Code or Description`,
        value: inputNTEEValue[type] ? inputNTEEValue[type] : selectedValue ? selectedValue.label : '',
        onChange: (event, { newValue }) => onNTEEChange(event, { newValue }, type),
        className: `w-full ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]`
    });

    // State autosuggest functions
    const [stateSuggestions, setStateSuggestions] = useState([]);
    const [inputStateValue, setInputStateValue] = useState(null);

    const getStateSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : stateOptions.filter(
            state => state.label.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    const getStateSuggestionValue = suggestion => suggestion.label;

    const renderStateSuggestion = suggestion => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
            {suggestion.label}
        </div>
    );

    const renderStateSuggestionContainer = ({ containerProps, children }) => (
        <div {...containerProps} className={`absolute top-full left-0 w-full max-h-96 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} overflow-x-auto rounded z-10 mt-3 ${stateSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`}>
            {children}
        </div>
    );

    const onStateSuggestionsFetchRequested = ({ value }) => {
        setStateSuggestions(getStateSuggestions(value));
    };

    const onStateSuggestionsClearRequested = () => {
        setStateSuggestions([]);
    };

    const onStateChange = (event, { newValue }) => {
        //setSelectedState({ value: newValue, label: newValue });
        setInputStateValue(newValue);
        if (newValue === '') {
            setSelectedState(null); // Reset selected state when input is cleared
        }
    };

    const onStateSuggestionSelected = (event, { suggestion }) => {
        setSelectedState({ value: suggestion.value, label: suggestion.label });
        setInputStateValue(suggestion.label)
    };

    const StateInputProps = {
        placeholder: 'Enter State',
        value: inputStateValue ? inputStateValue : '',
        onChange: onStateChange,
        className: `w-full ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"} p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]`
    };














    // These are the variable options that we have data for (and that it makes sense to plot).
    const varOptions = [
        { value: "TotRev", label: "Total Revenue" },
        { value: "TotExp", label: "Total Expenses" },
        { value: "TotAst", label: "Total Assets" },
        { value: "TotLia", label: "Total Liabilities" },
    ];

    // This fetches data from the backend using whatever filters are selected. This is called upon loading, and whenever a filter is changed.
    // After fetching the data, it sets the sectorData state variable to the fetched data.
    useEffect(() => {
        const fetchSectorData = async () => {
        // We are loading
        setLoading(true);

            // Set a default state so that we arent fetching everything  
        const STATE = selectedState ? selectedState.value : null;
        const CITY = selectedCity ? selectedCity.value : null;
        const ZIP = selectedZIP ? selectedZIP.value : null;
        const NTEE1 = selectedNTEE1 ? selectedNTEE1.value : null;
        const NTEE2 = selectedNTEE2 ? selectedNTEE2.value : null;
        const NTEE3 = selectedNTEE3 ? selectedNTEE3.value : null;

        // Make sure the search is not too broad. Require at least a state 
        if (!STATE) {
            setLoading(false);
            return;
        }

        let response = await fetch(`/api/sector?Cty=${CITY}&St=${STATE}&ZIP=${ZIP}&NTEE1=${NTEE1}&NTEE2=${NTEE2}&NTEE3=${NTEE3}`);
        let filtered_sector_data = await response.json();

        setSectorData(filtered_sector_data);
        // Set the filters to be the selected NTEE filter values
        let filters = { NTEE1, NTEE2, NTEE3 };
        setSectorFilters(filters);

        // We are done loading
        setLoading(false);
        };

        fetchSectorData();
    }, 
    // Only re-fetch data when the selected filters change, not when single chars are changed
    [selectedState, selectedCity, selectedZIP, selectedNTEE1, selectedNTEE2, selectedNTEE3]
    );

    useEffect(() => {
        // Re-render the scatter plot when the X or Y axis is changed
    }, [selectedXAxis, selectedYAxis]);



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
        <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"}  p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mt-10 mx-10 mb-12`}>

            <div className={`mb-4 p-4 ${isDarkMode ? "bg-[#171821] text-white" : "bg-white text-black"} rounded-lg`}>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-base  mb-6">
                    A scatter plot&apos;s purpose is to visually display and statistically test the relationship between two variables, identify relationships, test theories, analyze data, 
                    and find natural fiscal collaborators across a single or multiple NTEE codes within a certain geographical area. 
                    Given that more grantmakers -- private and government -- are requiring multiple nonprofits to partner to find solutions 
                    to more interwoven and complex societal problems, the tool helps identify which nonprofits in a select region are more fiscally 
                    similar.
                </p>
                <h2 className="text-xl font-semibold mb-2">How to Use the Filters</h2>
                <p className="text-base ">
                    First select the state, city, and one NTEE code. Then, choose two variables (revenue, expenses, assets, or liabilities) to compare in the drop down. 
                    For multi-NTEE sectors across a given region, add another NTEE code to your first query with one NTEE code, allowing you to find similar nonprofits in an additional sector. 
                    For more than two, feel free to add one more. However, the inclusion of four NTEE codes drops the significance of like relationships, therefore, we just include three for now. 
                    Please account for longer load times, depending on the size of the geographical area.
                </p>
            </div>
            <div className="grid grid-cols-5 gap-4 mb-4">
            <div className={`col-span-1 p-3 rounded-lg ${isDarkMode ? 'bg-[#6d618c]' : 'bg-[#ada5c0]'}`}>
                <h2 className="text-lg font-semibold mb-4">State Selection</h2>
                <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-[#ada5c0]' : 'bg-[#6d618c]'}`}>
                    <div className="relative w-full">
                        <Autosuggest
                            suggestions={stateSuggestions}
                            onSuggestionsFetchRequested={onStateSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onStateSuggestionsClearRequested}
                            getSuggestionValue={getStateSuggestionValue}
                            renderSuggestion={renderStateSuggestion}
                            renderSuggestionsContainer={renderStateSuggestionContainer}
                            inputProps={StateInputProps}
                            onSuggestionSelected={onStateSuggestionSelected}
                        />
                    </div>
                    <a data-tooltip-id="city-tooltip" className="ml-2 cursor-pointer text-white-400 hover:text-gray-200" data-tooltip-content="Search for states to examine on the plot.">ℹ️</a>
                    <ReactTooltip place="top" effect="solid" id="city-tooltip" />
                </div>
            </div>
        <div className={`col-span-1 p-3 rounded-lg ${isDarkMode ? 'bg-[#255972]' : 'bg-[#78b6d3]'}`}>
            <h2 className="text-lg font-semibold mb-4">City Selection</h2>
            <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-[#78b6d3]' : 'bg-[#255972]'}`}>
                <div className="relative w-full">
                    <Autosuggest
                        suggestions={citySuggestions}
                        onSuggestionsFetchRequested={onCitySuggestionsFetchRequested}
                        onSuggestionsClearRequested={onCitySuggestionsClearRequested}
                        onSuggestionSelected={onCitySuggestionSelected}
                        getSuggestionValue={getCitySuggestionValue}
                        renderSuggestion={renderCitySuggestion}
                        renderSuggestionsContainer={renderCitySuggestionContainer}
                        inputProps={CityInputProps}
                        //onSuggestionSelected={(event, { suggestion }) => setSelectedCity({ value: suggestion, label: suggestion })}
                    />
                </div>
            <a data-tooltip-id="city-tooltip" className="ml-2 cursor-pointer text-white-400 hover:text-gray-200" data-tooltip-content="Search for cities to examine on the plot.">ℹ️</a>
            <ReactTooltip place="top" effect="solid" id="city-tooltip" />
        </div>
    </div>
    <div className={`col-span-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#3184bc]' : 'bg-[#85bce0]'}`}>
    <h2 className="text-lg font-semibold mb-4">NTEE Code Selection</h2>
    <div className="grid grid-cols-3 gap-4">
        <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-[#85bce0]' : 'bg-[#3184bc]'}`}>
                <div className="relative w-full">
                    <Autosuggest
                        suggestions={suggestions.NTEE1}
                        onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'NTEE1')}
                        onSuggestionsClearRequested={() => onSuggestionsClearRequested('NTEE1')}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        renderSuggestionsContainer={(props) => renderSuggestionsContainer({ ...props, type: 'NTEE1' })}
                        inputProps={createInputProps('NTEE1', selectedNTEE1)}
                        onSuggestionSelected={(event, {suggestion}) => onSuggestionSelected(event, {suggestion}, 'NTEE1')}
                    />
                </div>
                <a data-tooltip-id="option1-tooltip" className="ml-2 cursor-pointer text-white-400 hover:text-gray-200" data-tooltip-content="Select the first NTEE code.">ℹ️</a>
                <ReactTooltip place="top" effect="solid" id="option1-tooltip" />
            </div>
            <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-[#85bce0]' : 'bg-[#3184bc]'}`}>
            <div className="relative w-full">
                    <Autosuggest
                        suggestions={suggestions.NTEE2}
                        onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'NTEE2')}
                        onSuggestionsClearRequested={() => onSuggestionsClearRequested('NTEE2')}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        renderSuggestionsContainer={(props) => renderSuggestionsContainer({ ...props, type: 'NTEE2' })}
                        inputProps={createInputProps('NTEE2', selectedNTEE2)}
                        onSuggestionSelected={(event, {suggestion}) => onSuggestionSelected(event, {suggestion}, 'NTEE2')}
                    />
                </div>
                <a data-tooltip-id="option2-tooltip" className="ml-2 cursor-pointer text-white-400 hover:text-gray-200" data-tooltip-content="Select the second NTEE code.">ℹ️</a>
                <ReactTooltip place="top" effect="solid" id="option2-tooltip" />
            </div>
            <div className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'bg-[#85bce0]' : 'bg-[#3184bc]'}`}>
            <div className="relative w-full">
                    <Autosuggest
                        suggestions={suggestions.NTEE3}
                        onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'NTEE3')}
                        onSuggestionsClearRequested={() => onSuggestionsClearRequested('NTEE3')}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        renderSuggestionsContainer={(props) => renderSuggestionsContainer({ ...props, type: 'NTEE3' })}
                        inputProps={createInputProps('NTEE3', selectedNTEE3)}
                        onSuggestionSelected={(event, {suggestion}) => onSuggestionSelected(event, {suggestion}, 'NTEE3')}
                    />
                </div>
                <a data-tooltip-id="option3-tooltip" className="ml-2 cursor-pointer text-white-400 hover:text-gray-200" data-tooltip-content="Select the third NTEE code.">ℹ️</a>
                <ReactTooltip place="top" effect="solid" id="option3-tooltip" />
            </div>
        </div>
    </div>
            </div>
            <div className={`flex justify-between items-center ${isDarkMode ? "bg-[#171821] text-white" : "bg-white text-black"} p-4 rounded-lg mt-4`}>
                <h2 className="text-xl font-semibold">Select Variables to Compare:</h2>
                <div className="flex space-x-4">
                    <Select
                        options={varOptions}
                        value={selectedXAxis}
                        onChange={(option) => setSelectedXAxis(option)}
                        className="text-black"
                    />
                    <Select
                        options={varOptions}
                        value={selectedYAxis}
                        onChange={(option) => setSelectedYAxis(option)}
                        className="text-black"
                    />
                </div>
            </div>
            <div className="flex flex-col h-">
                {loading ? (
                    <div className={`flex justify-center items-center h-screen p-6 rounded-lg ${isDarkMode ? 'bg-[#21222D]' : 'bg-[#f9f9f9]'}`}>
                        <SearchLoadingComponent />
                    </div>
                ) : sectorData ? (
                    <div className="h-full h-screen">
                        <ScatterPlot data={sectorData.data} X_axis_var={selectedXAxis.value} Y_axis_var={selectedYAxis.value} filters={sectorFilters} isDarkMode={isDarkMode} />
                    </div>
                ) : (
                    <div className={`flex justify-center items-center h-screen p-6 rounded-lg ${isDarkMode ? 'bg-[#21222D]' : 'bg-[#f9f9f9]'}`}>
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#171821]' : 'bg-white'}`}>
                            <p>Enter a state and other selections to load data.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

SPIN.displayName = "SPIN";

export default SPIN;
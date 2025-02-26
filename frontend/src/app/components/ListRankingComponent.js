import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import debounce from 'lodash.debounce';
import { useCallback } from "react";
import zipData from './zipcode_data';

export default function ListRanking({isDarkMode}) {


  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [state, setState] = useState('');

  const [nteeCode, setNteeCode] = useState('');

  const [zipSuggestions, setZipSuggestions] = useState([]);
  const [zip, setZip] = useState('');

  const [variable, setVariable] = useState("Revenue");

  const [year, setYear] = useState('');

  const majorGroups = [
    { value: '', label: 'Select Sector' },
    { value: 'A', label: 'A - Arts, Culture, and Humanities' },
    { value: 'B', label: 'B - Educational Institutions and Related Activities' },
    { value: 'C', label: 'C - Environmental Quality, Protection and Beautification' },
    { value: 'D', label: 'D - Animal-Related' },
    { value: 'E', label: 'E - Health – General and Rehabilitative' },
    { value: 'F', label: 'F - Mental Health, Crisis Intervention' },
    { value: 'G', label: 'G - Diseases, Disorders, Medical Disciplines' },
    { value: 'H', label: 'H - Medical Research' },
    { value: 'I', label: 'I - Crime and Legal-Related' },
    { value: 'J', label: 'J - Employment, Job-Related' },
    { value: 'K', label: 'K - Food, Agriculture, and Nutrition' },
    { value: 'L', label: 'L - Housing, Shelter' },
    { value: 'M', label: 'M - Public Safety, Disaster Preparedness, and Relief' },
    { value: 'N', label: 'N - Recreation, Sports, Leisure, Athletics' },
    { value: 'O', label: 'O - Youth Development' },
    { value: 'P', label: 'P - Human Services - Multipurpose and Other' },
    { value: 'Q', label: 'Q - International, Foreign Affairs, and National Security' },
    { value: 'R', label: 'R - Civil Rights, Social Action, Advocacy' },
    { value: 'S', label: 'S - Community Improvement, Capacity Building' },
    { value: 'T', label: 'T - Philanthropy, Voluntarism, and Grantmaking Foundations' },
    { value: 'U', label: 'U - Science and Technology Research Institutes, Services' },
    { value: 'V', label: 'V - Social Science Research Institutes, Services' },
    { value: 'W', label: 'W - Public, Societal Benefit - Multipurpose and Other' },
    { value: 'X', label: 'X - Religion-Related, Spiritual Development' },
    { value: 'Y', label: 'Y - Mutual/Membership Benefit Organizations, Other' },
    { value: 'Z', label: 'Z - Unknown' },
  ];
    const states = [
        { name: 'Alabama', code: 'AL' },
        { name: 'Alaska', code: 'AK' },
        { name: 'Arizona', code: 'AZ' },
        { name: 'Arkansas', code: 'AR' },
        { name: 'California', code: 'CA' },
        { name: 'Colorado', code: 'CO' },
        { name: 'Connecticut', code: 'CT' },
        { name: 'Delaware', code: 'DE' },
        { name: 'Florida', code: 'FL' },
        { name: 'Georgia', code: 'GA' },
        { name: 'Hawaii', code: 'HI' },
        { name: 'Idaho', code: 'ID' },
        { name: 'Illinois', code: 'IL' },
        { name: 'Indiana', code: 'IN' },
        { name: 'Iowa', code: 'IA' },
        { name: 'Kansas', code: 'KS' },
        { name: 'Kentucky', code: 'KY' },
        { name: 'Louisiana', code: 'LA' },
        { name: 'Maine', code: 'ME' },
        { name: 'Maryland', code: 'MD' },
        { name: 'Massachusetts', code: 'MA' },
        { name: 'Michigan', code: 'MI' },
        { name: 'Minnesota', code: 'MN' },
        { name: 'Mississippi', code: 'MS' },
        { name: 'Missouri', code: 'MO' },
        { name: 'Montana', code: 'MT' },
        { name: 'Nebraska', code: 'NE' },
        { name: 'Nevada', code: 'NV' },
        { name: 'New Hampshire', code: 'NH' },
        { name: 'New Jersey', code: 'NJ' },
        { name: 'New Mexico', code: 'NM' },
        { name: 'New York', code: 'NY' },
        { name: 'North Carolina', code: 'NC' },
        { name: 'North Dakota', code: 'ND' },
        { name: 'Ohio', code: 'OH' },
        { name: 'Oklahoma', code: 'OK' },
        { name: 'Oregon', code: 'OR' },
        { name: 'Pennsylvania', code: 'PA' },
        { name: 'Rhode Island', code: 'RI' },
        { name: 'South Carolina', code: 'SC' },
        { name: 'South Dakota', code: 'SD' },
        { name: 'Tennessee', code: 'TN' },
        { name: 'Texas', code: 'TX' },
        { name: 'Utah', code: 'UT' },
        { name: 'Vermont', code: 'VT' },
        { name: 'Virginia', code: 'VA' },
        { name: 'Washington', code: 'WA' },
        { name: 'West Virginia', code: 'WV' },
        { name: 'Wisconsin', code: 'WI' },
        { name: 'Wyoming', code: 'WY' }
    ];

    // State suggestions helpers

     const getStateSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
            ? []
            : states.filter(
                state =>
                    state.name.toLowerCase().slice(0, inputLength) === inputValue
            );
    };
    
    const getStateSuggestionValue = suggestion => suggestion.name;

    const renderStateSuggestion = suggestion => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#20AEF3] hover:text-black">
            {suggestion.name}
        </div>
    );

    const StateInputProps = {
        placeholder: 'Enter State',
        value: state,
        onChange: (event, { newValue }) => setState(newValue),
        className: `mt-2 w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3] 
        ${isDarkMode ? "bg-[#171821] text-white placeholder:text-white" 
                     : "bg-[#e0e0e0] text-black placeholder:text-black"}`,};
    
    const onStateSuggestionsFetchRequested = ({ value }) => {
        setStateSuggestions(getStateSuggestions(value));
    };
    const onStateSuggestionsClearRequested = () => {
        setStateSuggestions([]);
    };
    

    { /* Zip Suggestions */ }
    const getZipSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
            ? []
            : zipData.filter(
                item =>
                    item.zip.toLowerCase().slice(0, inputLength) === inputValue
            );
    };

    const getZipSuggestionValue = (suggestion) => suggestion.zip || '';

    const renderZipSuggestion = (suggestion) => (
        <div className="px-4 py-2 cursor-pointer hover:bg-[#20AEF3] hover:text-black">
            {suggestion.zip}
        </div>
    );

    const ZipInputProps = {
        placeholder: 'Optional: Enter Zip Code',
        value: zip,
        onChange: (event, { newValue }) => setZip(newValue),
        className: `mt-2 w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3] 
        ${isDarkMode ? "bg-[#171821] text-white placeholder:text-white" 
                     : "bg-[#e0e0e0] text-black placeholder:text-black"}`,
        style: {
            fontSize: '0.92rem',
        }
    };
    const onZipSuggestionsFetchRequested = ({ value }) => {
        setZipSuggestions(getZipSuggestions(value));
    };
    const onZipSuggestionsClearRequested = () => {
        setZipSuggestions([]);
    };

  return (
    <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#20AEF3]' : 'text-[#20AEF3]'}`}>
        Lists + Rankings
      </h3>
      <p className=""> 
        <br />
        To compare and contrast nonprofits, you need to enter at least a state and select a sector.
        Optionally, you can also search by zipcode. You can also select one of four fiscal variables,
        with the default being revenue. You can enter a fiscal year, otherwise, the default will be
        the most recent per nonprofit.
      </p>

      <div className="flex-col mx-10 font-sans mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          

          <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <div className="relative">
              <Autosuggest
                suggestions={stateSuggestions}
                onSuggestionsFetchRequested={onStateSuggestionsFetchRequested}
                onSuggestionsClearRequested={onStateSuggestionsClearRequested}
                getSuggestionValue={getStateSuggestionValue}
                renderSuggestion={renderStateSuggestion}
                inputProps={StateInputProps}
                renderSuggestionsContainer={({ containerProps, children }) => (
                  <div {...containerProps} className={`absolute left-0 w-full max-h-96 ${
                      isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                    } overflow-y-auto rounded z-10 ${stateSuggestions.length > 0 ? 'border border-[#20AEF3]' : ''}`}>
                    {children}
                  </div>
                )}
              />
            </div>
          </div>
          
        <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
          <div className="relative">
            <select
              value={nteeCode}
              onChange={(e) => setNteeCode(e.target.value)}
              className={`mt-2 w-full ${
                isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
              } p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3]`
            }
            >
              {majorGroups.map((group) => (
                <option
                  key={group.value}
                  value={group.value}
                >
                  {group.label}
                </option>
              ))}
            </select>
          </div>
        </div>

      <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
          <div className="relative">
              <Autosuggest
                  suggestions={zipSuggestions}
                  onSuggestionsFetchRequested={onZipSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onZipSuggestionsClearRequested}
                  getSuggestionValue={getZipSuggestionValue}
                  renderSuggestion={renderZipSuggestion}
                  inputProps={ZipInputProps}
                  renderSuggestionsContainer={({ containerProps, children }) => (
                      <div {...containerProps} className={`absolute left-0 w-full max-h-96 ${
                          isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                          } overflow-y-auto rounded z-10 ${zipSuggestions.length > 0 ? 'border border-[#20AEF3]' : ''}`}>
                          {children}
                      </div>
                  )}
              />
          </div>
      </div>

      <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-center items-center`}>
        <div className="relative w-full max-w-xs">
          <select
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
            className={`w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3] ${
              isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
            }`}
          >
            <option value="TotRev">Select Fiscal Variable</option>
            <option value="TotRev">Revenue</option>
            <option value="TotExp">Expenses</option>
            <option value="TotAst">Assets</option>
            <option value="TotLia">Liabilities</option>
          </select>
        </div>
      </div>


      <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-20`}>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={`w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3] 
            ${isDarkMode ? "bg-[#171821] text-white placeholder:text-white" 
                         : "bg-[#e0e0e0] text-black placeholder:text-black"}`}
        />
      </div>

      <div className={`p-4 rounded-lg`}></div>
      <div className={`p-4 rounded-lg`}></div>

      <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} mt-4  p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center sm:col-span-2 lg:col-span-1`}>
      <button 
          className="bg-[#20AEF3] text-black font-semibold py-2 px-4 rounded hover:bg-[#62c6f6] transition-colors duration-300"
      >
          SEARCH
      </button>
      </div>

        </div>
      </div>
    </div>
);
}

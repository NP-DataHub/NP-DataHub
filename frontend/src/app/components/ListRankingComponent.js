import React, { useState, useEffect } from 'react';
import zipData from './zipcode_data';
import Autosuggest from 'react-autosuggest';
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ListRanking({isDarkMode}) {


  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [state, setState] = useState('');

  const [nteeCode, setNteeCode] = useState('');

  const [zipSuggestions, setZipSuggestions] = useState([]);
  const [zip, setZip] = useState('');

  const [variable, setVariable] = useState("TotRev");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [sortOrder, setSortOrder] = useState('desc'); // New state for sort order
  
  const [year, setYear] = useState('');
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);

  const majorGroups = [
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

    const isFetchDisabled = () => {
      return !nteeCode || !year || (!state && !zip); // Disable if one of them is not provided
    };
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/lists-rankings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state, nteeCode, zip, year }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error fetching data');
        }
        let ecoKey = "ecoamountRev";
        if (variable){
          ecoKey = `ecoamount${variable.slice(3)}`;
        }
        // sort the data
        const sortedData = [...data].sort((a, b) => {
          return sortOrder === 'desc'
            ? b[ecoKey] - a[ecoKey]
            : a[ecoKey] - b[ecoKey];
        });
        setData(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    if (data) {
      setLoading(true);
      // Determine the ecoamount key (e.g. "ecoamountRev" for TotRev)
      let ecoKey = "ecoamountRev";
      if (variable){
        ecoKey = `ecoamount${variable.slice(3)}`;
      }

      // Re-sort the data
      const sortedData = [...data].sort((a, b) => {
        return sortOrder === 'desc'
          ? b[ecoKey] - a[ecoKey]
          : a[ecoKey] - b[ecoKey];
      });
        setData(sortedData);
        setLoading(false);
    }
  }, [variable, sortOrder]);

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

  const SearchLoadingComponent = () => (
    <div className="flex items-center justify-center h-full w-full">
        <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
  );

  return (
    <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#20AEF3]' : 'text-[#20AEF3]'}`}>
        Lists + Rankings
      </h3>
      <p className=""> 
        <br />
          To compare and contrast nonprofits, you need to select a sector, a fiscal year, and either a state, zip code, or both.
          You can also switch between one of four fiscal variables without needing to search again.
      </p>

      <div className="flex-col mx-10 font-sans mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          

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
                <option value="">Select Sector</option>
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


          <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-20`}>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#20AEF3] 
                ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"}`}
            >
              <option value="">Select Year</option>
              {years.slice(0, -1).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

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
            <option value="TotRev">Revenue</option>
            <option value="TotExp">Expenses</option>
            <option value="TotAst">Assets</option>
            <option value="TotLia">Liabilities</option>
          </select>
        </div>
      </div>

      <div className={`p-4 rounded-lg`}></div>
      <div className={`p-4 rounded-lg`}></div>

      <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} mt-4  p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center sm:col-span-2 lg:col-span-1`}>
        <button 
          onClick={() => {
            setZipSuggestions([]);
            setStateSuggestions([]);
            fetchData();
          }}
          className={`text-black font-semibold py-2 px-4 rounded transition-colors duration-300 
            ${isFetchDisabled() || loading 
              ? (isDarkMode ? "bg-gray-700 cursor-not-allowed" : "bg-[#D8D8D8] cursor-not-allowed") 
              : "bg-[#20AEF3] hover:bg-[#62c6f6]"}
          `}
          disabled={isFetchDisabled() || loading}
            >
            SEARCH
        </button>
      </div>

      </div>
      {loading && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
      {error && <div className="text-center text-lg text-red-400 mt-6">Error: {error}</div>}

      {data && !loading && !error && (
        <div className="mb-4 flex justify-start">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center gap-1"
          >
            <ChevronUp size={20} className={sortOrder === 'asc' ? 'text-black dark:text-white' : 'text-gray-400'} />
            <ChevronDown size={20} className={sortOrder === 'desc' ? 'text-black dark:text-white' : 'text-gray-400'} />
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <div className="overflow-x-auto max-h-96 overflow-auto mt-6">
          <table
            className={`min-w-full ${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} rounded-lg`}
          >
            <thead className="sticky top-0 z-10">
              <tr>
                <th
                  className={`py-3 px-6 text-left ${
                    isDarkMode ? "bg-[#21222D]" : "bg-[#f9f9f9]"
                  }`}
                >
                  NTEE ECOSYSTEM RANKING
                </th>
                <th
                  className={`py-3 px-6 text-left ${
                    isDarkMode ? "bg-[#21222D]" : "bg-[#f9f9f9]"
                  }`}
                >
                  NONPROFIT
                </th>
                <th
                  className={`py-3 px-6 text-left ${
                    isDarkMode ? "bg-[#21222D]" : "bg-[#f9f9f9]"
                  }`}
                >
                  AMOUNT
                </th>
                <th
                  className={`py-3 px-6 text-left ${
                    isDarkMode ? "bg-[#21222D]" : "bg-[#f9f9f9]"
                  }`}
                >
                  % CHANGE FOR PREVIOUS YEAR
                </th>
                <th
                  className={`py-3 px-6 text-left ${
                    isDarkMode ? "bg-[#21222D]" : "bg-[#f9f9f9]"
                  }`}
                >
                  % OF NTEE ECOSYSTEM AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                // Determine dynamic keys based on the selected variable.
                // For instance, if variable is "TotRev", then:
                //   - Amount: row.TotRev
                //   - Change: row.ChangeRev
                //   - ecoamount: row.ecoamountRev
                const suffix = variable.slice(3); // "Rev", "Exp", "Ast", or "Lia"
                const amount = row[variable];
                const change = row[`Change${suffix}`];
                const ecoAmount = row[`ecoamount${suffix}`];

                const nonprofitUrl = `/nonprofit/${encodeURIComponent(row.id)}`;

                // Format the change: show a plus sign for positive numbers, one decimal, and color-coded.
                const changeFormatted =
                  change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(1)}%` : "No data for previous year";
                const changeColor =
                  change > 0
                    ? "text-green-500"
                    : change < 0
                    ? "text-red-500"
                    : "text-gray-500";

                // Format the ecoAmount as a percentage to one decimal.
                const ecoAmountFormatted = ecoAmount.toFixed(1);
                const rank = sortOrder === 'asc' ? data.length - index : index + 1;
                return (
                  <tr key={index} className="border-t border-gray-700">
                    {/* Ranking Column (1-indexed) */}
                    <td className="py-3 px-6">{rank}</td>

                    {/* Nonprofit Column */}
                    <td className="py-3 px-6">
                      <a href={nonprofitUrl} className="hover:underline">
                        {row.Name}
                      </a>
                    </td>

                    {/* Amount Column */}
                    <td className="py-3 px-6">{"$" + amount.toLocaleString()}</td>

                    {/* % CHANGE FOR PREVIOUS YEAR Column */}
                    <td className={`py-3 px-6 ${changeColor}`}>
                      {changeFormatted}
                    </td>

                    {/* % OF NTEE ECOSYSTEM AMOUNT Column */}
                    <td className="py-3 px-6">{ecoAmountFormatted}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
}

import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

export default function CalculatorSection() {
  const [formData, setFormData] = useState({
    budget: '',
    remaining: '',
    beneficiaries: '',
    costPerClient: ''
  });
  const [mode, setMode] = useState('');
  const [nonprofit, setNonprofit] = useState('');
  const [address, setAddress] = useState('');
  const [sector, setSector] = useState('');
  const [state, setState] = useState('');

  const [macroData, setMacroData] = useState(null);
  const [errorMacro, setErrorMacro] = useState(null);
  const [loadingMacro, setLoadingMacro] = useState(false);

  const [microData, setMicroData] = useState(null);
  const [errorMicro, setErrorMicro] = useState(null);
  const [loadingMicro, setLoadingMicro] = useState(false);

  //autocomplete suggestions
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [lastFetchedNameInput, setLastFetchedNameInput] = useState('');
  const [lastFetchedAddressInput, setLastFetchedAddressInput] = useState('');


  const majorGroups = [
    { value: '', label: 'Select a Sector' },
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
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];


  const handleChange = (e) => {
    const { id, value } = e.target;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => {
        let updatedData = { ...prevData, [id]: value };

        // Calculate "remaining" when budget is updated
        if (id === 'budget') {
          updatedData.remaining = value ? String(Number(value) * 2) : '';
        }

        // Calculate "costPerClient" when beneficiaries is updated
        if (id === 'beneficiaries') {
          updatedData.costPerClient = value ? String(Number(value) * 2) : '';
        }

        return updatedData;
      });
    }
  };


  // Fetch function for Macro mode
  const fetchMacroData = async () => {
    setLoadingMacro(true);
    setErrorMacro(null);
    setMacroData(null);

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, nonprofit, address, sector, state }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching data');
      }
      setMacroData(data);
    } catch (err) {
      setErrorMacro(err.message);
    } finally {
      setLoadingMacro(false);
    }
  };
  const isFetchMacroDisabled = () => {
    return !sector; // Disable if sector is not provided
  };

  // Fetch function for Micro mode
  const fetchMicroData = async () => {
    setLoadingMicro(true);
    setErrorMicro(null);
    setMicroData(null);

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, nonprofit, address, sector, state }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching data');
      }
      setMicroData(data);
    } catch (err) {
      setErrorMicro(err.message);
    } finally {
      setLoadingMicro(false);
    }
  };
  const isFetchMicroDisabled = () => {
    return !(nonprofit || address); // Disable only if both are not provided
  };


  // Helper functions for State field
  const getStateSuggestions = value => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return inputLength === 0
          ? []
          : states.filter(state =>
              state.toLowerCase().slice(0, inputLength) === inputValue
          );
  };
  const getStateSuggestionValue = suggestion => suggestion;
  const onStateSuggestionsFetchRequested = ({ value }) => {
        setStateSuggestions(getStateSuggestions(value));
  };
  const onStateSuggestionsClearRequested = () => {
      setStateSuggestions([]);
  };

  const SearchLoadingComponent = () => (
    <div className="flex items-center justify-center h-full w-full">
        <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
  );

  // Helper functions for name and address field
  const fetchSuggestions = async (value, type) => {
    if (type === 'name' && value === lastFetchedNameInput) return;
    if (type === 'address' && value === lastFetchedAddressInput) return;

    try {
      const response = await fetch(`/api/suggestions?input=${value}&type=${type}`);
      const data = await response.json();

      if (data.success) {
        if (type === 'name') {
          setNameSuggestions(data.data);
          setLastFetchedNameInput(value); // Update last fetched value for names
        } else if (type === 'address') {
          setAddressSuggestions(data.data);
          setLastFetchedAddressInput(value); // Update last fetched value for addresses
        }
      } else {
        if (type === 'name') setNameSuggestions([]);
        if (type === 'address') setAddressSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  // Autosuggest configuration
  const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';
  const getAddressSuggestionValue = (suggestion) => suggestion.Addr || '';

  const onNameSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value, 'name');
  };
  const onAddressSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value, 'address');
  };
  const onSuggestionsClearRequested = () => {
    setNameSuggestions([]);
    setAddressSuggestions([]);
  };


  return (
    <div className="p-6 bg-[#171821] rounded-lg">
      <h3 className="text-xl font-semibold text-[#A9DFD8]">Calculator</h3>
      <p className="text-white">
        Compare NTEE code sectors against public data that align with various regional non-profit’s missions.
        The public data is pulled from the U.S. Census, which offers the strongest baseline across a host of demographic variables.
      </p>
      

      {/* Macro mode */}
      <div className="max-w-4xl mx-auto p-8 mb-12 bg-[#171821] text-white rounded-lg shadow-xl border-2 border-[#2C2D33] mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#A9DFD8]">MACRO: SECTOR FINANCIAL PERFORMANCE</h2>
      <p className="text-white text-center pb-8">
        Based on the financial performance of nonprofits with filings from the most recent year containing the most data points, 
        the following calculations will generate results for either a statewide or 
        national NTEE sector performance, depending on your selection.
        </p>
        <div className="flex flex-col gap-6">
          <select
            value={sector}
            onChange={(e) => {
                setSector(e.target.value);
                setMode("Macro");
            }}
            className="p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white"
          >
            {majorGroups.map((group) => (
              <option key={group.value} value={group.value} className="text-black">
                {group.label}
              </option>
            ))}
          </select>
        <Autosuggest
            suggestions={stateSuggestions}
            onSuggestionsFetchRequested={onStateSuggestionsFetchRequested}
            onSuggestionsClearRequested={onStateSuggestionsClearRequested}
            getSuggestionValue={getStateSuggestionValue}
            renderSuggestion={(suggestion) => (
                <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
                    {suggestion}
                </div>
            )}
            inputProps={{
              placeholder: 'Enter state. If left blank, national performance will be calculated',
              value: state,
              onChange: (event, { newValue }) => setState(newValue),
              className: 'p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white',
            }}

            theme={{
              container: 'autosuggest-container',
              input: 'autosuggest-input',
              suggestionsContainer: `absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-y-auto rounded z-10 ${stateSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`,
              suggestionsList: 'autosuggest-suggestions-list',
              suggestion: 'autosuggest-suggestion',
              suggestionHighlighted: 'autosuggest-suggestion--highlighted',
            }}
        />
        <button
          onClick={fetchMacroData}
          className={`py-4 px-6 rounded-lg font-bold w-full ${isFetchMacroDisabled() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300'}`}
          disabled={isFetchMacroDisabled()}
        >
          Calculate
        </button>
        </div>

        {loadingMacro && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorMacro && <div className="text-center text-lg text-red-400 mt-6">Error: {errorMacro}</div>}
        
      {macroData && !loadingMacro && !errorMacro && (
        <div className="mt-8 text-white">
          <div className="flex justify-center flex-wrap gap-8 align-items-start">
            {/* First Row */}
            <div className="flex justify-center gap-8 w-full">
              {[macroData[1], macroData[2], macroData[3], macroData[4]].map((value, index) => {
                // Format large values with abbreviations
                const formattedValue = value >= 1e9 ? `${(value / 1e9).toFixed(1)}B` :
                                      value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` :
                                      value >= 1e3 ? `${(value / 1e3).toFixed(1)}K` :
                                      Math.round(value).toLocaleString();
                const fontSizeClass = formattedValue.length > 6 ? 'text-sm' : 'text-xl';
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center font-bold text-center overflow-hidden">
                      <span className={fontSizeClass}>
                        ${formattedValue}
                      </span>
                    </div>
                    <p className="mt-4 text-sm">
                      {["REVENUES", "EXPENSES", "ASSETS", "LIABILITIES"][index]}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Second Row */}
            <div className="flex justify-center gap-8 w-full mt-8">
              {[macroData[5], macroData[6], macroData[7], macroData[8]].map((value, index) => {
                // Format large values with abbreviations and ensure percentages are displayed with one decimal place
                const formattedValue = index === 3 ? `${value.toFixed(1)}%` : 
                                      value >= 1e9 ? `${(value / 1e9).toFixed(1)}B` :
                                      value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` :
                                      value >= 1e3 ? `${(value / 1e3).toFixed(1)}K` :
                                      Math.round(value).toLocaleString();

                // Determine font size based on the formatted value length
                const fontSizeClass = formattedValue.length > 6 ? 'text-sm' : 'text-xl';

                return (
                  <div key={index + 4} className="flex flex-col items-center">
                    <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center font-bold text-center overflow-hidden">
                      <span className={fontSizeClass}>
                        {index === 0 ? formattedValue : `$${formattedValue}`}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-center">
                      {index === 1 ? <>SALARIES<br />AND<br />WAGES</> : 
                        index === 2 ? <>OFFICERS<br />COMPENSATION</> : 
                        index === 3 ? <>PCT. OF SALARIES<br />v.<br />EXPENSES</> : 
                        "EMPLOYEES"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            Data calculated from following year: {macroData[0]}
          </div>
        </div>
      )}
      </div>

      {/* Micro mode */}
      <div className="max-w-4xl mx-auto p-8 mb-12 bg-[#171821] text-white rounded-lg shadow-xl border-2 border-[#2C2D33] mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#A9DFD8]">MICRO: SINGLE NONPROFIT FINANCIAL PERFORMANCE</h2>
      <p className="text-white text-center pb-8">
        This tool will allow the end user to compare a single nonprofit's expenditures v. salaries 
        and then allow the end user to calculate the cost per constituent served after salaries and wages for any grant level.</p>
        
        <div className="flex flex-col gap-6">
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getNameSuggestionValue}
            renderSuggestion={(suggestion) => (
              <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
                {suggestion.Nm} 
              </div>
            )}
            inputProps={{
              placeholder: 'Search for Nonprofit',
              value: nonprofit,
              onChange: (_, { newValue }) => {
                setNonprofit(newValue);
                setMode("Micro");
              },
              className: 'p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white',
            }}
            theme={{
              container: 'autosuggest-container',
              input: 'autosuggest-input',
              suggestionsContainer: `absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-y-auto rounded z-10 ${nameSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`,
              suggestionsList: 'autosuggest-suggestions-list',
              suggestion: 'autosuggest-suggestion',
              suggestionHighlighted: 'autosuggest-suggestion--highlighted',
            }}
          />

          <Autosuggest
            suggestions={addressSuggestions}
            onSuggestionsFetchRequested={onAddressSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getAddressSuggestionValue}
            renderSuggestion={(suggestion) => (
              <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
                {suggestion.Addr}
              </div>
            )}
            inputProps={{
              placeholder: 'Search or Auto-fill Address',
              value: address,
              onChange: (_, { newValue }) => {
                setAddress(newValue);
                setMode("Micro");
              },
              className: 'p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white',
            }}
            theme={{
              container: 'autosuggest-container',
              input: 'autosuggest-input',
              suggestionsContainer: `absolute top-0 transform -translate-y-full w-full max-h-96 bg-[#171821] overflow-y-auto rounded z-10 ${addressSuggestions.length > 0 ? 'border border-[#A9DFD8]' : ''}`,
              suggestionsList: 'autosuggest-suggestions-list',
              suggestion: 'autosuggest-suggestion',
              suggestionHighlighted: 'autosuggest-suggestion--highlighted',
            }}
          />
          <button
            onClick={fetchMicroData}
            className={`py-4 px-6 rounded-lg font-bold w-full ${isFetchMicroDisabled() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300'}`}
            disabled={isFetchMicroDisabled()}
          >
            Calculate
          </button>
        </div>
        
        {loadingMicro && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorMicro && <div className="text-center text-lg text-red-400 mt-6">Error: {errorMicro}</div>}
        
        {microData && !loadingMicro && !errorMicro && (
          <div className="mt-8 text-white">
            <div className="flex justify-center flex-wrap gap-8 align-items-start">
              {/* Single Row */}
              <div className="flex justify-center gap-8 w-full">
                {[microData[1], microData[2], microData[3]].map((value, index) => {
                  // Format large values with abbreviations and ensure percentages are displayed with one decimal place
                  const formattedValue = index === 2 ? `${value.toFixed(1)}%` : 
                                        value >= 1e9 ? `${(value / 1e9).toFixed(1)}B` :
                                        value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` :
                                        value >= 1e3 ? `${(value / 1e3).toFixed(1)}K` :
                                        Math.round(value).toLocaleString();

                  // Determine font size based on the formatted value length
                  const fontSizeClass = formattedValue.length > 6 ? 'text-sm' : 'text-xl';

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center font-bold text-center overflow-hidden">
                        <span className={fontSizeClass}>
                          {index === 2 ? formattedValue : `$${formattedValue}`}
                        </span>
                      </div>
                      <p className="mt-4 text-sm text-center">
                        {index === 0 ? <>SALARIES<br />AND<br />WAGES</> : 
                          index === 1 ? <>OFFICERS<br />COMPENSATION</> : 
                          <>PCT. OF SALARIES<br />v.<br />EXPENSES</>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400">
              Data calculated from following year: {microData[0]}
            </div>
          </div>
        )}
      <h6 className="text font-semibold text-white mt-4">COST PER CLIENT/CONSTITUENT FOR GRANT OR PROJECT</h6>
      <form className="w-full max-md:max-w-full mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="budget" className="text-[#A9DFD8] mr-4 w-3/4">What is the grant or project budget? (ex. $50,000)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="What is the grant or project budget?"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="remaining" className="text-[#A9DFD8] mr-4 w-3/4">New total remaining after percentage of salaries applied</label>
          <input
            type="text"
            id="remaining"
            name="remaining"
            value={formData.remaining}
            readOnly
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="New total remaining after percentage of salaries applied"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="beneficiaries" className="text-[#A9DFD8] mr-4 w-3/4">How many clients/constituents will benefit from the grant or project total?</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="beneficiaries"
            name="beneficiaries"
            value={formData.beneficiaries}
            onChange={handleChange}
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="How many clients/constituents will benefit from the grant or project total?"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="costPerClient" className="text-[#A9DFD8] mr-4 w-3/4">New cost of services provided to one client/constituent based on budget</label>
          <input
            type="text"
            id="costPerClient"
            name="costPerClient"
            value={formData.costPerClient}
            readOnly
            className="w-1/4 border-b-2 border-[#A9DFD8] bg-transparent text-[#A9DFD8] focus:outline-none"
            aria-label="New cost of services provided to one client/constituent based on budget"
          />
        </div>
      </form>
      </div>
    </div>
  );
}

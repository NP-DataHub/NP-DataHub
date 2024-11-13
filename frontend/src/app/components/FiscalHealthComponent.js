import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './FiscalHealthSection.css'; // Import custom CSS

export default function FiscalHealthSection() {
  // All arguments
  const [singleNp, setSingleNp] = useState('');
  const [singleAddr, setSingleAddr] = useState('');
  const [firstNp, setFirstNp] = useState('');
  const [firstAddr, setFirstAddr] = useState('');
  const [secondNp, setSecondNp] = useState('');
  const [secondAddr, setSecondAddr] = useState('');
  const [mode, setMode] = useState('');
  const [specificSector, setSpecificSector] = useState(null); // Sector selected from dropdown  
  // Results from api call
  const [singleNpScore, setSingleNpScore] = useState(null);
  const [singleNpYears, setSingleNpYears] = useState(null);
  const [firstNpScore, setFirstNpScore] = useState(null);
  const [firstNpYears, setFirstNpYears] = useState(null);
  const [secondNpScore, setSecondNpScore] = useState(null);
  const [secondNpYears, setSecondNpYears] = useState(null);
  const [nationalSectorScore, setNationalSectorScore] = useState(null);
  const [regionalSectorScore, setRegionalSectorScore] = useState(null);
  // Helper states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions for address autocomplete
  const [lastFetchedNameInput, setLastFetchedNameInput] = useState('');
  const [lastFetchedAddressInput, setLastFetchedAddressInput] = useState('');


  const majorGroups = [
    { value: '', label: 'Select a Sector (Optional)' },
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
  
  // Fetch suggestions for nonprofit names or addresses
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
  // Get suggestion value for name
  const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';

  // Get suggestion value for address
  const getAddressSuggestionValue = (suggestion) => suggestion.Addr || '';

  
  // Render function for names
  const renderNameSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion.Nm}
    </div>
  );

  // Render function for addresses
  const renderAddressSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion.Addr}
    </div>
  );


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

  // Fetch fiscal health data
const fetchFiscalHealthData = async (option) => {
  // Clear results and set loading state
  setLoading(true);
  setError(null);

  if (option === "compare") {
    setFirstNpScore(null);
    setSecondNpScore(null);
  } else {
    setSingleNpScore(null);
  }

  try {
    if (option === "compare") {
      // Fetch data for the first nonprofit
      const responseFirst = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode,
          nonprofit: firstNp,
          address: firstAddr,
          sector: specificSector,
        }),
      });
      const dataFirst = await responseFirst.json();
      if (!responseFirst.ok) throw new Error(dataFirst.message || 'Error fetching fiscal health data for first nonprofit');

      const scoreFirst = isNaN(dataFirst[0]) ? null : dataFirst[0];
      const yearsFirst = dataFirst[1].length === 0 ? null : dataFirst[1];
      setFirstNpScore(scoreFirst);
      setFirstNpYears(yearsFirst);

      // Fetch data for the second nonprofit
      const responseSecond = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode,
          nonprofit: secondNp,
          address: secondAddr,
          sector: specificSector,
        }),
      });
      const dataSecond = await responseSecond.json();
      if (!responseSecond.ok) throw new Error(dataSecond.message || 'Error fetching fiscal health data for second nonprofit');

      const scoreSecond = isNaN(dataSecond[0]) ? null : dataSecond[0];
      const yearsSecond = dataSecond[1].length === 0 ? null : dataSecond[1];
      setSecondNpScore(scoreSecond);
      setSecondNpYears(yearsSecond);

    } else {
      // Fetch data for a single nonprofit
      const response = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode,
          nonprofit: singleNp,
          address: singleAddr,
          sector: specificSector,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error fetching fiscal health data');

      const score = isNaN(data[0]) ? null : data[0];
      const years = data[1].length === 0 ? null : data[1];
      setSingleNpScore(score);
      setSingleNpYears(years);
    }

    // Optionally set the selected sector for display
    // setSelectedSectorForResults(specificSector);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Disable only if both are not given
  const isComparisonFetchDisabled = () => {
    return !(firstNp || firstAddr) || !(secondNp || secondAddr); 
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
    <div className="p-6 bg-[#171821] rounded-lg">
      <h3 className="text-xl font-semibold text-[#FEB95A]">Fiscal Health</h3>
      <p className="text-white ">
        Assess a nonprofit’s fiscal health by calculating a weighted score based on various financial data variables, 
        including increases or decreases in revenues, expenses, assets, and liabilities. 
      </p>
      {/* Compare Two Nonprofits */}
      <div className="max-w-4xl mx-auto p-8 mb-12 bg-[#171821] text-white rounded-lg shadow-xl border-2 border-[#2C2D33]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#FEB95A]">Compare Two Nonprofits</h2>
        <p className="text-white text-center pb-8">
          Assess a nonprofit’s fiscal health based on a weighted score of various data variables. 
          Compare the scores side-by-side with other nonprofits.
        </p>
        <div className="flex flex-col gap-6">
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getNameSuggestionValue}
            renderSuggestion={renderNameSuggestion}
            inputProps={{
              placeholder: 'First Nonprofit Name',
              value: firstNp,
              onChange: (_, { newValue }) => {
                setFirstNp(newValue);
                setMode("NonProfit");
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
            renderSuggestion={renderAddressSuggestion}
            inputProps={{
              placeholder: 'First Nonprofit Address',
              value: firstAddr,
              onChange: (_, { newValue }) => {
                setFirstAddr(newValue);
                setMode("NonProfit");
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
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getNameSuggestionValue}
            renderSuggestion={renderNameSuggestion}
            inputProps={{
              placeholder: 'Second Nonprofit Name',
              value: secondNp,
              onChange: (_, { newValue }) => {
                setSecondNp(newValue);
                setMode("NonProfit");
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
            renderSuggestion={renderAddressSuggestion}
            inputProps={{
              placeholder: 'Second Nonprofit Address',
              value: secondAddr,
              onChange: (_, { newValue }) => {
                setSecondAddr(newValue);
                setMode("NonProfit");
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
            onClick={() => fetchFiscalHealthData("compare")}
            className={`py-4 px-6 rounded-lg font-bold w-full ${isComparisonFetchDisabled() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300'}`}
            disabled={isComparisonFetchDisabled()}
          >
            Compare Nonprofits
          </button>
        </div>

        {loading && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {error && <div className="text-center text-lg text-red-400 mt-6">Error: {error}</div>}
        
      </div>
    </div>
  );
}

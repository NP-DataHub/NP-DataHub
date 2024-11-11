import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './FiscalHealthSection.css'; // Import custom CSS

export default function FiscalHealthSection() {
  const [firstNp, setFirstNp] = useState('');
  const [firstAddr, setFirstAddr] = useState('');
  const [firstNp1, setFirstNp1] = useState('');
  const [firstAddr1, setFirstAddr1] = useState('');
  const [secondNp, setSecondNp] = useState('');
  const [secondAddr, setSecondAddr] = useState('');
  const [specificSector, setSpecificSector] = useState(''); // Sector selected from dropdown
  const [nameSuggestions, setNameSuggestions] = useState([]); // Suggestions for name autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState([]); // Suggestions for address autocomplete
  const [lastFetchedNameInput, setLastFetchedNameInput] = useState('');
  const [lastFetchedAddressInput, setLastFetchedAddressInput] = useState('');

  const [nonprofitDataSingle, setNonprofitDataSingle] = useState(null);
  const [nonprofitDataCompare, setNonprofitDataCompare] = useState(null);

  const [loadingSingle, setLoadingSingle] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const [errorSingle, setErrorSingle] = useState(null);
  const [errorCompare, setErrorCompare] = useState(null);
  const [selectedSectorForResults, setSelectedSectorForResults] = useState(''); // Sector used to display results
  const [nonprofitData, setNonprofitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const getNameSuggestionValue = (suggestion) => suggestion.Nm || '';
  const getAddressSuggestionValue = (suggestion) => suggestion.Addr || '';

  // Render functions for suggestions
  const renderNameSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion.Nm}
    </div>
  );
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
// Fetch function for Single Nonprofit vs National/Regional
const fetchFiscalHealthData = async () => {
  setLoadingSingle(true);
  setErrorSingle(null);
  setNonprofitDataSingle(null);

  try {
    const response = await fetch('/api/fiscalHealth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstNp, firstAddr, specific_sector: specificSector }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error fetching fiscal health data');
    }
    setNonprofitDataSingle(data);
  } catch (err) {
    setErrorSingle(err.message);
  } finally {
    setLoadingSingle(false);
  }
};

// Fetch function for Compare Two Nonprofits
const fetchFiscalHealthData_compare = async () => {
  setLoadingCompare(true);
  setErrorCompare(null);
  setNonprofitDataCompare(null);

  try {
    const response = await fetch('/api/fiscalHealth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstNp1, firstAddr1, secondNp, secondAddr }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error fetching fiscal health data');
    }
    setNonprofitDataCompare(data);
  } catch (err) {
    setErrorCompare(err.message);
  } finally {
    setLoadingCompare(false);
  }
};



  // Determine if the fetch button should be disabled
  const isFetchDisabled = () => {
    return !(firstNp || firstAddr); // Disable if neither name nor address is provided for the first nonprofit
  };

  const isFetchDisabled_compare = () => {
    return !((firstNp1 || firstAddr1) && (secondNp || secondAddr)) ; // Disable if neither name nor address is provided for the first nonprofit
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
      <p className="text-white">
        Assess a nonprofit’s fiscal health by calculating a weighted score based on various financial data variables, 
        including increases or decreases in revenues, expenses, assets, and liabilities.
      </p>

      {/* Single Nonprofit vs National/Regional */}
      <div className="max-w-4xl mx-auto p-8 mb-12 bg-[#171821] text-white rounded-lg shadow-xl border-2 border-[#2C2D33] mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#FEB95A]">Single Nonprofit vs National/Regional</h2>
      <p className="text-white text-center pb-8">
      Assess a nonprofit’s fiscal health based on a weighted score of various data variables. 
Compare the scores side-by-side with the same or other sectors.
      </p>
        <div className="flex flex-col gap-6">
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getNameSuggestionValue}
            renderSuggestion={renderNameSuggestion}
            inputProps={{
              placeholder: 'Search for Nonprofit',
              value: firstNp,
              onChange: (_, { newValue }) => setFirstNp(newValue),
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
              placeholder: 'Search or Auto-fill Address',
              value: firstAddr,
              onChange: (_, { newValue }) => setFirstAddr(newValue),
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

          <select
            value={specificSector}
            onChange={(e) => setSpecificSector(e.target.value)}
            className="p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white"
          >
            {majorGroups.map((group) => (
              <option key={group.value} value={group.value} className="text-black">
                {group.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchFiscalHealthData}
            className={`py-4 px-6 rounded-lg font-bold w-full ${isFetchDisabled() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300'}`}
            disabled={isFetchDisabled()}
          >
            Calculate Fiscal Health
          </button>
        </div>

        {loadingSingle && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorSingle && <div className="text-center text-lg text-red-400 mt-6">Error: {errorSingle}</div>}

        {loadingCompare && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorCompare && <div className="text-center text-lg text-red-400 mt-6">Error: {errorCompare}</div>}


        {nonprofitDataSingle && !loadingSingle && !errorSingle && (
          <div className="mt-8 text-white">
            {!selectedSectorForResults && (
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitDataSingle[0][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score</p>
                  <div className="mt-2 text-sm text-gray-400 text-center">
                    Years:
                    <ul style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {nonprofitDataSingle[0][1].sort((a, b) => a - b).map((year, index) => (
                        <li key={index}>{year}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {selectedSectorForResults && (
              <div className="flex flex-row justify-between mb-6">
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitDataSingle[0][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score</p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-blue-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitDataSingle[1][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Regional Score</p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-orange-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitDataSingle[1][1].toFixed(1)}
                  </div>
                  <p className="mt-4">National Score</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
              value: firstNp1,
              onChange: (_, { newValue }) => setFirstNp1(newValue),
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
              value: firstAddr1,
              onChange: (_, { newValue }) => setFirstAddr1(newValue),
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
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getNameSuggestionValue}
            renderSuggestion={renderNameSuggestion}
            inputProps={{
              placeholder: 'Second Nonprofit Name',
              value: secondNp,
              onChange: (_, { newValue }) => setSecondNp(newValue),
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
              onChange: (_, { newValue }) => setSecondAddr(newValue),
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

          <button
            onClick={fetchFiscalHealthData_compare}
            className={`py-4 px-6 rounded-lg font-bold w-full ${isFetchDisabled_compare() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300'}`}
            disabled={isFetchDisabled_compare()}
          >
            Compare Nonprofits
          </button>
        </div>

        {loading && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {error && <div className="text-center text-lg text-red-400 mt-6">Error: {error}</div>}

        {nonprofitDataCompare && !loadingCompare && !errorCompare && (
          <div>
          <div className="flex flex-row justify-between mt-8">
            <div className="flex flex-col items-center w-1/2">
              <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                {nonprofitDataCompare[0][0].toFixed(1)}
              </div>
              <p className="mt-4 text-center">{firstNp1} Fiscal Health Score</p>
            </div>

            <div className="flex flex-col items-center w-1/2">
              <div className="bg-yellow-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                {nonprofitDataCompare[1][0].toFixed(1)}
              </div>
              <p className="mt-4 text-center">{secondNp} Fiscal Health Score</p>
            </div>
          
          </div>
            <div className="mt-2 text-sm text-gray-400 text-center">
                      Years:
                      <ul style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {nonprofitDataCompare[0][1].sort((a, b) => a - b).map((year, index) => (
                          <li key={index}>{year}</li>
                        ))}
                      </ul>
                    </div>
          </div>
          
        )}
      </div>
    </div>
  );
}

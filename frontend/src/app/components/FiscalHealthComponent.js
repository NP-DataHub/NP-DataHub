import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './FiscalHealthSection.css'; // Import custom CSS

export default function FiscalHealthSection() {
  const [firstNp, setFirstNp] = useState('');
  const [firstAddr, setFirstAddr] = useState('');
  const [secondNp, setSecondNp] = useState('');
  const [secondAddr, setSecondAddr] = useState('');
  const [npVSnp, setNpVSnp] = useState(false); // Toggle between comparing two nonprofits or a single nonprofit
  const [specificSector, setSpecificSector] = useState(''); // Sector selected from dropdown
  const [selectedSectorForResults, setSelectedSectorForResults] = useState(''); // Sector used to display results
  const [nonprofitData, setNonprofitData] = useState(null);
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
  const getSuggestionValue = (suggestion) => suggestion.Nm || suggestion.Addr || '';
  
  const renderSuggestion = (suggestion) => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion.Nm || suggestion.Addr}
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
  const fetchFiscalHealthData = async () => {
    setLoading(true);
    setError(null);
    setNonprofitData(null); // Clear results when fetching new data

    try {
      const response = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstNp, firstAddr, secondNp, secondAddr, npVSnp, specific_sector: specificSector }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching fiscal health data');
      }

      // Set results only after fetching data
      setNonprofitData(data);
      setSelectedSectorForResults(specificSector); // Update the sector used for results display
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between single and two nonprofit comparisons, clearing data
  const toggleNpVSnp = () => {
    setNpVSnp(!npVSnp);
    setSpecificSector(''); // Clear the sector input when switching
    setNonprofitData(null); // Clear results when toggling between single and two
    setSelectedSectorForResults(''); // Clear sector for results when switching
  };

  // Determine if the fetch button should be disabled
  const isFetchDisabled = () => {
    if (npVSnp) {
      return !(firstNp || firstAddr) || !(secondNp || secondAddr); // Disable if neither name nor address is provided for both nonprofits
    } else {
      return !(firstNp || firstAddr); // Disable if neither name nor address is provided for the first nonprofit
    }
  };

  return (
    <div className="p-6 bg-[#171821] rounded-lg">
      <h3 className="text-xl font-semibold text-[#FEB95A]">Fiscal Health</h3>
      <p className="text-white pb-12">
        Assess a nonprofit’s fiscal health by calculating a weighted score based on various financial data variables, 
        including increases or decreases in revenues, expenses, assets, and liabilities. 
        This score can be compared side-by-side with other nonprofits or evaluated against organizations within the same or different sectors, 
        offering a comprehensive analysis of fiscal health across key financial metrics.
      </p>

      <div className="max-w-4xl mx-auto p-8 mb-12 bg-[#171821] text-white rounded-lg shadow-xl border-2  border-[#2C2D33]">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#FEB95A]">Fiscal Health Tool</h1>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-4">
              {/* Autosuggest for Nonprofit Name */}
              <Autosuggest
                suggestions={nameSuggestions}
                onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
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

            {/* Autosuggest for Address */}
            <Autosuggest
              suggestions={addressSuggestions}
              onSuggestionsFetchRequested={onAddressSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
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
          </div>

          {/* Compare Two Nonprofits */}
          {npVSnp && (
            <div className="flex flex-row justify-between gap-4">
              <Autosuggest
                suggestions={nameSuggestions}
                onSuggestionsFetchRequested={onNameSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  placeholder: 'Compare Against Another Nonprofit',
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
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={{
                  placeholder: 'Search or Auto-fill Address',
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
            </div>
          )}

          {/* Sector dropdown menu */}
          <select
            value={specificSector}
            onChange={(e) => setSpecificSector(e.target.value)}
            disabled={npVSnp} // Disable when npVSnp is true
            className={`p-4 border border-gray-600 bg-[#34344c] rounded-lg w-full text-white ${npVSnp ? 'opacity-50' : ''}`}
          >
            {majorGroups.map((group) => (
              <option key={group.value} value={group.value} className="text-black">
                {group.label}
              </option>
            ))}
          </select>

          <div className="flex flex-row justify-between">
            <button
              onClick={toggleNpVSnp}
              className="py-4 px-6 bg-gray-200 text-black rounded-lg font-bold w-1/2 mr-4 hover:bg-gray-400 transition duration-300"
            >
              {npVSnp ? 'Single Nonprofit' : 'Compare Two Nonprofits'}
            </button>

            <button
              onClick={fetchFiscalHealthData}
              className={`py-4 px-6 rounded-lg font-bold w-1/2 ${isFetchDisabled() ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-[#A9DFD8] text-black hover:bg-[#88B3AE] transition duration-300 '}`}
              disabled={isFetchDisabled()} // Disable the fetch button based on input validation
            >
              Calculate
            </button>
          </div>
        </div>

        {loading && <div className="text-center text-lg text-gray-400 mt-6">Loading...</div>}
        {error && <div className="text-center text-lg text-red-400 mt-6">Error: {error}</div>}

        {nonprofitData && !loading && !error && (
          <div className="mt-8 text-white">
            {!selectedSectorForResults && !npVSnp && (
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[0][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score </p>
                </div>
              </div>
            )}

            {npVSnp && (
              <div className="flex flex-row justify-between">
                <div className="flex flex-col items-center w-1/2">
                  <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[0][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score </p>
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <div className="bg-yellow-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[1][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score </p>
                </div>
              </div>
            )}

            {selectedSectorForResults && !npVSnp && (
              <div className="flex flex-row justify-between mb-6">
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-green-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[0][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Fiscal Health Score </p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-blue-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[1][0].toFixed(1)}
                  </div>
                  <p className="mt-4">Regional Score</p>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="bg-orange-500 border-4 border-white w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold">
                    {nonprofitData[1][1].toFixed(1)}
                  </div>
                  <p className="mt-4">National Score</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

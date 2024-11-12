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
  const [national, setNational] = useState('');
  const [state, setState] = useState('');
  const [macroData, setMacroData] = useState(null);
  const [errorMacro, setErrorMacro] = useState(null);
  const [loadingMacro, setLoadingMacro] = useState(false);

  const [lastFetchedNameInput, setLastFetchedNameInput] = useState('');
  const [lastFetchedAddressInput, setLastFetchedAddressInput] = useState('');

  const [stateSuggestions, setStateSuggestions] = useState([]);  // New state for state suggestions

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

  // Fetch function for Macro mode
  const fetchMacroData = async () => {
    setLoadingMacro(true);
    setErrorMacro(null);
    setMacroData(null);

    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, nonprofit, address, sector, national, state }),
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


  // Helper functions for State field
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
  const onStateSuggestionsFetchRequested = ({ value }) => {
        setStateSuggestions(getStateSuggestions(value));
  };
  const onStateSuggestionsClearRequested = () => {
      setStateSuggestions([]);
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
            onChange={(e) => setSector(e.target.value)}
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
                    {suggestion.name}
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
        </div>
      </div>

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
  );
}

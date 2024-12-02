import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';
import { useCallback } from "react";


export default function FiscalHealthSection({isDarkMode}) {
  // All arguments
  const [singleNp, setSingleNp] = useState('');
  const [singleAddr, setSingleAddr] = useState('');
  const [firstNp, setFirstNp] = useState('');
  const [firstAddr, setFirstAddr] = useState('');
  const [secondNp, setSecondNp] = useState('');
  const [secondAddr, setSecondAddr] = useState('');
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
  const [sectorYears, setSectorYears] = useState(null);
  const [edgeCase, setEdgeCase] = useState(null);
  // Helper states
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [errorComparison, setErrorComparison] = useState(null); 
  const [loadingSectorComparison, setLoadingSectorComparison] = useState(false);
  const [errorSectorComparison, setErrorSectorComparison] = useState(null); 
  
  const [singleNameSuggestions, setSingleNameSuggestions] = useState([]);
  const [singleAddressSuggestions, setSingleAddressSuggestions] = useState([]);
  const [lastSingleFetchedNameInput, setLastSingleFetchedNameInput] = useState('');
  const [lastSingleFetchedAddressInput, setLastSingleFetchedAddressInput] = useState('');

  const [firstNameSuggestions, setFirstNameSuggestions] = useState([]);
  const [firstAddressSuggestions, setFirstAddressSuggestions] = useState([]);
  const [lastFirstFetchedNameInput, setLastFirstFetchedNameInput] = useState('');
  const [lastFirstFetchedAddressInput, setLastFirstFetchedAddressInput] = useState('');

  const [secondNameSuggestions, setSecondNameSuggestions] = useState([]);
  const [secondAddressSuggestions, setSecondAddressSuggestions] = useState([]);
  const [lastSecondFetchedNameInput, setLastSecondFetchedNameInput] = useState('');
  const [lastSecondFetchedAddressInput, setLastSecondFetchedAddressInput] = useState('');


  const isLoading = loadingComparison || loadingSectorComparison;

  const majorGroups = [
    { value: '', label: "Select a sector (the default is the nonprofit sector)" },
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
  const fetchSuggestions = useCallback( debounce(async (value, type, mode) => {

    if (type === 'name') {
      if (
        (mode === 'Single' && value === lastSingleFetchedNameInput) ||
        (mode === 'First' && value === lastFirstFetchedNameInput) ||
        (mode === 'Second' && value === lastSecondFetchedNameInput)
      ) {
        return;
      }
    } else if (type === 'address') {
      if (
        (mode === 'Single' && value === lastSingleFetchedAddressInput) ||
        (mode === 'First' && value === lastFirstFetchedAddressInput) ||
        (mode === 'Second' && value === lastSecondFetchedAddressInput)
      ) {
        return;
      }
    }
    try {
      const response = await fetch(`/api/suggestions?input=${value}&type=${type}`);
      const data = await response.json();

      if (data.success) {
        if (type === 'name') {
          if (mode === 'Single') {
            setSingleNameSuggestions(data.data);
            setLastSingleFetchedNameInput(value);
          } else if (mode === 'First') {
            setFirstNameSuggestions(data.data);
            setLastFirstFetchedNameInput(value);
          } else if (mode === 'Second') {
            setSecondNameSuggestions(data.data);
            setLastSecondFetchedNameInput(value);
          }
        } else if (type === 'address') {
          if (mode === 'Single') {
            setSingleAddressSuggestions(data.data);
            setLastSingleFetchedAddressInput(value);
          } else if (mode === 'First') {
            setFirstAddressSuggestions(data.data);
            setLastFirstFetchedAddressInput(value);
          } else if (mode === 'Second') {
            setSecondAddressSuggestions(data.data);
            setLastSecondFetchedAddressInput(value);
          }
        }
      } else {
        if (type === 'name') {
          if (mode === 'Single') setSingleNameSuggestions([]);
          else if (mode === 'First') setFirstNameSuggestions([]);
          else if (mode === 'Second') setSecondNameSuggestions([]);
        } else if (type === 'address') {
          if (mode === 'Single') setSingleAddressSuggestions([]);
          else if (mode === 'First') setFirstAddressSuggestions([]);
          else if (mode === 'Second') setSecondAddressSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 250), // 250 ms delay
  [lastSingleFetchedNameInput,
  lastFirstFetchedNameInput,
  lastSecondFetchedNameInput,
  lastSingleFetchedAddressInput,
  lastFirstFetchedAddressInput,
  lastSecondFetchedAddressInput ]);


  // Autosuggest configuration
  // Get suggestion value for name
const getNameSuggestionValue = (suggestion) => {
  return suggestion.Nm || '';
};

  // Get suggestion value for address
  const getAddressSuggestionValue = (suggestion) => suggestion.Addr || '';

  
  // Render function for names
  const renderNameSuggestion = (suggestion) => {
    return (
      <div
        className={`px-4 py-2 cursor-pointer ${
          isDarkMode
            ? "hover:bg-[#FEB95A] hover:text-black"
            : "hover:bg-[#FFAA00] hover:text-black"
        }`}
      >
        {suggestion.Nm}
      </div>
    );
  };
  

  const renderAddressSuggestion = (suggestion) => (
      <div
        className={`px-4 py-2 cursor-pointer ${
          isDarkMode
            ? "hover:bg-[#FEB95A] hover:text-black"
            : "hover:bg-[#FFAA00] hover:text-black"
        }`}
      >
        {suggestion.Addr}
      </div>
  );


  const onSuggestionsClearRequested = (mode) => {
    if (mode === 'Single') {
      setSingleNameSuggestions([]);
      setSingleAddressSuggestions([]);
    } else if (mode === 'First') {
      setFirstNameSuggestions([]);
      setFirstAddressSuggestions([]);
    } else if (mode === 'Second') {
      setSecondNameSuggestions([]);
      setSecondAddressSuggestions([]);
    }
  };

/// Fetch fiscal health data
const fetchFiscalHealthData = async (option) => {
  // Clear results and set loadingComparison state

  if (option === "compare") {
    setLoadingComparison(true);
    setErrorComparison(null);
    setFirstNpScore(null);
    setSecondNpScore(null);
    setFirstNpYears(null);
    setSecondNpYears(null);
  } else {
    setLoadingSectorComparison(true);
    setErrorSectorComparison(null);
    setSingleNpScore(null);
    setSingleNpYears(null);
    setSpecificSector(null);
    setNationalSectorScore(null);
    setRegionalSectorScore(null);
    setSectorYears(null);
    setEdgeCase(null);
  }
  try {
    if (option === "compare") {
      // Fetch data for the first nonprofit
      const responseFirst = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: "NonProfit",
          nonprofit: firstNp,
          address: firstAddr,
          sector: specificSector,
        }),
      });
      const dataFirst = await responseFirst.json();
      if (!responseFirst.ok) throw new Error(dataFirst.message || 'Error fetching fiscal health data for first nonprofit');
      const scoreFirst = dataFirst[0] ? dataFirst[0].toFixed(1) : "NaN" ;
      setFirstNpScore(scoreFirst);
      setFirstNpYears(dataFirst[1]);

      // Fetch data for the second nonprofit
      const responseSecond = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: "NonProfit",
          nonprofit: secondNp,
          address: secondAddr,
          sector: specificSector,
        }),
      });
      const dataSecond = await responseSecond.json();
      if (!responseSecond.ok) throw new Error(dataSecond.message || 'Error fetching fiscal health data for second nonprofit');
      const scoreSecond = dataSecond[0] ? dataSecond[0].toFixed(1) : "NaN";
      setSecondNpScore(scoreSecond);
      setSecondNpYears(dataSecond[1]);
    } else {
      // Fetch data for sector comparison
      const response = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: "SectorComparison",
          nonprofit: singleNp,
          address: singleAddr,
          sector: specificSector,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error fetching fiscal health data');
      // 1st case, nonProfit doesn't have enough years
      if (data.length === 2) {
        const score = data[0] ? data[0].toFixed(1) : "NaN" ;
        setSingleNpScore(score);
        setSingleNpYears(data[1]);
        setEdgeCase(1);
      }
      // 2nd case, no sector defined and valid data
      // or specific sector defined which has same consecutive years and state as nonprofit
      else if (data.length === 4){
        setSingleNpScore(data[0].toFixed(1));
        setNationalSectorScore(data[1].toFixed(1));
        setRegionalSectorScore(data[2].toFixed(1));
        setSingleNpYears(data[3]);
        setEdgeCase(2);
      }
      //3rd case, specific sector doesn't have enough consecutive years
      else if (data.length === 3){
        setSingleNpScore(data[0].toFixed(1));
        setSingleNpYears(data[1]);
        setSectorYears(data[2]);
        setEdgeCase(3);
      }
      //4th case, specific sector doesn't have data for the same state as nonprofit
      else if (data.length === 1){
        setSingleNpScore(data[0][0].toFixed(1));
        setSingleNpYears(data[0][1]);
        setNationalSectorScore(data[0][2].toFixed(1));
        setSectorYears(data[0][3]);
        setEdgeCase(4);
      }
      // 5th case, specific sector has data for the same as nonprofit, but different years
      else if (data.length === 5) {
        setSingleNpScore(data[0].toFixed(1));
        setNationalSectorScore(data[1].toFixed(1));
        setRegionalSectorScore(data[2].toFixed(1));
        setSingleNpYears(data[3]);
        setSectorYears(data[4]);
        setEdgeCase(5);
      }
      else {
        setErrorSectorComparison("Unexpected error happened. Please contact administrator");
      }
    }
  } catch (err) {
    if (option === "compare") {
      setErrorComparison(err.message);
    } else{
      setErrorSectorComparison(err.message);
    }
  } finally {
    if (option === "compare") {
      setLoadingComparison(false);
    } else {
      setLoadingSectorComparison(false);
    }
  }
};

  // Disable only if both are not given
  const isComparisonFetchDisabled = () => {
    return !(firstNp || firstAddr) || !(secondNp || secondAddr); 
  };
  // Disable only if both are not given
  const isComparisonSectorFetchDisabled = () => {
    return !(singleNp || singleAddr);
  };

  const SearchLoadingComponent = () => (
    <div className="flex items-center justify-center h-full w-full">
        <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

  const getBackgroundColor = (score) => {
    if (score === "NaN" || score == 0 || score == null) {
      return isDarkMode ? "bg-yellow-600" : "bg-[#D8A031]";
    } else if (score > 0) {
      return isDarkMode ? "bg-blue-900" : "bg-[#316498]";
    } else {
      return isDarkMode ? "bg-red-900" : "bg-[#A64242]";
    }
  }


  return (
    <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#FEB95A]' : 'text-[#FFAA00]'}`}>Fiscal Health</h3>
      <p className=" mb-12">
       <br />
        Comparing two nonprofits in the same sector and region allows a grantmaker to gain valuable insights into their relative performance, impact, and operational strategies. 
        This comparison provides a clearer picture of how each organization uses resources to achieve its mission, as well as the effectiveness of their programs. 
        It helps identify leaders in the field, highlighting organizations that may serve as models for best practices or potential partners in collaborative initiatives. 
        Additionally, by examining the strengths and weaknesses of both nonprofits in similar contexts, grantmakers can make more informed decisions about how their funding can drive meaningful outcomes and address specific community needs.
         <br /> <br />
        Evaluating a nonprofit against sector performance offers a broader perspective on its financial health and sustainability. A weighted scoring system, based on variables such as changes in revenues, expenses, assets, and liabilities, 
        can provide a nuanced understanding of the organization&apos;s capacity for growth and resilience. 
        These metrics reveal trends in financial stability and operational efficiency, helping grantmakers assess how their funding might contribute to long-term impacts and organizational goals.
         <br /> <br />
        By comparing these financial indicators, grantmakers can identify potential risks, opportunities for partnership, and the true budgetary impact of their investment, ensuring their contributions are both effective and strategically aligned with sector-wide goals.
      </p>
      {/* Compare Two Nonprofits */}
      <div className={`max-w-4xl mx-auto p-8 mb-12 ${isDarkMode ? "bg-[#171821] text-white border-[#2C2D33]" : "bg-white text-black border-gray-200"} rounded-lg shadow-xl border-2`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#FEB95A]' : 'text-[#FFAA00]'}`}>Compare Two Nonprofits</h2>
        <p className="text-center pb-8">
          Compare the scores side-by-side with other nonprofits.
        </p>
        <div className="flex flex-col gap-6">
          <div className = 'relative'>
            <Autosuggest
              suggestions={firstNameSuggestions}
              onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'name', 'First')}
              onSuggestionsClearRequested={() => onSuggestionsClearRequested('First')}
              getSuggestionValue={getNameSuggestionValue}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                    firstNameSuggestions.length > 0
                      ? isDarkMode
                        ? 'bg-[#171821] text-white border border-[#FEB95A]'
                        : 'bg-white text-black border border-[#FFAA00]'
                      : ''
                  }`}
                >
                  {children}
                </div>
            )}
              renderSuggestion={renderNameSuggestion}
              
              inputProps={{
                placeholder: 'First Nonprofit Name',
                value: firstNp,
                onChange: (_, { newValue }) => {
                  setSingleNameSuggestions([]);
                  setFirstNp(newValue);
                },
                className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
              }}
            />
          </div>
          <div className = 'relative'>
            <Autosuggest
              suggestions={firstAddressSuggestions}
              onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'address', 'First')}
              onSuggestionsClearRequested={() => onSuggestionsClearRequested('First')}
              getSuggestionValue={getAddressSuggestionValue}
              renderSuggestion={renderAddressSuggestion}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                    firstAddressSuggestions.length > 0
                      ? isDarkMode
                        ? 'bg-[#171821] text-white border border-[#FEB95A]'
                        : 'bg-white text-black border border-[#FFAA00]'
                      : ''
                  }`}
                >
                  {children}
                </div>
            )}
              inputProps={{
                placeholder: 'First Nonprofit Address (Optional: This can be used if the nonprofit has multiple addresses)',
                value: firstAddr,
                onChange: (_, { newValue }) => {
                  setSingleAddressSuggestions([]);
                  setFirstAddr(newValue);
                },
                className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
              }}
            />
            </div>
            <div className = 'relative'>
              <Autosuggest
                suggestions={secondNameSuggestions}
                onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'name', 'Second')}
                onSuggestionsClearRequested={() => onSuggestionsClearRequested('Second')}
                getSuggestionValue={getNameSuggestionValue}
                renderSuggestionsContainer={({ containerProps, children }) => (
                <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                    secondNameSuggestions.length > 0
                      ? isDarkMode
                        ? 'bg-[#171821] text-white border border-[#FEB95A]'
                        : 'bg-white text-black border border-[#FFAA00]'
                      : ''
                  }`}
                >
                  {children}
                </div>
              )}
                renderSuggestion={renderNameSuggestion}
                inputProps={{
                  placeholder: 'Second Nonprofit Name',
                  value: secondNp,
                  onChange: (_, { newValue }) => {
                    setSingleNameSuggestions([]);
                    setSecondNp(newValue);
                  },
                  className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
                }}
              />
            </div>
            <div className = 'relative'>
              <Autosuggest
                suggestions={secondAddressSuggestions}
                onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'address', 'Second')}
                onSuggestionsClearRequested={() => onSuggestionsClearRequested('Second')}
                getSuggestionValue={getAddressSuggestionValue}
                renderSuggestionsContainer={({ containerProps, children }) => (
                  <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                      secondAddressSuggestions.length > 0
                        ? isDarkMode
                          ? 'bg-[#171821] text-white border border-[#FEB95A]'
                          : 'bg-white text-black border border-[#FFAA00]'
                        : ''
                    }`}
                  >
                    {children}
                  </div>
              )}
                renderSuggestion={renderAddressSuggestion}
                inputProps={{
                  placeholder: 'Second Nonprofit Address (Optional: This can be used if the nonprofit has multiple addresses)',
                  value: secondAddr,
                  onChange: (_, { newValue }) => {
                    setSingleAddressSuggestions([]);
                    setSecondAddr(newValue);
                  },
                  className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
                }}
              />
            </div>

          <button
            onClick={() => {
              setFirstNameSuggestions([]);
              setFirstAddressSuggestions([]);
              setSecondNameSuggestions([]);
              setSecondAddressSuggestions([]);
              fetchFiscalHealthData("compare")
            }}
            className={`py-4 px-6 rounded-lg font-bold w-full ${
              isComparisonFetchDisabled() || isLoading
                ? isDarkMode
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-[#D8D8D8] cursor-not-allowed"
                : isDarkMode
                ? 'bg-[#FEB95A] hover:bg-[#D49B4A] transition duration-300'
                : 'bg-[#FFAA00] hover:bg-[#D49B4A] transition duration-300'
            }`}
            disabled={isComparisonFetchDisabled() || isLoading}
          >
            Compare
          </button>
        </div>

        {loadingComparison && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorComparison && <div className="text-center text-lg text-red-400 mt-6">Error: {errorComparison}</div>}
        
        {firstNpScore && secondNpScore && !loadingComparison && !errorComparison && (
          <div>
            <div className="flex flex-row justify-between mt-8">
              
              {/* First Nonprofit Score Display */}
              <div className="flex flex-col items-center w-1/2">
                <div className={`border-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"} w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${getBackgroundColor(firstNpScore)}`}>
                  {firstNpScore}
                </div>
                {/* First Nonprofit Years Message */}
                <div className={`mt-2 text-sm text-center text-gray-${isDarkMode ? "400" : "600"}`}>
                  {firstNpYears.length >= 2 ? (
                    <p>Fiscal health score calculated from the following years:</p>
                  ) : (
                    <p>Minimum 2 consecutive years required for a fiscal health score.</p>
                  )}
                  <ul style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {firstNpYears.length >= 2
                      ? firstNpYears.sort((a, b) => a - b).map((year, index) => (
                          <li key={`firstNpYear-${index}`}>{year}</li>
                        ))
                      : firstNpYears.length > 0 && (
                          <li>
                            Only available years: {[...firstNpYears].sort((a, b) => a - b).join(", ")}
                          </li>
                        )}
                  </ul>
                </div>
              </div>
              {/* Second Nonprofit Score Display */}
              <div className="flex flex-col items-center w-1/2">
                <div className={`border-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"} w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${getBackgroundColor(secondNpScore)}`}>
                  {secondNpScore}
                </div>

                {/* Second Nonprofit Years Message */}
                <div className={`mt-2 text-sm text-center text-gray-${isDarkMode ? "400" : "600"}`}>
                  {secondNpYears.length >= 2 ? (
                    <p>Fiscal health score calculated from the following years:</p>
                  ) : (
                    <p>Minimum 2 consecutive years are required for a fiscal health score.</p>
                  )}
                  <ul style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {secondNpYears.length >= 2
                      ? secondNpYears.sort((a, b) => a - b).map((year, index) => (
                          <li key={`secondNpYear-${index}`}>{year}</li>
                        ))
                      : secondNpYears.length > 0 && (
                        <li>
                          Only available years: {[...secondNpYears].sort((a, b) => a - b).join(", ")}
                        </li>
                      )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      {/* Compare NonProfit Against Sector */}
      <div className={`max-w-4xl mx-auto p-8 mb-12 ${isDarkMode ? "bg-[#171821] text-white border-[#2C2D33]" : "bg-white text-black border-gray-200"} rounded-lg shadow-xl border-2 border-[#2C2D33] mt-12`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#FEB95A]' : 'text-[#FFAA00]'}`}>Compare Nonprofit Against a Sector</h2>
        <p className="text-center pb-8">
        Compare the scores side-by-side with the same or other sectors, either at the state or national levels. 
        If the nonprofit&apos;s score is higher than the state and national score, it signals that fiscally, 
        the nonprofit is outperforming the other nonprofits in the chosen NTEE sector. 
        If the nonprofit&apos;s score is lower than the state and national score, they are not performing as well. 
        The state and national scores in all results are based on the chosen NTEE sector median.</p>
        <div className="flex flex-col gap-6">
          <div className = 'relative'>
            <Autosuggest
              suggestions={singleNameSuggestions}
              onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'name', 'Single')}
              onSuggestionsClearRequested={() => onSuggestionsClearRequested('Single')}
              getSuggestionValue={getNameSuggestionValue}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                    singleNameSuggestions.length > 0
                      ? isDarkMode
                        ? 'bg-[#171821] text-white border border-[#FEB95A]'
                        : 'bg-white text-black border border-[#FFAA00]'
                      : ''
                  }`}
                >
                  {children}
                </div>
            )}
              renderSuggestion={renderNameSuggestion}
              inputProps={{
                placeholder: 'Single Nonprofit Name',
                value: singleNp,
                onChange: (_, { newValue }) => {
                  setFirstNameSuggestions([]);
                  setSecondNameSuggestions([]);
                  setSingleNp(newValue);
                },
                className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
              }}
            />
          </div>
          <div className = 'relative'>
            <Autosuggest
              suggestions={singleAddressSuggestions}
              onSuggestionsFetchRequested={({ value }) => fetchSuggestions(value, 'address', 'Single')}
              onSuggestionsClearRequested={() => onSuggestionsClearRequested('Single')}
              getSuggestionValue={getAddressSuggestionValue}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <div {...containerProps} className={`absolute top-0 transform -translate-y-full w-full max-h-96 overflow-y-auto rounded z-10 ${
                    singleAddressSuggestions.length > 0
                      ? isDarkMode
                        ? 'bg-[#171821] text-white border border-[#FEB95A]'
                        : 'bg-white text-black border border-[#FFAA00]'
                      : ''
                  }`}
                >
                  {children}
                </div>
            )}
              renderSuggestion={renderAddressSuggestion}
              inputProps={{
                placeholder: 'Single Nonprofit Address (Optional: This can be used if the nonprofit has multiple addresses)',
                value: singleAddr,
                onChange: (_, { newValue }) => {
                  setFirstAddressSuggestions([]);
                  setSecondAddressSuggestions([]);
                  setSingleAddr(newValue);
                },
                className: `p-4 border ${isDarkMode ? "bg-[#34344c] text-white border-gray-600 placeholder-gray-400" : "bg-[#F1F1F1] text-black border-gray-200 placeholder-gray-490"} rounded-lg w-full focus:outline-none`,
              }}
            />
          </div>
          <select
            value={specificSector}
            onChange={(e) => setSpecificSector(e.target.value)}
            className={`p-4 border  ${isDarkMode ? "bg-[#34344c] text-white border-gray-600" : "bg-[#F1F1F1] text-black border-gray-200"} rounded-lg w-full`}
          >
            {majorGroups.map((group) => (
              <option key={group.value} value={group.value} className="text-black">
                {group.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSingleNameSuggestions([]);
              setSingleAddressSuggestions([]);
              fetchFiscalHealthData("compareSector");
            }}
            className={`py-4 px-6 rounded-lg font-bold w-full ${
              isComparisonSectorFetchDisabled() || isLoading
                ? isDarkMode
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-[#D8D8D8] cursor-not-allowed"
                : isDarkMode
                ? 'bg-[#FEB95A] hover:bg-[#D49B4A] transition duration-300'
                : 'bg-[#FFAA00] hover:bg-[#D49B4A] transition duration-300'
            }`}
            disabled={isComparisonSectorFetchDisabled() || isLoading}
          >
            Compare
          </button>
        </div>
        {loadingSectorComparison && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
        {errorSectorComparison && <div className="text-center text-lg text-red-400 mt-6">Error: {errorSectorComparison}</div>}

        {singleNpScore && !loadingSectorComparison && !errorSectorComparison && (
          <div className="mt-8">
            {/* Container for the three score circles */}
            <div className="flex flex-row justify-center items-center space-x-4 w-full">
              {/* Edge Case 1: Not Enough Consecutive Years */}
              {edgeCase === 1 ? (
                <div className="flex flex-col items-center w-1/3">
                  <div className={`border-4 w-28 h-28 rounded-full flex items-center justify-center font-bold text-center overflow-hidden text-3xl font-bold
                    ${isDarkMode ? "bg-yellow-600 border-white" : "bg-[#D8A031] border-black"}`}>
                    NaN
                  </div>
                  <p className={`mt-4 text-sm whitespace-nowrap text-center text-gray-${isDarkMode ? "400" : "600"}`}>
                    Minimum 2 consecutive years required for a fiscal health score.
                  </p>
                  {singleNpYears && singleNpYears.length > 0 && (
                    <p className={`mt-2 text-sm text-center text-gray-${isDarkMode ? "400" : "600"}`}>
                      Only available years:{" "}
                      <span className="inline-block">{[...singleNpYears].sort((a, b) => a - b).join(", ")}</span>
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Display the three score circles */}
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`border-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"} w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${getBackgroundColor(singleNpScore)}`}>
                      {singleNpScore}
                    </div>
                    <p className="mt-4">Nonprofit Score</p>
                  </div>
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`border-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"} w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${getBackgroundColor(regionalSectorScore)}`}>
                      {regionalSectorScore == null ? "NaN" : regionalSectorScore}
                    </div>
                    <p className="mt-4">State Score</p>
                  </div>
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`border-4 ${isDarkMode ? "border-white text-white" : "border-black text-black"} w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold ${getBackgroundColor(nationalSectorScore)}`}>
                      {nationalSectorScore == null ? "NaN" : nationalSectorScore}
                    </div>
                    <p className="mt-4">National Score</p>
                  </div>
                </>
              )}
            </div>

            {/* Edge Case 2: Show message with years below the circles */}
            <div className={`mt-6 text-sm text-gray-${isDarkMode ? "400" : "600"}`}>      
              
              {edgeCase === 2 && (
                <p className="mt-2 text-center">
                  Fiscal health scores were calculated using the following years: 
                  {singleNpYears && singleNpYears.length > 0 && (
                    <> {[...singleNpYears].sort((a, b) => a - b).join(", ")}</>
                  )}
                </p>
              )}

              {edgeCase === 3 && (
                <div className="mt-2 text-center">
                  <p>
                    The fiscal health score of the nonprofit was calculated using the following years: 
                    {singleNpYears && singleNpYears.length > 0 && (
                      <> {[...singleNpYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                  <p className="mt-1 text-center">
                    The sector chosen doesn’t have enough data for any consecutive years. Only available years: 
                    {sectorYears && sectorYears.length > 0 && (
                      <> {[...sectorYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                </div>
              )}
              {edgeCase === 4 && (
                <div className="mt-2 text-center">
                  <p>
                    The fiscal health score of the nonprofit was calculated using the following years: 
                    {singleNpYears && singleNpYears.length > 0 && (
                      <> {[...singleNpYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                  <p className="mt-1 text-center">
                    The sector chosen doesn&apos;t have data for the same state as the nonprofit. <br />
                    The national score was calculated using the following years, as no data matched the nonprofit&apos;s years:
                    {sectorYears && sectorYears.length > 0 && (
                      <> {[...sectorYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                </div>
              )}
              {edgeCase === 5 && (
                <div className="mt-2 text-center">
                  <p>
                    The fiscal health score of the nonprofit was calculated using the following years: 
                    {singleNpYears && singleNpYears.length > 0 && (
                      <> {[...singleNpYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                  <p className="mt-1 text-center">
                    Both sector scores were calculated using the following years, as no data matched the nonprofit&apos;s years:            
                  {sectorYears && sectorYears.length > 0 && (
                      <> {[...sectorYears].sort((a, b) => a - b).join(", ")}</>
                    )}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

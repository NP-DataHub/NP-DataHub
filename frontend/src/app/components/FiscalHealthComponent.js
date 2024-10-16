import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

const FiscalHealthComponent = () => {
  const [selectedNp1, setSelectedNp1] = useState('');
  const [selectedNp2, setSelectedNp2] = useState('');
  const [fiscalScoreNp1, setFiscalScoreNp1] = useState(null);
  const [fiscalScoreNp2, setFiscalScoreNp2] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Input props for nonprofit 1 and nonprofit 2
  const inputProps = {
    placeholder: 'Nonprofit 1',
    value: selectedNp1,
    onChange: (event, { newValue }) => setSelectedNp1(newValue),
  };

  const inputProps2 = {
    placeholder: 'Nonprofit 2',
    value: selectedNp2,
    onChange: (event, { newValue }) => setSelectedNp2(newValue),
  };

  // Example function to fetch suggestions for Autosuggest
  const onSuggestionsFetchRequested = ({ value }) => {
    // Example suggestions based on user input (you can replace this with an actual API call)
    setSuggestions([
      { name: 'Society of Cosmetic Chemists' },
      { name: 'Beta Theta Pi Fraternity' },
      { name: 'Red Cross' },
      { name: 'Green Peace' },
    ]);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

  // Fetch the fiscal health data from the API
  const handleCalculate = async () => {
    const firstNp = selectedNp1;
    const firstAddr = 'First address'; // Replace with actual address or fetch dynamically
    const secondNp = selectedNp2 || '';
    const secondAddr = 'Second address'; // Replace with actual address or fetch dynamically
    const npVSnp = !!secondNp;

    try {
      const response = await fetch('/api/fiscalHealth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstNp,
          firstAddr,
          secondNp,
          secondAddr,
          npVSnp,
          specific_sector: null, // or provide a specific sector if needed
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (npVSnp) {
          setFiscalScoreNp1(result[0][0]);
          setFiscalScoreNp2(result[1][0]);
          setAnalysis(`Nonprofit 1 score: ${result[0][0]}, Nonprofit 2 score: ${result[1][0]}`);
        } else {
          setFiscalScoreNp1(result[0][0]);
          setAnalysis(`Nonprofit 1 score: ${result[0][0]}, Sector comparison: ${result[1][0]}`);
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred while calculating fiscal health.');
    }
  };

  return (
    <div className="p-6 bg-[#171821] rounded-lg">
      {/* Section for Single Nonprofit Fiscal Health */}
      <h3 className="text-xl font-semibold text-[#FEB95A]">
        FISCAL HEALTH: SINGLE NONPROFIT
      </h3>
      <p className="text-white mt-2">
        Assess a nonprofit’s fiscal health based on a weighted score of various data variables. Compare the scores side-by-side with other nonprofits.
      </p>
      <div className="mt-12 text-sm">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
            SEARCH FOR A NONPROFIT
          </button>
          <button className="p-4 bg-[#34344c] rounded-md text-white hover:bg-gray-500 transition-colors">
            COMPARE AGAINST ANOTHER NONPROFIT
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps2}
          />
        </div>
        <div className="flex justify-center mb-6">
          <button
            className="px-8 py-4 bg-green-500 rounded-full text-white font-bold hover:bg-green-400 transition-colors mt-8 mb-4"
            onClick={handleCalculate}
          >
            CALCULATE
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
              {fiscalScoreNp1 !== null ? fiscalScoreNp1 : 'N/A'}
            </div>
            <span className="mt-2 text-gray-300">Nonprofit 1</span>
          </div>
          {fiscalScoreNp2 !== null && (
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-orange-500">
                {fiscalScoreNp2 !== null ? fiscalScoreNp2 : 'N/A'}
              </div>
              <span className="mt-2 text-gray-300">Nonprofit 2</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-12">ANALYSIS</h3>
      <p className="text-white mt-2">
        {analysis}
      </p>

      {/* Section for Fiscal Health Against Local + National Sectors */}
      <h3 className="text-xl font-semibold text-[#FEB95A] mt-12">
        FISCAL HEALTH: AGAINST LOCAL + NATIONAL SECTORS
      </h3>
      <p className="text-white mt-2">
        Assess a nonprofit’s fiscal health based on a weighted score of various data variables. Compare the scores side-by-side with the same or other sectors.
      </p>
      <div className="mt-12 text-sm">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps2}
          />
        </div>
        <div className="flex justify-center mb-6">
          <button className="px-8 py-4 bg-green-500 rounded-full text-white font-bold hover:bg-green-400 transition-colors mt-8 mb-4">
            CALCULATE
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
              {fiscalScoreNp1 !== null ? fiscalScoreNp1 : 'N/A'}
            </div>
            <span className="mt-2 text-gray-300">PRIMARY NONPROFIT</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-green-500">
              4.9 {/* This could be dynamic based on regional score */}
            </div>
            <span className="mt-2 text-gray-300">REGIONAL</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-orange-500">
              5.7 {/* This could be dynamic based on national score */}
            </div>
            <span className="mt-2 text-gray-300">NATIONAL</span>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-12">ANALYSIS</h3>
      <p className="text-white mt-2">
        Compared over an aggregate weighted score from three years, the nonprofit is healthier than the regional sector but not as healthy as the national sector.
      </p>
    </div>
  );
};

export default FiscalHealthComponent;

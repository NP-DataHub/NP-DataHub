'use client';

import React, { useState } from 'react';
import TopStatesChart from './charts/TopStatesChart';

export default function AnomalyDetection({ isDarkMode }) {
    const [sector, setSector] = useState('');
    const [loadingSector, setLoadingSector] = useState(false);
    const [error, setError] = useState('');
    const [anomalies, setAnomalies] = useState([]);
    const [filteredAnomalies, setFilteredAnomalies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    const [loadingNp, setLoadingNp] = useState(false);
    const [errorNp, setErrorNp] = useState('');

    const [sector2, setSector2] = useState('');
    const [loadingSector2, setLoadingSector2] = useState(false);
    const [error2, setError2] = useState('');
    const [statsData, setStatsData] = useState([]);

    const isLoading = loadingSector || loadingSector2

    const isFetchSectorDisabled = () => {
        return !sector; // Disable if sector is not provided
    };
    const isFetchSector2Disabled = () => {
        return !sector2;
    };
    const states = {
      AL: 'Alabama',
      AK: 'Alaska' ,
      AS: 'American Samoa',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      DC: 'District of Columbia',
      FL: 'Florida',
      GA: 'Georgia',
      GU: 'Guam',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PA: 'Pennsylvania',
      PR: 'Puerto Rico',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VI: 'Virgin Islands',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming',
    };
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

  const SearchLoadingComponent = () => (
    <div className="flex items-center justify-center h-full w-full">
        <svg className="animate-spin h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
  );

    const fetchAnomalies = async (mode) => {
        if (mode === 'Nonprofits' && !sector) {
            setError('Please select a sector.');
            return;
        } else if (mode === 'Stats' && !sector2) {
            setError2('Please select a sector.');
            return;
        }
        try {
            if (mode === 'Nonprofits') {
                setLoadingSector(true);
                setError('');
                setAnomalies([]);
                setSelectedAnomaly(null);
                const response = await fetch(`/api/anomalies?majgrp=${sector}&mode=${mode}`);
                const data = await response.json();
                if (data.success) {
                    setAnomalies(data.anomalies);
                    setFilteredAnomalies(data.anomalies);
                } else {
                    setError('No anomalies found or an error occurred.');
                }
            }
        } catch (err) {
            setError('Failed to fetch anomalies. Please try again.');
            console.error(err);
        } finally {
            setLoadingSector(false);
        }

        try {
            if (mode === 'Stats') {
                setLoadingSector2(true);
                setError2('');
                setStatsData([]);
                const response = await fetch(`/api/anomalies?majgrp=${sector2}&mode=${mode}`);
                const data = await response.json();
                if (data.success) {
                    //replace the state abbreviations with full names
                    const fullStats = Object.keys(data.stats[1]).reduce((acc, key) => {
                        // Replace state abbreviation with full name
                        acc[states[key] || key] = data.stats[1][key];
                        return acc;
                    }, {});
                    setStatsData([data.stats[0], fullStats]);
                } else {
                    setError2('No stats found or an error occurred.');
                }
            }
        } catch (err) {
            setError2('Failed to fetch stats. Please try again.');
            console.error(err);
        } finally {
            setLoadingSector2(false);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        setFilteredAnomalies(
            anomalies.filter(
                (anomaly) =>
                    anomaly.Name.toLowerCase().includes(query.toLowerCase())
                )
        );
    };

    const handleAnomalyClick = async (anomaly) => {
        setLoadingNp(true);
        setSelectedAnomaly(null);
        setErrorNp('');
        try {
            const response = await fetch(`/api/original?name=${encodeURIComponent(anomaly.Name)}`);
            const data = await response.json();

            if (data.success && data.nonprofit) {
                setSelectedAnomaly({ ...anomaly, _id: data.nonprofit._id });
            } else {
                console.error("Failed to find nonprofit in the original collection.");
                setErrorNp("Could not retrieve additional details for the selected anomaly.");
            }
        } catch (err) {
            console.error("Error fetching original nonprofit data:", err);
            setErrorNp("An error occurred while fetching additional details.");
        } finally {
            setLoadingNp(false);
        }
    };

    return (
        <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-[#F2C8ED]" : "text-[#DB7093]"}`}>
                Anomaly Detection
            </h3>

            <p className="mb-6">
            <br />
                This tool leverages the isolation forest machine learning algorithm to identify potential anomalies in a nonprofit&apos;s financial data. 
                When the anomaly score computed by our algorithm is significantly negative, it indicates that some data points may be an outlier during a certain time period for an individual nonprofit. 
                Search by a full NTEE code sector and the results will include all nonprofits nationally. 
                Then explore each nonprofit&apos;s individual profile page.
            </p>

            <p className="mb-6">
                Please note, these predictions provide insight into irregularities but are not definitive assessments nor 
                should they be classified as negative. The algorithm will identify some significant change 
                in key fiscal variables. Always conduct further research before making critical decisions based on these results.
            </p> 
            {/* All Anomalies Mode */}
            <div className={`max-w-4xl mx-auto p-8 mb-12 ${isDarkMode ? "bg-[#171821] text-white border-[#2C2D33]" : "bg-white text-black border-gray-200"} rounded-lg shadow-xl border-2 mt-12`}>
                <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#F2C8ED]' : 'text-[#DB7093]'}`}>Sector-Wide Anomaly Detection</h2>
                <p className="text-center pb-8">
                    Identify nonprofits with potentially anomalous financial data within a selected NTEE sector. View detailed financial information for each identified nonprofit.
                </p>
                <div className="flex flex-col gap-6">
                  <select
                    value={sector}
                    onChange={(e) => {
                        setSector(e.target.value);
                    }}
                    className={`p-4 border  ${isDarkMode ? "bg-[#34344c] text-white border-gray-600" : "bg-[#F1F1F1] text-black border-gray-200"} rounded-lg w-full`}
                  >
                    {majorGroups.map((group) => (
                      <option key={group.value} value={group.value} className="text-black">
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    fetchAnomalies('Nonprofits');
                  }}
                  className={`py-4 mt-6 px-6 rounded-lg font-bold w-full ${
                    isFetchSectorDisabled() || isLoading
                      ? isDarkMode
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-[#D8D8D8] cursor-not-allowed"
                      : isDarkMode
                      ? 'bg-[#D9B4D5] hover:bg-[#F2C8ED] transition duration-300'
                      : 'bg-[#C56484] hover:bg-[#DB7093] transition duration-300'
                  }`}
                  disabled={isFetchSectorDisabled() || isLoading}
                >
                    Fetch
                </button>
            {loadingSector && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
            {error && <div className="text-center text-lg text-red-400 mt-6">Error: {error}</div>}
                
            {anomalies.length > 0 && !loadingSector && !error && (
                <>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search nonprofits"
                        className={`w-full p-2 mb-4 mt-6 rounded ${
                            isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                        } focus:outline-none focus:ring-1 focus:ring-[#F2C8ED] border-white border-2`}
                    />
                    <ul className="mb-4 max-h-60 overflow-y-auto border rounded p-4 w-full">
                        {filteredAnomalies.map((anomaly, index) => (
                            <li
                                key={index}
                                className="mb-2 cursor-pointer hover:bg-gray-200 hover:text-black p-2 rounded"
                                onClick={() => handleAnomalyClick(anomaly)}
                            >
                                <strong>{anomaly.Name}</strong>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {loadingNp && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
            {errorNp && <div className="text-center text-lg text-red-400 mt-6">Error: {errorNp}</div>}

            {selectedAnomaly && !loadingNp && !errorNp && !loadingSector && !error ? (
              <>
                <p className="mt-1 text-center">
                  <a
                    href={`/nonprofit/${selectedAnomaly._id}`}
                    className={`text hover:underline ${isDarkMode ? 'text-[#F2C8ED]' : 'text-[#DB7093]'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedAnomaly.Name}
                  </a>, located in {states[selectedAnomaly.State]}, was identified as a financial anomaly based on its {selectedAnomaly.MostRecentYear} financials.
                </p>
                <div className="flex justify-center gap-8 w-full mt-8">
                  {[
                    { title: "REVENUES", value: selectedAnomaly.TotRev_MostRecent },
                    { title: "EXPENSES", value: selectedAnomaly.TotExp_MostRecent },
                    { title: "ASSETS", value: selectedAnomaly.TotAst_MostRecent },
                    { title: "LIABILITIES", value: selectedAnomaly.TotLia_MostRecent },
                    { 
                      title: "ANOMALY SCORE", 
                        value: (() => {
                          const score = selectedAnomaly.AnomalyScore;
                          if (score === 0) return "0"; // Handle special case for zero
                          const scientific = score.toExponential(); // Convert to scientific notation
                          const coefficient = parseFloat(scientific.split('e')[0]); // Extract coefficient
                          return coefficient.toFixed(1); // Format to one decimal place
                        })()
                    },
                  ].map((data, index) => {
                    // Format large values with abbreviations for consistency
                    const formattedValue = index < 4
                      ? data.value >= 1e12 ? `${(data.value / 1e12).toFixed(1)}T` :
                        data.value >= 1e9 ? `${(data.value / 1e9).toFixed(1)}B` :
                        data.value >= 1e6 ? `${(data.value / 1e6).toFixed(1)}M` :
                        data.value >= 1e3 ? `${(data.value / 1e3).toFixed(1)}K` :
                        Math.round(data.value).toLocaleString()
                      : data.value; // No formatting for anomaly score, already processed

                    // Determine font size based on the formatted value length
                    const fontSizeClass = formattedValue.length > 6 ? 'text-sm' : 'text-xl';

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`border-4 w-28 h-28 rounded-full flex items-center justify-center font-bold text-center overflow-hidden bg-[#DB7093]
                          ${isDarkMode ? "border-white" : "border-black"}`}>
                          <span className={fontSizeClass}>
                            {index < 4 ? `$${formattedValue}` : formattedValue}
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          {data.title.split(" ").map((word, i) => (
                            <React.Fragment key={i}>
                              {word}
                              <br />
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
            </div>
            {/* Charts mode */}
            <div className={`max-w-4xl mx-auto p-8 mb-12 ${isDarkMode ? "bg-[#171821] text-white border-[#2C2D33]" : "bg-white text-black border-gray-200"} rounded-lg shadow-xl border-2 mt-12`}>
                <h2 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#F2C8ED]' : 'text-[#DB7093]'}`}>Anomalies By State</h2>
                <p className="text-center pb-8">
                    Visualize the distribution of identified financial anomalies across different states.
                </p>
                <div className="flex flex-col gap-6">
                  <select
                    value={sector2}
                    onChange={(e) => {
                        setSector2(e.target.value);
                    }}
                    className={`p-4 border  ${isDarkMode ? "bg-[#34344c] text-white border-gray-600" : "bg-[#F1F1F1] text-black border-gray-200"} rounded-lg w-full`}
                  >
                    {majorGroups.map((group) => (
                      <option key={group.value} value={group.value} className="text-black">
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    fetchAnomalies('Stats');
                  }}
                  className={`py-4 mt-6 px-6 rounded-lg font-bold w-full ${
                    isFetchSector2Disabled()
                      ? isDarkMode
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-[#D8D8D8] cursor-not-allowed"
                      : isDarkMode
                      ? 'bg-[#D9B4D5] hover:bg-[#F2C8ED] transition duration-300'
                      : 'bg-[#C56484] hover:bg-[#DB7093] transition duration-300'
                  }`}
                  disabled={isFetchSector2Disabled()}
                >
                    View
                </button>
                {loadingSector2 && <div className="text-center text-lg text-gray-400 mt-6"><SearchLoadingComponent/></div>}
                {error2 && <div className="text-center text-lg text-red-400 mt-6">Error: {error2}</div>}
                {statsData.length > 0 && !loadingSector2 && !error2 && (
                    <div>
                        <p className="mt-6 text-center">
                            The search found {statsData[0]} anomalies in this sector using each nonprofit&apos;s most recent financial data.
                        </p>
                        <div>
                            <h2 className="mt-6 text-center">States with the most anomalies in the selected sector</h2>
                            < TopStatesChart states={statsData[1]} isDarkMode={isDarkMode} />
                        </div>
                    </div>
                )}   
            </div>
        </div>
    );
}

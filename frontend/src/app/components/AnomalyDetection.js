'use client';

import React, { useState } from 'react';
import ntee_codes from "./ntee";

export default function AnomalyDetection({ isDarkMode }) {
    const [nteeCode, setNteeCode] = useState('');
    const [anomalies, setAnomalies] = useState([]);
    const [filteredAnomalies, setFilteredAnomalies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    const [error, setError] = useState('');

    const handleNteeChange = (event) => {
        setNteeCode(event.target.value);
    };

    const fetchAnomalies = async () => {
        try {
            if (!nteeCode) {
                setError('Please select a major group letter.');
                return;
            }

            setError('');
            const response = await fetch(`/api/anomalies?majgrp=${nteeCode}`);
            const data = await response.json();

            if (data.success) {
                setAnomalies(data.anomalies);
                setFilteredAnomalies(data.anomalies);
            } else {
                setError('No anomalies found or an error occurred.');
            }
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error(err);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        setFilteredAnomalies(
            anomalies.filter(
                (anomaly) =>
                    anomaly.Name.toLowerCase().includes(query) ||
                    anomaly.State.toLowerCase().includes(query) ||
                    anomaly.MostRecentYear.toString().includes(query)
            )
        );
    };

    const handleAnomalyClick = async (anomaly) => {
        try {
            const response = await fetch(`/api/original?name=${encodeURIComponent(anomaly.Name)}`);
            const data = await response.json();

            if (data.success && data.nonprofit) {
                setSelectedAnomaly({ ...anomaly, _id: data.nonprofit._id });
            } else {
                console.error("Failed to find nonprofit in the original collection.");
                setError("Could not retrieve additional details for the selected anomaly.");
            }
        } catch (err) {
            console.error("Error fetching original nonprofit data:", err);
            setError("An error occurred while fetching additional details.");
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
                Please note, these predictions provide insight into irregularities but are not definitive assessments. 
                Always conduct further research before making critical decisions based on these results.
            </p>

            <div className="flex justify-center">
                <div className="w-1/3 pr-4">
                    <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4`}>
                        <h4 className="text-lg font-semibold mb-4">Select Major Group</h4>
                        <select
                            value={nteeCode}
                            onChange={handleNteeChange}
                            className={`mt-2 w-full ${
                                isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                            } p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8] appearance-none`}
                        >
                            <option value="" disabled>Select Major Group</option>
                            {Object.entries(ntee_codes).map(([code, description]) => (
                                <option
                                    key={code}
                                    value={code}
                                    className={`${
                                        isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                                    } hover:bg-[#353637] hover:text-[#A9DFD8] p-2`}
                                >
                                    {code} - {description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={fetchAnomalies}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-10 w-full"
                    >
                        Fetch Anomalies
                    </button>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {anomalies.length > 0 && (
                        <>
                            <h4 className="text-lg font-semibold mb-4">Anomalies Detected</h4>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search anomalies..."
                                className={`w-full p-2 mb-4 rounded ${
                                    isDarkMode ? "bg-[#171821] text-white" : "bg-[#e0e0e0] text-black"
                                } focus:outline-none focus:ring-1 focus:ring-[#A9DFD8] border-white border-2`}
                            />
                            <ul className="mb-4 max-h-60 overflow-y-auto border rounded p-4 w-full">
                                {filteredAnomalies.map((anomaly, index) => (
                                    <li
                                        key={index}
                                        className="mb-2 cursor-pointer hover:bg-gray-200 hover:text-black p-2 rounded"
                                        onClick={() => handleAnomalyClick(anomaly)}
                                    >
                                        <strong>{anomaly.Name}</strong> - {anomaly.State} ({anomaly.MostRecentYear})
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className={`w-1/4 ${isDarkMode ? "bg-[#21222D]" : "bg-[#f1f1f1]"} rounded-lg p-4`}>
                    {selectedAnomaly ? (
                        <>
                            <h4 className="text-lg font-semibold mb-4">Numerical Results</h4>
                            <ul className="space-y-2">
                                {Object.entries(selectedAnomaly).map(([key, value]) => {
                                    if (key === "Name") {
                                        return (
                                            <li key={key}>
                                                <strong>{key}:</strong>{" "}
                                                <a
                                                    href={`/nonprofit/${selectedAnomaly._id}`}
                                                    className="text-blue-500 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {value}
                                                </a>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-500">
                            Select a major group, fetch anomalies, and click on an anomaly to view details here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

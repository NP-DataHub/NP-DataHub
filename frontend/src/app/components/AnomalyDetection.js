'use client';

import React, { useState } from 'react';

export default function AnomalyDetection({isDarkMode}) {
    const [majorGroup, setMajorGroup] = useState('');
    const [anomalies, setAnomalies] = useState([]);
    const [error, setError] = useState('');

    const fetchAnomalies = async () => {
        try {
            if (!majorGroup) {
                setError('Please select a major group letter.');
                return;
            }

            setError('');
            const response = await fetch(`/api/anomalies?majgrp=${majorGroup}`);
            const data = await response.json();

            if (data.success) {
                setAnomalies(data.anomalies);
            } else {
                setError('No anomalies found or an error occurred.');
            }
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error(err);
        }
    };

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(anomalies, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `anomalies_major_group_${majorGroup}.json`;
        link.click();
    };

    return (
        <div className={`p-6 ${isDarkMode ? "bg-[#171821] text-white" : "bg-[#ffffff] text-black"} rounded-lg`}>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#FEB95A]' : 'text-[#FFAA00]'}`}>Anomaly Detection</h3>

            <p className="mb-6">
                This tool leverages the Isolation Forest machine learning algorithm to identify potential anomalies in nonprofits&apos; financial data. 
                These predictions provide insight into irregularities but are not definitive assessments. Always conduct further research before making critical decisions based on these results.
            </p>
            
            <p className="mb-6">
                Select a major group to retrieve and analyze anomalies in nonprofit financial data. You can download the full numerical results as a JSON file.
            </p>

            <div className="mb-4">
                <label className="block mb-2">Major Group Letter:</label>
                <input
                    type="text"
                    value={majorGroup}
                    onChange={(e) => setMajorGroup(e.target.value.toUpperCase())}
                    maxLength={1}
                    className={`p-2 rounded border ${isDarkMode ? 'bg-[#34344c] text-white border-gray-600' : 'bg-[#e0e0e0] text-black border-gray-200'}`}
                    placeholder="Enter a letter (A-Z)"
                />
            </div>

            <button
                onClick={fetchAnomalies}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
            >
                Fetch Anomalies
            </button>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {anomalies.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold mb-4">Anomalies Detected</h4>
                    <ul className="mb-4 max-h-60 overflow-y-auto border rounded p-4">
                        {anomalies.map((anomaly, index) => (
                            <li key={index} className="mb-2">
                                <strong>{anomaly.Name}</strong> - {anomaly.State} ({anomaly.MostRecentYear})
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={downloadJson}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Download JSON
                    </button>
                </div>
            )}
        </div>
    );
}




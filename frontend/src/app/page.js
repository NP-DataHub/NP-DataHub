"use client";
import Sidebar from "./components/Sidebar";
import BasicBarChart from "./components/BasicBarChart";
import LineCompareChart from "./components/LineCompareChart";
import DashboardNavbar from "./components/dashboardNav";
import React, { useState } from 'react';

export default function Dashboard() {
    const [state, setState] = useState('');
    const [nteeCode, setNteeCode] = useState('');
    const [subNteeCode, setSubNteeCode] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const variable1 = "Revenue";
    const values1 = [52,64,73,67,86,95];
    const variable2 = "Expenses";
    const values2 = [70,55,58,63,69,80];
    const style = { height: 306, width: 515 };

    const handleSearch = () => {
      // Implement your search logic here
      console.log('Searching with:', { state, nteeCode, subNteeCode });
  
      // Mock search results data
      const results = [
        {
          nonprofitName: 'ALBANY MEDICAL NETWORK',
          address: '123 Main Street',
          city: 'Albany',
          state: 'NY',
          zip: '12345',
          annualRev: '$17,564,456.12',
          annualExpenses: '$16,567,435.21'
        },
        {
            nonprofitName: 'ALBANY MEDICAL NETWORK',
            address: '123 Main Street',
            city: 'Albany',
            state: 'NY',
            zip: '12345',
            annualRev: '$17,564,456.12',
            annualExpenses: '$16,567,435.21'
        }
        // Add more results as needed
      ];
  
      setSearchResults(results);
    };
  
    return(
        <div>
            <div className = "flex dashboard-color text-white font-sans">
                <Sidebar/>
                <div className = "flex-col w-screen">
                    <DashboardNavbar/>
                    <div className = "flex justify-center  m-8 text-2xl font-sans font-semibold">
                        <h1>CHOOSE FROM A SUITE OF ANALYTICAL TOOLS</h1>
                    </div>
                    <div className = "flex-col mx-10 font-sans">
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl text-center font-semibold mb-2">HISTORICAL PERFORMANCE</h2>
                                <p className="text-center mb-2">Plan: add percent change to hover, add variable selection, modify styling</p>
                                <div className = "flex justify-center">
                                  <BasicBarChart variable={variable1} values={values1} style={style}/>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center ">VARIABLE COMPARE</h2>
                                <p className="text-center mb-2">Plan: add percent difference on hover, add variable selection, modify styling</p>
                                <div className = "flex justify-center">
                                  <LineCompareChart variable1={variable1} variable2={variable2} values1={values1} values2={values2} style={style}/>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center">Comparision section</h2>
                                <div className = "flex justify-center">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "flex justify-center  m-8 text-2xl font-sans font-semibold">
                        <h1>BEGIN YOUR SEARCH</h1>
                    </div>
                    <div className="flex-col mx-10 font-sans mb-10">
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ">
                            <select 
                                className="mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]" 
                                value={state} 
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Select State</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </select>
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <input 
                                type="text" 
                                className="mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]" 
                                placeholder="Enter NTEE Code"
                                value={nteeCode}
                                onChange={(e) => setNteeCode(e.target.value)}
                            />
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <input 
                                type="text" 
                                className="mt-2 w-full bg-[#171821] text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-[#A9DFD8]" 
                                placeholder="Enter Sub NTEE Code"
                                value={subNteeCode}
                                onChange={(e) => setSubNteeCode(e.target.value)}
                            />
                            </div>
                            <div className="bg-[#21222D] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                            <button 
                                className="bg-[#A9DFD8] text-black font-semibold py-2 px-4 rounded hover:bg-[#88B3AE] transition-colors duration-300"
                                onClick={handleSearch}
                            >
                                SEARCH
                            </button>
                            </div>
                            {searchResults && (
                                <div className="mt-10 bg-[#21222D] p-4 rounded-lg shadow-md mx-10 w-screen max-w-max">
                                <div className="grid grid-cols-7 gap-4 mb-4 font-semibold text-sm text-center">
                                    <div>NONPROFIT NAME</div>
                                    <div>ADDRESS</div>
                                    <div>CITY</div>
                                    <div>STATE</div>
                                    <div>ZIP</div>
                                    <div>ANNUAL REV.</div>
                                    <div>ANNUAL EXPENSES</div>
                                </div>
                                {searchResults.map((result, index) => (
                                    <div key={index} className="grid grid-cols-7 gap-4 text-sm mb-2 text-center">
                                    <div><a href="nonprofit">{result.nonprofitName}</a></div>
                                    <div>{result.address}</div>
                                    <div>{result.city}</div>
                                    <div>{result.state}</div>
                                    <div>{result.zip}</div>
                                    <div>{result.annualRev}</div>
                                    <div>{result.annualExpenses}</div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                        </div>

                </div>
            </div>
        </div>
    );
}

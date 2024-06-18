"use client"
import Sidebar from "./components/Sidebar";
import BasicBarChart from "./components/BasicBarChart"
import DashboardNavbar from "./components/dashboardNav";
import React, { useState } from 'react';

export default function Dashboard() {
    const [state, setState] = useState('');
    const [nteeCode, setNteeCode] = useState('');
    const [subNteeCode, setSubNteeCode] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const variable = "Revenue"
    const values = [52,64,73,67,86,95];
    const style = { height: 306, width: 515 }

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
                                  <BasicBarChart variable={variable} values={values} style={style}/>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center ">VARIABLE COMPARE</h2>
                                <div className = "flex justify-center">
                                    <svg  width="515" height="306" viewBox="0 0 215 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99623 9.02717C11.5503 13.8053 31.0025 23.3614 32.3783 23.3614C33.7541 23.3614 40.5948 23.3614 43.8432 23.3614L71.9323 15.3342L96.0086 30.2418H109.767L133.843 13.0408L145.881 17.0543L182.569 42.2826L191.167 38.269L212.378 1" stroke="#A9DFD8" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M32.3783 23.9349L1.99623 9.60066V71.4998H212.951V0.999756L190.956 38.9998L182.569 42.8561L145.881 17.6278L133.843 13.6142L109.767 30.8153H102.888H96.0086L71.9323 15.9077L43.8432 23.9349H32.3783Z" fill="url(#paint0_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="9" r="2" fill="#A9DFD8"/>
                                        <circle cx="31.9913" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="43.9883" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="70.9825" cy="15" r="2" fill="#A9DFD8"/>
                                        <circle cx="95.9767" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="109.974" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="133.969" cy="13" r="2" fill="#A9DFD8"/>
                                        <circle cx="145.966" cy="17" r="2" fill="#A9DFD8"/>
                                        <circle cx="182.958" cy="42" r="2" fill="#A9DFD8"/>
                                        <circle cx="190.957" cy="38" r="2" fill="#A9DFD8"/>
                                        <circle cx="211.952" cy="2" r="2" fill="#A9DFD8"/>
                                        <path d="M1.99623 52.7894L18.6204 51.0693L40.977 40.1753L70.7858 71.1372H102.314L138.429 60.2432L184.289 63.1101L212.378 43.0421" stroke="#F2C8ED" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M18.6204 51.6426L1.99623 53.3627V106H212.951V43.042L184.289 63.6833L161.962 62L137.967 60.5L102.314 71.7105H70.4815L40.977 40.7485L18.6204 51.6426Z" fill="url(#paint1_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="53" r="2" fill="#F2C8ED"/>
                                        <circle cx="17.9943" cy="51" r="2" fill="#F2C8ED"/>
                                        <circle cx="40.9894" cy="40" r="2" fill="#F2C8ED"/>
                                        <circle cx="70.9825" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="101.976" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="137.968" cy="60" r="2" fill="#F2C8ED"/>
                                        <circle cx="183.958" cy="63" r="2" fill="#F2C8ED"/>
                                        <circle cx="212.952" cy="42" r="2" fill="#F2C8ED"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1237_654" x1="105.474" y1="-3.88177" x2="106.95" y2="78.4434" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#A9DFD8"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_1237_654" x1="105.974" y1="37.1053" x2="106.465" y2="106.496" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F2C8ED"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-2 text-center">NETWORKS + PATHS</h2>
                                <div className = "flex justify-center">
                                    <svg  width="515" height="306" viewBox="0 0 215 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.99623 9.02717C11.5503 13.8053 31.0025 23.3614 32.3783 23.3614C33.7541 23.3614 40.5948 23.3614 43.8432 23.3614L71.9323 15.3342L96.0086 30.2418H109.767L133.843 13.0408L145.881 17.0543L182.569 42.2826L191.167 38.269L212.378 1" stroke="#A9DFD8" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M32.3783 23.9349L1.99623 9.60066V71.4998H212.951V0.999756L190.956 38.9998L182.569 42.8561L145.881 17.6278L133.843 13.6142L109.767 30.8153H102.888H96.0086L71.9323 15.9077L43.8432 23.9349H32.3783Z" fill="url(#paint0_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="9" r="2" fill="#A9DFD8"/>
                                        <circle cx="31.9913" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="43.9883" cy="23" r="2" fill="#A9DFD8"/>
                                        <circle cx="70.9825" cy="15" r="2" fill="#A9DFD8"/>
                                        <circle cx="95.9767" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="109.974" cy="30" r="2" fill="#A9DFD8"/>
                                        <circle cx="133.969" cy="13" r="2" fill="#A9DFD8"/>
                                        <circle cx="145.966" cy="17" r="2" fill="#A9DFD8"/>
                                        <circle cx="182.958" cy="42" r="2" fill="#A9DFD8"/>
                                        <circle cx="190.957" cy="38" r="2" fill="#A9DFD8"/>
                                        <circle cx="211.952" cy="2" r="2" fill="#A9DFD8"/>
                                        <path d="M1.99623 52.7894L18.6204 51.0693L40.977 40.1753L70.7858 71.1372H102.314L138.429 60.2432L184.289 63.1101L212.378 43.0421" stroke="#F2C8ED" stroke-width="1.14674" stroke-linecap="round"/>
                                        <path d="M18.6204 51.6426L1.99623 53.3627V106H212.951V43.042L184.289 63.6833L161.962 62L137.967 60.5L102.314 71.7105H70.4815L40.977 40.7485L18.6204 51.6426Z" fill="url(#paint1_linear_1237_654)"/>
                                        <circle cx="1.99721" cy="53" r="2" fill="#F2C8ED"/>
                                        <circle cx="17.9943" cy="51" r="2" fill="#F2C8ED"/>
                                        <circle cx="40.9894" cy="40" r="2" fill="#F2C8ED"/>
                                        <circle cx="70.9825" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="101.976" cy="71" r="2" fill="#F2C8ED"/>
                                        <circle cx="137.968" cy="60" r="2" fill="#F2C8ED"/>
                                        <circle cx="183.958" cy="63" r="2" fill="#F2C8ED"/>
                                        <circle cx="212.952" cy="42" r="2" fill="#F2C8ED"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_1237_654" x1="105.474" y1="-3.88177" x2="106.95" y2="78.4434" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#A9DFD8"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_1237_654" x1="105.974" y1="37.1053" x2="106.465" y2="106.496" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F2C8ED"/>
                                        <stop offset="1" stop-color="#1D1E26" stop-opacity="0"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
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

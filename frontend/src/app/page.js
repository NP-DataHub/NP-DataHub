"use client";
import Sidebar from "./components/Sidebar";
import BarChart from "./components/BarChart";
import LineCompareChart from "./components/LineCompareChart";
import DashboardNavbar from "./components/dashboardNav";
import TimeSeries from "./components/TimeSeries";
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
        },
        {
            nonprofitName: 'Emmets Baller Nonprofit',
            address: 'The Moon',
            city: 'Moon City',
            state: 'Luxurious',
            zip: '100000',
            annualRev: '$ all the money $',
            annualExpenses: '$ like 4 dollars $'
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
                                  <BarChart variable={variable1} values={values1} style={style}/>
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
                                <h2 className="text-xl font-semibold mb-2 text-center">TIME SERIES</h2>
                                <p className="text-center mb-2">TO DO: Add in 2 years of predictions, and add a conf int 95% with shaded "triangle". Also, see bar chart to do.</p>
                                <div className = "flex justify-center">
                                    <TimeSeries variable={variable1} values={values1} style={style}/>
                                    
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
      </section>
      <section className="min-h-screen bg-gray-900 text-white px-6 md:px-12 font-serif  sm:py-40">
        <div className="flex flex-col justify-start text-center">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">Connecting billions of data points</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-24 md:w-4/12 rounded-full h-1 bg-white"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mx-auto mt-12">
          <div className="flex flex-col items-center text-center">
            <img draggable = {false} src="/img/graph_final.png" alt="Image 1" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">1.7 million</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Number of U.S. nonprofits</p>
          </div>
          <div className="flex flex-col items-center text-center mt-8 sm:mt-0">
            <img draggable = {false} src="/img/stack_final.png" alt="Image 2" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">3</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Data visualization platforms offered</p>
          </div>
          <div className="flex flex-col items-center text-center  mt-8 sm:mt-0 pb-24 sm:pb-0">
            <img draggable = {false} src="/img/dash_final.png" alt="Image 3" className="w-1/3 max-w-full mx-auto" />
            <h3 className="text-2xl md:text-4xl mt-4">100+</h3>
            <p className="text-lg md:text-xl mt-2 font-sans">Algorithmic insights for key financial nonprofits variables</p>
          </div>
        </div>
      </section>
      <section className="min-h-screen bg-white text-gray-900 px-6 md:px-12 py-20 lg:py-40 font-serif sm:py-40">
        <div className="flex flex-col justify-start text-center">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6">The NP Data Hub Team</h2>
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="w-24 md:w-96 rounded-full h-1 bg-gray-900"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 gap-y-8 md:gap-4 md:gap-y-10 mx-auto mt-12">
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/brettorzechowski/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/profo.png" alt="Image 1" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile " />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Brett Orzechowski</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/troy-schipf-75388624a/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/troy.png" alt="Image 2" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Troy Schipf</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/thomasorifici/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/thomas.jpg" alt="Image 3" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Thomas Orifici</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://www.linkedin.com/in/macallan-ringstad-404298251/" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/macallan.jpeg" alt="Image 4" className="w-80 h-80 mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">Macallan Ringstad</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/john_smith.jpg" alt="Image 5" className="max-w-full mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">John Smith</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/john_smith.jpg" alt="Image 6" className="max-w-full mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">John Smith</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/john_smith.jpg" alt="Image 7" className="max-w-full mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">John Smith</h3>
          </div>
          <div className="flex flex-col items-center text-center">
            <a href="https://en.wikipedia.org/wiki/John_Smith_(explorer)" target="_blank" rel="noopener noreferrer">
              <img draggable = {false} src="/img/john_smith.jpg" alt="Image 8" className="max-w-full mx-auto border border-gray-900 rounded-xl even-shadow profile" />
            </a>
            <h3 className="text-xl md:text-2xl mt-4">John Smith</h3>
          </div>
        </div>
      </section>   
      <section className="flex flex-col lg:flex-row justify-between items-center min-h-screen bg-cover bg-center bg-[url('/img/gradient_two.png')] px-6 lg:px-12  py-40">
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-3xl lg:text-6xl font-bold text-gray-900 font-serif">
            Ready to collaborate?
          </h1>
          <p className="text-lg md:text-2xl mt-2 font-sans">Try any of our three platforms today.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <button className="text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Data
            </button>
            <button className="text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Visualize
            </button>
            <button className="col-span-1 sm:col-span-2 text-lg px-6 py-2 bg-white text-gray-900 rounded-full shadow-md hover:bg-gray-200 transition">
              Ecosystem Insights
            </button>
          </div>
          <div className="flex justify-center md:justify-start items-center mt-8 lg:mt-0 pt-12 md:px-10">
          <img draggable = {false} src="/img/node_edge_final.png" alt="Network Visualization" className="w-1/3 max-w-full max-h-full" />
        </div>
        </div>
        <div className="flex-grow mt-8 lg:mt-0 text-center lg:text-left lg:px-40">
          <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 font-serif">
            Contact Us
          </h3>
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-2 mt-2">
            <div className="text-2xl md:text-4xl mt-2">
              <HiOutlineMail />
            </div>
            <p className="text-sm md:text-2xl mt-2 font-sans">info@np_datahub.com</p>
          </div>
          <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 font-serif mt-10">
            Social
          </h3>
          <div className="flex justify-center lg:justify-start gap-2 mt-2">
            <FaFacebook className="text-2xl md:text-4xl text-gray-900" />
            <FaTwitter className="text-2xl md:text-4xl text-gray-900" />
            <FaInstagramSquare className="text-2xl md:text-4xl text-gray-900" />
          </div>
        </div>
      </section>
    </div>
  );
}

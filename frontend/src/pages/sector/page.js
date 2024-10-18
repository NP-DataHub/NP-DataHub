"use client";
import Sidebar from "@/app/components/Sidebar";
import DashboardNavbar from "@/app/components/dashboardNav";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import Select from 'react-select';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Data viz imports
import ScatterPlot from "@/app/components/charts/ScatterPlot";
import COLAB_graph from "@/app/components/charts/COLAB_graph";

const Sector = () => {

  /**
   * Declare state variables for the page
   * 
   * sectorData: the data for the sector page
   */
  const [sectorData, setSectorData] = useState(null);

  /**
   * Declare selection state variables for the page
   * 
   * selectedState: the selected state for the page
   * selectedCity: the selected city for the page
   * selectedSector: the selected sector for the page, these are the NTEE codes
   * selectedZIP: the selected ZIP code for the page
   * 
   */
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedZIP, setSelectedZIP] = useState(null);
  const [selectedXAxis, setSelectedXAxis] = useState({ value: "TotRev", label: "Total Revenue" });
  const [selectedYAxis, setSelectedYAxis] = useState({ value: "TotExp", label: "Total Expenses" });




  // ---Create the dropdown options for the sector selection dropdowns---
  const stateOptions = [
    { value: "", label: "Select State" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" }
];

  // City, sector (NTEE), and ZIP code options are all unimplemented. They need search functionality.
  const cityOptions = [
    { value: 'San Francisco', label: 'San Francisco' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'San Jose', label: 'San Jose' },
    { value: 'Oakland', label: 'Oakland' },
    { value: 'Sacramento', label: 'Sacramento' }
  ];
  const sectorOptions = [
    { value: 'A', label: 'Arts, Culture, and Humanities' },
    { value: 'B', label: 'Education' },
    { value: 'C', label: 'Environment' },
    { value: 'D', label: 'Animal-Related' },
    { value: 'E', label: 'Health' }
  ];
  const zipOptions = [
    { value: '95060', label: '95060' },
    { value: '95061', label: '95061' },
    { value: '95062', label: '95062' },
    { value: '95063', label: '95063' },
    { value: '95064', label: '95064' }
  ];

  // Variable options for visualization tools
  const varOptions = [
    { value: 'TotRev', label: 'Total Revenue' },
    { value: 'TotExp', label: 'Total Expenses' },
    { value: 'TotAst', label: 'Total Assets' },
    { value: 'TotLia', label: 'Total Liabilities' }
  ];


useEffect(() => {
  // Fetch the sector data based on the filters
  const fetchSectorData = async () => {

    // Set default values to Troy, NY so that we arent fetching the entire database
    const CITY = selectedCity ? selectedCity.value : "Troy";
    const STATE = selectedState ? selectedState.value : "NY";
    const ZIP = selectedZIP ? selectedZIP.value : null;
    const SECTOR = selectedSector ? selectedSector.value : null;

    // Fetch the sector data using the filters via sector.js
    let response = await fetch(`/api/sector?Cty=${CITY}&St=${STATE}&ZIP=${ZIP}&NTEE1=${SECTOR}&NTEE2=${SECTOR}`);
    let filtered_sector_data = await response.json();

    setSectorData(filtered_sector_data);
  }
  

  fetchSectorData();
}, [selectedSector, selectedCity, selectedState, selectedZIP]);

useEffect(() => {
  // There must be a better way to do this
  // Sole purpose is to re-render the scatter plot when the X or Y axis is changed
  // But not to refetch the data
}
, [selectedXAxis, selectedYAxis]);


return (
<div className="flex dashboard-color text-white font-sans h-screen w-screen overflow-auto">
  <Sidebar />
  <div className="flex-col w-10/12 mx-auto dashboard-color">
    <DashboardNavbar />
    <div className="flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
      <h1 className="text-4xl font-semibold">Sector View</h1>
      <span className="text-xl text-[#A0A0A0]">Visualize sector ecosystems to gain financial insight.</span>
    </div>
    <div className="flex-col mx-10 font-sans">
      <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mt-10">
        <h1 className="mb-8" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>ScatterPlot</h1>
        <div className="mb-4 p-4 bg-[#171821] text-white rounded">
          <h2 className="text-lg font-semibold mb-2">How to Use the Filters</h2>
          <p className="text-sm text-[#A0A0A0]">
            BLANK DESCRIPTION
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#6d618c] p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">State Selection</h2>
            <div className="flex items-center">
              <Select
                options={stateOptions}
                value={selectedState}
                onChange={(option) => setSelectedState(option)}
                className="text-black"
              />
              <a data-tooltip-id="my-tooltip" className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200" data-tooltip-content="Tooltip content here.">ℹ️</a>
              <ReactTooltip place="top" effect="solid" id="my-tooltip" />
            </div>
          </div>
          <div className="bg-[#255972] p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">City Selection</h2>
            <div className="flex items-center">
              <Select
                options={cityOptions}
                value={selectedCity}
                onChange={(option) => setSelectedCity(option)}
                className="text-black"
              />
              <a data-tooltip-id="option1-tooltip" className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200" data-tooltip-content="Tooltip content for option 1 here.">ℹ️</a>
              <ReactTooltip place="top" effect="solid" id="option1-tooltip" />
            </div>
          </div>
          <div className="bg-[#2c7787] p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">NTEE Sector Selection</h2>
            <div className="flex items-center">
              <Select
                options={sectorOptions}
                value={selectedSector}
                onChange={(option) => setSelectedSector(option)}
                className="text-black"
              />
              <a data-tooltip-id="option2-tooltip" className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200" data-tooltip-content="Tooltip content for option 2 here.">ℹ️</a>
              <ReactTooltip place="top" effect="solid" id="option2-tooltip" />
            </div>
          </div>
        </div>
        <div className="bg-[#21222D] p-6 rounded-lg" style={{ height: '800px' }}>
          <div className="flex flex-col h-full">
            {sectorData ? (
              <div className="flex-grow">
                <ScatterPlot data={sectorData.data} X_axis_var={selectedXAxis.value} Y_axis_var={selectedYAxis.value} filters={sectorData.filters} />
              </div>
            ) : (
              <div>Loading ScatterPlot...</div>
            )}
            <div className="flex justify-between items-center bg-[#171821] p-2 rounded-lg mt-4">
              <span>Select Financial Variables to compare:</span>
              <div className="flex space-x-4">
                <Select
                  options={varOptions}
                  value={selectedXAxis}
                  onChange={(option) => setSelectedXAxis(option)}
                  className="text-black"
                />
                <Select
                  options={varOptions}
                  value={selectedYAxis}
                  onChange={(option) => setSelectedYAxis(option)}
                  className="text-black"
                />
              </div>
            </div>
            <div className="mt-4 p-3 w-full bg-[#171821] text-white rounded">
              Filter by NTEE code, city, state, or ZIP code to see how nonprofits in different sectors compare across different financial metrics.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h1 className="mb-4" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>COLAB Tool</h1>
          <div className="mb-4 p-4 bg-[#171821] text-white rounded">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-[#A0A0A0]">
              BLANK DESCRIPTION
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-auto" style={{ height: '600px' }}>
              <h1 className="mb-4" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>COLAB Graph</h1>
              <div className="flex flex-col h-full">
                {sectorData ? (
                  <COLAB_graph data={sectorData.data} filters={[]} className="flex-grow" />
                ) : (
                  <div>Loading COLAB Graph...</div>
                )}
                <div className="mt-4 p-2 w-full bg-[#171821] text-white rounded">
                  BLANK DESCRIPTION
                </div>
              </div>
            </div>
            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h1 className="mb-4" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>COLAB Table</h1>
              <div className="flex flex-col h-full">
                <div className="flex-grow bg-[#171821] text-white rounded">
                  {/* Add in table component once developed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default Sector;
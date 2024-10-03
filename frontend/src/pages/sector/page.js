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


  // Create the dropdown options for the sector selection dropdowns

  /**
   * THIS IS NOT DONE YET - NEED TO ADD SEARCH FUNCTIONALITY
   *  - Emmet W.
   */
  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'WA', label: 'Washington' }
  ];
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
  // Currently unimplemented
  const zipOptions = [
    { value: '95060', label: '95060' },
    { value: '95061', label: '95061' },
    { value: '95062', label: '95062' },
    { value: '95063', label: '95063' },
    { value: '95064', label: '95064' }
  ];


useEffect(() => {
  // Fetch the sector data based on the filters
  const fetchSectorData = async () => {

    // Currently query supports NTEE1, NTEE2, CITY, ZIP, and STATE 

    const NTEE1 = selectedSector ? selectedSector.value : null;
    const NTEE2 = null;
    const ZIP = selectedZIP ? selectedZIP.value : "95060";
    const CITY = selectedCity ? selectedCity.value : "Santa Cruz";
    const STATE = selectedState ? selectedState.value : "CA";


    // Fetch the sector data using the filters via sector.js
    let response = await fetch(`/api/sector?Cty=${CITY}`);
    let filtered_sector_data = await response.json();

    console.log("Sector Data fetch results:");
    console.log(response);
    console.log(filtered_sector_data); // probably cooked beyond repair...

    setSectorData(filtered_sector_data);
  }

  fetchSectorData();
}, [selectedSector, selectedCity, selectedState, selectedZIP]);


return (
  <div className="flex dashboard-color text-white font-sans h-screen w-screen">
  <Sidebar />
  <div className="flex-col w-10/12 mx-auto dashboard-color">
    <DashboardNavbar />
    <div className="flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
      <h1 className="text-2xl font-semibold">Sector View</h1>
      <span className="text-sm text-[#A0A0A0]">Super epic tools to visualize anything you could possibly want to see.</span>
    </div>
    <div className="flex-col mx-10 font-sans">
      <div className="grid grid-cols-4 gap-4 mt-10 h-400px">
        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <h1 className="mb-8" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>State Selection</h1>
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
        </div>
        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <h1 className="mb-8" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>City Selection</h1>
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
        </div>
        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <h1 className="mb-8" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>NTEE Sector Selection</h1>
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
        <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <h1 className="mb-8" style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>New Selection Tool</h1>
            <div className="flex items-center">
              <Select
                options={[]}
                value={[]}
                onChange={(option) => setSelectedNew(option)}
                className="text-black"
              />
              <a data-tooltip-id="option3-tooltip" className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200" data-tooltip-content="Tooltip content for option 3 here.">ℹ️</a>
              <ReactTooltip place="top" effect="solid" id="option3-tooltip" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        { sectorData ? <ScatterPlot data={sectorData.data} filters={sectorData.filters} /> : <div>Loading...</div> }
      </div>
    </div>
  </div>
</div>
);
};

export default Sector;
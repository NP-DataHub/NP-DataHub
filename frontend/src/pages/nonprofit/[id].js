"use client";
import Sidebar from "@/app/components/Sidebar";
import DashboardNavbar from "@/app/components/dashboardNav";
import BarChart from "@/app/components/charts/BarChart";
import LineCompareChart from "@/app/components/charts/LineCompareChart";
import TimeSeries from "@/app/components/charts/TimeSeries";
import StackChart from "@/app/components/charts/StackChart";
import Gauge from "@/app/components/charts/Gauge";
import Choropleth from "@/app/components/charts/Choropleth";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '@/app/globals.css';
import { AuthProvider } from "@/app/components/context";
import Select from 'react-select';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaInfoCircle } from "react-icons/fa";
import Footer from "@/app/components/dashboard_footer";


const Nonprofit = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("ID: ",id)
  const [nonprofitData, setNonprofitData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); 

  const [selectedMetric, setSelectedMetric] = useState('TotRev');
  const [selectedComparison, setSelectedComparison] = useState({ variable1: 'TotRev', variable2: 'TotExp' });
  const metricOptions = [
    { value: 'TotRev', label: 'Revenue' },
    { value: 'TotExp', label: 'Expenses' },
    { value: 'TotAst', label: 'Assets' },
    { value: 'TotLia', label: 'Liabilities' },
  ];
  const getValuesForMetric = (metric) => {
    console.log("Metric: ", metric)
    if (metric == 'Total Revenue') {
      metric = 'TotRev'
    }
    if (metric == 'Total Expenses') {
      metric = 'TotExp'
    }
    if (metric == 'Total Assets') {
      metric = 'TotAst'
    }
    if (metric == 'Total Liabilities') {
      metric = 'TotLia'
    }

    return years.map(year => nonprofitData[year][metric]);
  };
  
    // Load the theme from local storage
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
      const darkModeEnabled = savedTheme === "dark";
      setIsDarkMode(darkModeEnabled);
      document.documentElement.classList.toggle("dark", darkModeEnabled);
    }, []);
  
    // Handle theme toggle
    const handleThemeToggle = (newTheme) => {
      setIsDarkMode(newTheme === "dark");
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    };
  
  
  useEffect(() => {
    if (id) {
      // Fetch the nonprofit data using the id
      const fetchNonprofitData = async () => {
        const response = await fetch(`/api/items?_id=${id}`);
        const data = await response.json();
        setNonprofitData(data.data[0]);
        // retrieve state by state sector information
        let sectorResponse = await fetch(`/api/averages?MajGrp=${data.data[0].NTEE[0]}`);
        sectorResponse = await sectorResponse.json();
        let sectorData = sectorResponse.data[0]
        setSectorData(sectorData);
        console.log("Sector Data: ", sectorData);
      };

      fetchNonprofitData();
    }
  }, [id]);

  const LoadingComponent = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  if (!nonprofitData || !sectorData) {
    return <div className='w-screen dashboard-color h-screen'><LoadingComponent /></div>;
  }

  const cumulativeData = {
    TotalRevenue: 0,
    TotalExpenses: 0,
    TotalAssets: 0,
    TotalLiabilities: 0,
    FundraisingExpenses: 0,
  };

  const previousYearData = {
    TotalRevenue: 0,
    TotalExpenses: 0,
    TotalAssets: 0,
    TotalLiabilities: 0,
    FundraisingExpenses: 0,
  };

  const years = Object.keys(nonprofitData).filter(year => !isNaN(year)).sort();
  const mostRecentYear = years[years.length - 1];
  const minYear = years[0];
  const previousYear = years[years.length - 2];

  const sectorYears = Object.keys(sectorData).filter(year => !isNaN(year)).sort();
  const mostRecentSectorYear = sectorYears[sectorYears.length - 1];
  const previousSectorYear = sectorYears[sectorYears.length - 2];

  if (mostRecentYear) {
    const yearData = nonprofitData[mostRecentYear];
    cumulativeData.TotalRevenue = yearData['TotRev'] || 0;
    cumulativeData.TotalExpenses = yearData['TotExp'] || 0;
    cumulativeData.TotalAssets = yearData['TotAst'] || 0;
    cumulativeData.TotalLiabilities = yearData['TotLia'] || 0;
    cumulativeData.FundraisingExpenses = yearData['FunExp'] || 0;
  }

  if (previousYear) {
    const yearData = nonprofitData[previousYear];
    previousYearData.TotalRevenue = yearData['TotRev'] || 0;
    previousYearData.TotalExpenses = yearData['TotExp'] || 0;
    previousYearData.TotalAssets = yearData['TotAst'] || 0;
    previousYearData.TotalLiabilities = yearData['TotLia'] || 0;
    previousYearData.FundraisingExpenses = yearData['FunExp'] || 0;
  }

  const calculateDiff = (current, previous) => {
    if (previous === 0) return '+0%';
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  const capitalizeFirstLetter = (str) => {
    return str.split(' ')
        .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const indicators = [
    {
      value: `$${formatNumber(cumulativeData.TotalRevenue)}`,
      label: 'REVENUES',
      barColor: 'bg-[#A6F7E2]',
      ranking: '74%',
      diff: calculateDiff(cumulativeData.TotalRevenue, previousYearData.TotalRevenue),
      diffColor: 'border-2 border-[#029F04] bg-[#A6F7E2]',
    },
    {
      value: `$${formatNumber(cumulativeData.TotalExpenses)}`,
      label: 'EXPENSES',
      barColor: 'bg-[#CCCCFF]',
      ranking: '61%',
      diff: calculateDiff(cumulativeData.TotalExpenses, previousYearData.TotalExpenses),
      diffColor: 'border-2 border-[#029F04] bg-[#171821]',
    },
    {
      value: `$${formatNumber(cumulativeData.TotalAssets)}`,
      label: 'ASSETS',
      barColor: 'bg-[#FFE5A5]',
      ranking: '47%',
      diff: calculateDiff(cumulativeData.TotalAssets, previousYearData.TotalAssets),
      diffColor: 'border-2 border-[#6A1701] bg-[#171821]',
    },
    {
      value: `$${formatNumber(cumulativeData.TotalLiabilities)}`,
      label: 'LIABILITIES',
      barColor: 'bg-[#C7FFA5]',
      ranking: '23%',
      diff: calculateDiff(cumulativeData.TotalLiabilities, previousYearData.TotalLiabilities),
      diffColor: 'border-2 border-[#6A1701] bg-[#171821]',
    },
    {
      value: `$${formatNumber(cumulativeData.FundraisingExpenses)}`,
      label: 'FUNDRAISING',
      barColor: 'bg-[#F8A5FF]',
      ranking: '23%',
      diff: calculateDiff(cumulativeData.FundraisingExpenses, previousYearData.FundraisingExpenses),
      diffColor: 'border-2 border-[#6A1701] bg-[#171821]',
    },
  ];
  
  const revenues = years.map(year => nonprofitData[year]['TotRev']);
  const expenses = years.map(year => nonprofitData[year]['TotExp']);
  const assets = years.map(year => nonprofitData[year]['TotAst']);
  const liabilities = years.map(year => nonprofitData[year]['TotLia']);
  const style = { width: '100%', height: '100%' };

  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
          {
              breakpoint: 1024,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
              }
          },
          {
              breakpoint: 600,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  initialSlide: 2
              }
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
          }
      ]
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#171821',
      color: '#fff',
      borderColor: '#444',
      borderRadius: '10px',
      boxShadow: 'none',
      ':hover': {
        borderColor: '#888',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#21222D',
      color: '#fff',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#21222D',
      color: '#fff',
      ':hover': {
        backgroundColor: '#444',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff',
    }),
  };

  return (
    <div>
      <div className={isDarkMode ? "dashboard-color text-white transition-colors duration-300" : "bg-[#ffffff] text-black transition-colors duration-300"}>
        <Sidebar className="hidden lg:block" isDarkMode={isDarkMode}
                            onThemeToggle={handleThemeToggle} />
        <div className="flex flex-col lg:flex-col pb-8 lg:pb-12 mt-6 lg:mt-12">
          <div className={`flex flex-col px-4 md:px-8 lg:px-10 ${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} rounded-md mx-4 md:mx-8 lg:mx-10 p-6 md:p-8 lg:p-10 font-sans`}>
            <h1 className="text-lg md:text-2xl font-semibold">{capitalizeFirstLetter(nonprofitData.Nm)}</h1>
            <span className="text-xs md:text-sm text-[#A0A0A0]">{nonprofitData.Addr}, {nonprofitData.Cty}, {nonprofitData.St}, {nonprofitData.Zip}</span>
            <div className="mt-4 md:mt-6">
              <Slider {...settings}>
                {indicators.map((indicator, index) => {
                  const isPositive = indicator.diff.includes('+');
                  const diffColor = isPositive ? 'text-[#6C8C3C]' : 'text-[#FF2F2F]';
  
                  return (
                    <div key={index} className="p-3 sm:p-4 md:p-6 text-black">
                      <div className={`relative ${isDarkMode ? "bg-[#171821]  border-black" : "text-black  border-gray-200"} p-4 md:p-6 rounded-lg even-shadow hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 border ${indicator.barColor}`}>
                        <p className={`absolute top-2 right-2 md:top-4 md:right-4 text-xs md:text-lg ${diffColor}`}>{indicator.diff}</p>
                        <p className="text-base md:text-lg font-semibold mb-1 md:mb-2">{indicator.label}</p>
                        <h2 className="text-sm md:text-base font-semibold text-[#838383]">{mostRecentYear}</h2>
                        <h2 className="text-sm md:text-base font-semibold">{indicator.value}</h2>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
          
          <div className="flex flex-col mx-4 md:mx-8 lg:mx-10 mt-6 lg:mt-0 font-sans">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 lg:mt-10">
              {/* Metric Comparison Section */}
              <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg md:text-xl font-bold text-center">
                      {metricOptions.find(option => option.value === selectedMetric)?.label}
                    </h1>
                    <a
                      data-tooltip-id="comparison-tooltip"
                      className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200"
                      data-tooltip-content="This is the tooltip content for the comparison box."
                    >
                      <FaInfoCircle />
                    </a>
                    <ReactTooltip place="top" effect="solid" id="comparison-tooltip" />
                  </div>
                  <Select
                    options={metricOptions}
                    value={metricOptions.find(option => option.value === selectedMetric)}
                    onChange={(option) => setSelectedMetric(option.value)}
                    className="text-black text-sm md:text-md"
                    styles={customStyles}
                  />
                </div>
                <div className="p-4 md:p-6 rounded-lg mt-4">
                  <h1 className="text-center text-lg md:text-xl font-bold">Organization Comparison By NTEE Code</h1>
                  <div className="flex items-center justify-center mt-4">
                    <Gauge
                      orgName={capitalizeFirstLetter(nonprofitData.Nm)}
                      selectedMetric={selectedMetric}
                      nonprofitData={nonprofitData}
                      sectorData={sectorData}
                      mostRecentYear={mostRecentYear}
                      stateName={nonprofitData.St}
                    />
                  </div>
                </div>
              </div>
  
              {/* Line Comparison Chart Section */}
              <div className={` ${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg md:text-xl font-bold">
                      {`${metricOptions.find(option => option.value === selectedComparison.variable1)?.label} vs. ${metricOptions.find(option => option.value === selectedComparison.variable2)?.label}`}
                    </h1>
                    <a
                      data-tooltip-id="comparison-tooltip"
                      className="ml-2 cursor-pointer text-gray-400 hover:text-gray-200"
                      data-tooltip-content="This is the tooltip content for the comparison box."
                    >
                      <FaInfoCircle />
                    </a>
                    <ReactTooltip place="top" effect="solid" id="comparison-tooltip" />
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Select
                      options={metricOptions}
                      value={metricOptions.find(option => option.value === selectedComparison.variable1)}
                      onChange={(option) => setSelectedComparison(prev => ({ ...prev, variable1: option.value }))}
                      className="text-black text-sm md:text-md"
                      styles={customStyles}
                    />
                    <Select
                      options={metricOptions}
                      value={metricOptions.find(option => option.value === selectedComparison.variable2)}
                      onChange={(option) => setSelectedComparison(prev => ({ ...prev, variable2: option.value }))}
                      className="text-black text-sm md:text-md"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center mt-6" style={{ width: '100%', height: '100%' }}>
                  <LineCompareChart
                    variable1={selectedComparison.variable1}
                    variable2={selectedComparison.variable2}
                    values1={getValuesForMetric(selectedComparison.variable1)}
                    values2={getValuesForMetric(selectedComparison.variable2)}
                    minYear={minYear}
                  />
                </div>
              </div>
  
              {/* Overall Growth Section */}
              <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <h1 className="text-center text-lg md:text-xl font-bold mb-4 md:mb-8">Overall Growth</h1>
                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                  <StackChart
                    revenues={revenues}
                    expenses={expenses}
                    assets={assets}
                    liabilities={liabilities}
                    minYear={minYear}
                  />
                </div>
              </div>
            </div>
  
            {/* Year-Over-Year Revenues & Predictive Analysis Section */}
            <div className="grid sm:grid-cols-1 gap-4 mt-6 md:mt-10 mb-10">
              <div className={`${isDarkMode ? "bg-[#21222D] text-white" : "bg-[#f9f9f9] text-black"} p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
                <h1 className="text-center text-lg md:text-xl font-bold">Year-Over-Year Revenues & Predictive Analysis</h1>
                <div className="flex items-center justify-center mt-6 md:mt-12 mb-12" style={{ width: '100%', height: '100%' }}>
                  <TimeSeries values={revenues} minYear={minYear} isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode}/>
    </div>
  );
  
}

export default Nonprofit;

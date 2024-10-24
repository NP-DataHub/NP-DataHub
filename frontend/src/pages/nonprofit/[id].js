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
      <div className="dashboard-color text-white font-sans">
        <Sidebar className="hidden" />
        <div className="flex-col dashboard-color pb-12 mt-12">
          <div className="flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
            <h1 className="text-2xl font-semibold">{capitalizeFirstLetter(nonprofitData.Nm)}</h1>
            <span className="text-sm text-[#A0A0A0]">{nonprofitData.Addr}</span>
            <div className="mt-6">
            <Slider {...settings}>
                              {indicators.map((indicator, index) => {
                                  const isPositive = indicator.diff.includes('+');
                                  const diffColor = isPositive ? 'text-[#6C8C3C]' : 'text-[#FF2F2F]';

                                  return (
                                      <div key={index} className="p-6 text-black">
                                          <div className={`relative bg-[#171821] p-6 rounded-lg even-shadow hover:shadow-lg  transition-all duration-300 ease-in-out hover:-translate-y-2 border-1 border-black ${indicator.barColor}`}>
                                              <p className={`absolute top-5 right-4 text-lg ${diffColor}`}>{indicator.diff}</p>
                                              <p className="text-xl font-semibold mb-2">{indicator.label}</p>
                                              <h2 className="text-lg font-semibold text-[#838383]">{mostRecentYear}</h2>
                                              <h2 className="text-lg font-semibold">{indicator.value}</h2>
                                          </div>
                                      </div>
                                  );
                              })}
                          </Slider>
            </div>
          </div>
          <div className="flex-col mx-10 font-sans">
            <div className="grid grid-cols-3 gap-4 mt-10 h-400px">
              <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl text-center" style={{ fontWeight: 'bold' }}>
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
                    className="text-black text-md"
                    styles={customStyles}
                  />
                </div>
                <div className="flex items-center justify-center mb-8" style={{ width: '100%', height: '100%' }}>
                  <BarChart values={getValuesForMetric(selectedMetric)} minYear={minYear} />
                </div>
              </div>

              <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl" style={{ fontWeight: 'bold' }}>
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
                  <div className="flex space-x-2 items-center">
                    <Select
                      options={metricOptions}
                      value={metricOptions.find(option => option.value === selectedComparison.variable1)}
                      onChange={(option) => setSelectedComparison(prev => ({ ...prev, variable1: option.value }))}
                      className="text-black text-md"
                      styles={customStyles}
                    />
                    <Select
                      options={metricOptions}
                      value={metricOptions.find(option => option.value === selectedComparison.variable2)}
                      onChange={(option) => setSelectedComparison(prev => ({ ...prev, variable2: option.value }))}
                      className="text-black text-md"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                  <LineCompareChart
                    variable1={selectedComparison.variable1}
                    variable2={selectedComparison.variable2}
                    values1={getValuesForMetric(selectedComparison.variable1)}
                    values2={getValuesForMetric(selectedComparison.variable2)}
                    minYear={minYear}
                  />
                </div>
              </div>

              <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h1 className="text-center text-xl font-bold">Overall Growth</h1>
                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                  <StackChart revenues={revenues} expenses={expenses} assets={assets} liabilities={liabilities} minYear={minYear} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 mb-10">
              <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-2">
                <h1 className="text-center text-xl font-bold">Revenue By State</h1>
                <div className="flex items-center justify-center mb-24 mt-12" style={{ width: '100%', height: '100%' }}>
                  <TimeSeries values={revenues} minYear={minYear} />
                </div>
              </div>

              <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h1 className="text-center text-xl font-bold">Org Compared</h1>
                <div className="flex items-center justify-center mb-24 mt-12">
                  <Gauge
                    orgName={capitalizeFirstLetter(nonprofitData.Nm)}
                    orgVal={cumulativeData.TotalRevenue}
                    stateName={nonprofitData.St}
                    stateVal={sectorData[mostRecentSectorYear][nonprofitData.St].RevMed}
                    nationalVal={sectorData[mostRecentSectorYear].NatMedRev}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Nonprofit;

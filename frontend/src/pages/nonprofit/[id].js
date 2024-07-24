"use client";
import Sidebar from "@/app/components/Sidebar";
import DashboardNavbar from "@/app/components/dashboardNav";
import BarChart from "@/app/components/charts/BarChart";
import LineCompareChart from "@/app/components/charts/LineCompareChart";
import TimeSeries from "@/app/components/charts/TimeSeries";
import StackChart from "@/app/components/charts/StackChart";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '@/app/globals.css';

const Nonprofit = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id)
  const [nonprofitData, setNonprofitData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the nonprofit data using the id
      const fetchNonprofitData = async () => {
        const response = await fetch(`/api/items?_id=${id}`);
        const data = await response.json();
        setNonprofitData(data.data[0]);
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

  if (!nonprofitData) {
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
  const previousYear = years[years.length - 2];

  if (mostRecentYear) {
    const yearData = nonprofitData[mostRecentYear];
    cumulativeData.TotalRevenue = yearData['Total Revenue'] || 0;
    cumulativeData.TotalExpenses = yearData['Total Expenses'] || 0;
    cumulativeData.TotalAssets = yearData['Total Assets'] || 0;
    cumulativeData.TotalLiabilities = yearData['Total Liabilities'] || 0;
    cumulativeData.FundraisingExpenses = yearData['Fundraising Expenses'] || 0;
  }

  if (previousYear) {
    const yearData = nonprofitData[previousYear];
    previousYearData.TotalRevenue = yearData['Total Revenue'] || 0;
    previousYearData.TotalExpenses = yearData['Total Expenses'] || 0;
    previousYearData.TotalAssets = yearData['Total Assets'] || 0;
    previousYearData.TotalLiabilities = yearData['Total Liabilities'] || 0;
    previousYearData.FundraisingExpenses = yearData['Fundraising Expenses'] || 0;
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
  const revenues = years.map(year => nonprofitData[year]['Total Revenue']);
  const expenses = years.map(year => nonprofitData[year]['Total Expenses']);
  const assets = years.map(year => nonprofitData[year]['Total Assets']);
  const liabilities = years.map(year => nonprofitData[year]['Total Liabilities']);
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

  return (
      <div>
          <div className="flex dashboard-color text-white font-sans">
              <Sidebar />
              <div className="flex-col w-10/12 mx-auto dashboard-color ">
                  <DashboardNavbar />
                  <div className="flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
                      <h1 className="text-2xl font-semibold">{capitalizeFirstLetter(nonprofitData.Name)}</h1>
                      <span className="text-sm text-[#A0A0A0]">123 Some Street</span>
                      <div className="mt-6 ">
                          <Slider {...settings}>
                              {indicators.map((indicator, index) => {
                                  const isPositive = indicator.diff.includes('+');
                                  const diffColor = isPositive ? 'text-[#6C8C3C]' : 'text-[#FF2F2F]';

                                  return (
                                      <div key={index} className="p-6 text-black">
                                          <div className={`relative bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${indicator.barColor}`}>
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
                              {/*add chart here box size will update with chart*/}
                              <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Revenue</h1>
                              <div className="flex items-center justify-center mb-12" style={{ width: '100%', height: '100%' }}>
                                  <BarChart values={revenues} minYear = {previousYear} style ={style}/>
                              </div>
                          </div>
                          <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                              {/*add chart here box size will update with chart*/}
                              <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Revenue vs. Expenses</h1>
                              <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                                  <LineCompareChart variable1="Revenue" variable2="Expenses" values1={revenues} values2={expenses} minYear = {previousYear}  style={style}/>
                              </div>
                          </div>
                          <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                              {/*add chart here box size will update with chart*/}
                              <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Overall Growth</h1>
                              <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                                  <StackChart revenues={revenues} expenses={expenses} assets={assets} liabilities={liabilities} minYear = {previousYear} style={style}/>
                              </div>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-10 mb-10">
                          <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-2">
                              {/*add chart here box size will update with chart*/}
                              <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Time Series</h1>
                              <div className="flex items-center justify-center mb-24 mt-12" style={{ width: '90%', height: '90%' }}>
                                  <TimeSeries variable="Revenue" values={revenues} minYear = {previousYear} style={style} />
                              </div>

                          </div>
                          <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                              {/*add chart here box size will update with chart*/}
                              <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Compared to State</h1>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}


export default Nonprofit;
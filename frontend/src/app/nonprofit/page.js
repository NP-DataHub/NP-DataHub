"use client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardNavbar from "../components/dashboardNav";
import BarChart from "../components/BarChart";
import LineCompareChart from "../components/LineCompareChart";
import TimeSeries from "../components/TimeSeries";
import StackChart from "../components/StackChart";
import React, { useState } from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function non_profit() {

    const revenues = [52,64,73,67,86,95];
    const expenses = [70,55,58,63,69,80];
    const assets = [42,43,45,47,47,49];
    const liabilities = [41,42,41,43,45,43];
    const style = { height: 250, width: 350 };
    const styleWide = {height: 250, width: 750}
    //<BarChart variable={variable1} values={revenues} style={style}/>
    //<LineCompareChart variable1={variable1} variable2={variable2} revenues={revenues} expenses={expenses} style={style}/>
    //<TimeSeries variable={variable1} values={revenues} style={style}/>

    const indicators = [
        { value: '$245K', label: 'REVENUES', barColor: 'bg-[#A6F7E2]', ranking: '74%', diff: '+6.5%', diffColor: 'border-2 border-[#029F04] bg-[#A6F7E2]' },
        { value: '$222K', label: 'EXPENSES', barColor: 'bg-[#CCCCFF]', ranking: '61%', diff: '+5.4%', diffColor: 'border-2 border-[#029F04]  bg-[#171821]' },
        { value: '$546K', label: 'ASSETS', barColor: 'bg-[#FFE5A5]', ranking: '47%', diff: '-1.9%', diffColor: 'border-2 border-[#6A1701] bg-[#171821]' },
        { value: '$511K', label: 'LIABILITIES', barColor: 'bg-[#C7FFA5]', ranking: '23%', diff: '-2.9%', diffColor: 'border-2 border-[#6A1701] bg-[#171821]' },
        { value: '$511K', label: 'FUNDRAISING', barColor: 'bg-[#F8A5FF]', ranking: '23%', diff: '-2.9%', diffColor: 'border-2 border-[#6A1701] bg-[#171821]' },

      ];

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
                <div className="flex-col w-screen overflow-x-hidden ">
                    <DashboardNavbar />
                    <div className="flex-col px-10 bg-[#21222D] rounded-md mx-10 p-10 font-sans">
                        <h1 className="text-2xl font-semibold">COMMUNITY FOUNDATION OF TROY</h1>
                        <span className="text-sm text-[#A0A0A0]">123 Main Street, Troy, New York  12180</span>
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
                                                <h2 className="text-lg font-semibold text-[#838383]">Cumulative</h2>
                                                <h2 className="text-lg font-semibold">{indicator.value}</h2>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        </div>
                    </div>
                    <div className="flex-col mx-10 font-sans">
                        <div className="grid grid-cols-3 gap-4 mt-10">
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                {/*add chart here box size will update with chart*/}
                                <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Revenue</h1>
                                <div className="flex items-center justify-center mb-12" style={{ width: '100%', height: '100%' }}>
                                    <BarChart values={revenues} style={style}/>
                                    </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                {/*add chart here box size will update with chart*/}
                                <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Revenue vs. Expenses</h1>
                                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                                <LineCompareChart variable1="Revenue" variable2="Expenses" values1={revenues} values2={expenses} style={style}/>
                                </div>
                            </div>
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                {/*add chart here box size will update with chart*/}
                                <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Overall Growth</h1>
                                <div className="flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                                <StackChart revenues={revenues} expenses={expenses} assets={assets} liabilities={liabilities} style={style}/>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-10 mb-10">
                            <div className="bg-[#21222D] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 col-span-2">
                                {/*add chart here box size will update with chart*/}
                                <h1 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Time Series</h1>
                                <div className="flex items-center justify-center mb-12" style={{ width: '100%', height: '100%' }}>
                                    <TimeSeries variable="Revenue" values={revenues} style={styleWide} />
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

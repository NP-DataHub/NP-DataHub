'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import regression from 'regression';

/**
 * @param values - an array of values measured each year
 */

const TimeSeries = ({ values, minYear, isDarkMode }) => {
  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Check if values is a valid array at the top, before any return statements
  const isValidArray = Array.isArray(values) && values.length > 0;

  // Number formatting function
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

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setDimensions({
          width: chartContainerRef.current.offsetWidth,
          height: chartContainerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If values is not an array or is empty, render an error and skip the rest of the component logic
  if (!isValidArray) {
    console.log(values);
    return <div>ERROR: chart arg must be an array</div>;
  }

  // Data for regression and prediction
  const data = values.map((value, index) => [index, value]);
  const fitted_line = regression.linear(data);

  const extendedData = Array.from({ length: values.length + 2 }, (_, index) => [
    index,
    fitted_line.predict(index)[1],
  ]);

  const predictedData = data.slice(-1).concat(extendedData.slice(values.length));

  // Chart option
  const option = {
    legend: {
      data: ['Data', 'Predicted Values'],
      textStyle: {
        color: `${isDarkMode ? "text-white" : "text-black"}`,
      },
    },
    dataset: [
      {
        source: data,
      },
      {
        source: predictedData,
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: function (params) {
        let tooltipContent = `<div>${params[0].name}<br/>`;
        params.forEach((item) => {
          tooltipContent += `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
                ${item.seriesName}: 
              </span>
              <span style="text-align: right;">&nbsp;$${formatNumber(item.data[1])}</span>
            </div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
    grid: {
      left: 0,
      bottom: 0.036 * dimensions.width,
      right: 0,
      top: 0.01 * dimensions.width,
      containLabel: true,
    },
    xAxis: [
      {
        nameLocation: 'middle',
        nameTextStyle: { fontWeight: 'bold', fontSize: Math.round(0.036 * dimensions.width) },
        type: 'category',
        data: Array.from({ length: values.length + 2 }, (_, index) => index + parseInt(minYear)),
        axisTick: { alignWithLabel: true },
        axisLabel: { fontSize: Math.round(0.01 * dimensions.width) },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: (value) => '$' + formatNumber(value),
          fontSize: Math.round(0.01* dimensions.width),
        },
        axisLine: { show: true },
        splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'dashed' } },
      },
    ],
    series: [
      { name: 'Data', type: 'line', datasetIndex: 0, symbol: 'circle', itemStyle: { color: '#0770FF' } },
      {
        name: 'Predicted Values',
        type: 'line',
        datasetIndex: 1,
        color: 'red',
        lineStyle: { type: 'dashed' },
        symbol: 'circle',
        itemStyle: { color: 'red' },
      },
    ],
    graphic: {
      type: 'text',
      left: '5%',
      bottom: 'bottom',
      style: {
        text: 'Prediction Confidence (R²): ' + (fitted_line.r2.toFixed(2)) * 100 + '%',
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'white',
      },
    },
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default TimeSeries;

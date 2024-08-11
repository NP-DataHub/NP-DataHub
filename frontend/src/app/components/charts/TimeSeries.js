'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import regression from 'regression';
/**
 * @param values -   an array of values measured each year
*/

const TimeSeries = ({values, minYear}) => {
  // ensures arg is an array
  if (!Array.isArray(values) || values.length === 0) {
    console.log(values);
    return <div>ERROR: chart arg must be an array</div>;
  }

  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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

  const data = values.map((value, index) => [index, value]);
  const fitted_line = regression.linear(data);

  // print the regression line
  console.log(fitted_line);

  const option = {
    legend: {
      data: ['Data', 'Predicted']
    },
    dataset: [
      {
        source: data
      },
      {
        source: Array.from({ length: values.length }, (_, index) => [index, fitted_line.predict(index)[1]])
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        const tooltipContent = params.map(item => {
          return `${item.name}: $${formatNumber(item.value)}`;
        }).join('<br/>');
        return tooltipContent;
      }
    },
    grid: {
      left: 0,
      bottom: 0.036 * dimensions.width,
      right: 0,
      top: 0.01 * dimensions.width,
      containLabel: true
    },
    xAxis: [
      {
        name: 'Year',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.036 * dimensions.width),
        },
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + parseInt(minYear)),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.015 * dimensions.width)
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value) {
            return '$' + formatNumber(value);
          },
          fontSize: Math.round(0.015 * dimensions.width)
        }
      }
    ],
    series: [
      {
        name: 'Data',
        type: 'line',
        datasetIndex: 0,
      },
      {
        name: 'Predicted',
        type: 'line',
        datasetIndex: 1,
        symbol: 'none',
        color: 'red', // Set the color of the regression line here
        smooth: true,
        lineStyle: {
          width: 2 // Adjust the width of the regression line if needed
        }
      }
    ],
    graphic: {
      type: 'text',
      left: '5%',
      bottom: 'bottom',
      style: {
        text: 'Accuracy (R²): ' + fitted_line.r2.toFixed(2),
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'white'
      }
    }
  };
  console.log(option)

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option}/>
    </div>
  );
};

export default TimeSeries;


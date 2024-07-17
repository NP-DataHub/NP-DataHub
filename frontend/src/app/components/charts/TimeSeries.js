'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * @param values -   an array of values measured each year
*/
const TimeSeries = ({values}) => {
  // ensures arg is an array
  if (!Array.isArray(values) || values.length === 0) {
    return <div>ERROR: chart arg must be an array</div>;
  }

  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const option = {
    dataset: [
      {
        source: values
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        const tooltipContent = params.map(item => {
          return `${item.name}: $${item.value}`;
        }).join('<br/>');
        return tooltipContent;
      }
    },
    grid: {
      left: 0,
      bottom: 0,
      right: 0,
      top: 0,
      containLabel: true
    },
    xAxis: [
      {
        name: 'Year',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.036*dimensions.width),
        },
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + 2017),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.015* dimensions.width)
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value) {
            return '$' + value;
          },
          fontSize: Math.round(0.015 * dimensions.width)
        }
      }
    ],
    series: [
      {
        name: 'line',
        type: 'line',
        data: values
      }
    ]
  };
  console.log(option)

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option}/>
    </div>
  );
};

export default TimeSeries;


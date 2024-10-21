'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * @param values -   an array of values measured each year
 */
const Gauge = ({ orgName, orgVal, stateName, stateVal, nationalVal }) => {
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

  const maxVal = Math.max(orgVal, stateVal, nationalVal);

  const gaugeData = [
    {
      value: (orgVal / maxVal) * 100,
      name: orgName,
      title: {
        offsetCenter: ['0%', '-35%'], // Adjusted to fit better
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-22%'], // Adjusted to fit better
        formatter: () => `$${formatNumber(orgVal)}`,
      },
    },
    {
      value: (stateVal / maxVal) * 100,
      name: `${stateName} Median`,
      title: {
        offsetCenter: ['0%', '5%'], // Slight adjustment
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '18%'], // Adjusted for better spacing
        formatter: () => `$${formatNumber(stateVal)}`,
      },
    },
    {
      value: (nationalVal / maxVal) * 100,
      name: 'National Median',
      title: {
        offsetCenter: ['0%', '45%'], // Slightly higher to avoid cutting off
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '58%'], // Adjusted for better fit
        formatter: () => `$${formatNumber(nationalVal)}`,
      },
    },
  ];

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
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true,
    },
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#464646',
          },
        },
        axisLine: {
          lineStyle: {
            width: 30, // Slightly reduced for better fit
            color: [[1, '#464646']],
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        title: {
          fontSize: Math.max(0.025 * dimensions.width, 12), // Minimum font size added for better small screens
        },
        detail: {
          width: dimensions.width,
          height: dimensions.height,
          fontSize: Math.max(0.025 * dimensions.width, 12), // Minimum font size added for better small screens
          color: 'inherit',
        },
      },
    ],
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default Gauge;

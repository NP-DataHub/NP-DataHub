'use client';
import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const TopStatesChart = ({ states, isDarkMode }) => {
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

  // Check for invalid inputs after the hooks have been called
  if (typeof states !== 'object' || !Object.keys(states).length) {
    return <div>ERROR: No valid state data provided.</div>;
  }

  const topStates = Object.entries(states)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5); // Get top 5 states

  const stateNames = topStates.map(([state]) => state);
  const anomalyCounts = topStates.map(([_, count]) => count);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: () => '',
    },
    grid: {
      left: 0.01 * dimensions.width,
      right: 40, 
      bottom: 0,
      top: 0,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: stateNames,
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: 'Anomalies',
        type: 'bar',
        stack: 'total',
        color: isDarkMode ? "#F2C8ED" : "#DB7093",
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
        },
        emphasis: {
          focus: 'series'
        },
        data: anomalyCounts
      }
    ]
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} className="mt-6">
      <ReactECharts option={option} />
    </div>
  );
};

export default TopStatesChart;

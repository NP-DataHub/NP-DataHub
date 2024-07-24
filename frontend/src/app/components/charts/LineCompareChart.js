'use client';
// LineCompareChartComponent.js
import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const LineCompareChart = ({ variable1, values1, variable2, values2, minYear }) => {
  if (!Array.isArray(values1) || values1.length === 0 || !Array.isArray(values2) || values2.length === 0) {
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

  const option = {
    legend: {
      top: 'bottom',
      data: ['Intention']
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let tooltipContent = `<div>${params[0].name}<br/>`;
        params.forEach(item => {
          tooltipContent += `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
                ${item.seriesName}: 
              </span>
              <span style="text-align: right;">&nbsp;$${formatNumber(item.value)}</span>
            </div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      }
    },
    grid: {
      top: 0,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: values1.length }, (_, index) => index + parseInt(minYear)),
      boundaryGap: false,
      handle: {
        show: true,
        color: '#7581BD'
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: Math.round(0.036 * dimensions.width),
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
    },
    series: [
      {
        name: variable1,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        sampling: 'average',
        itemStyle: {
          color: '#0770FF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(58,77,233,0.8)' },
              { offset: 1, color: 'rgba(58,77,233,0.3)' }
            ]
          }
        },
        data: values1
      },
      {
        name: variable2,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        sampling: 'average',
        itemStyle: {
          color: '#F2597F'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(213,72,120,0.8)' },
              { offset: 1, color: 'rgba(213,72,120,0.3)' }
            ]
          }
        },
        data: values2
      }
    ]
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default LineCompareChart;

'use client';
// BarChartComponent.js
import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const BarChart = ({ values }) => {
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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        const index = params[0].dataIndex;
        let tooltipContent = `${params[0].name}: $${params[0].value}`;
        let percent;
        if (index > 0) {
          const previousValue = values[index - 1];
          percent = (((params[0].value - previousValue) / previousValue) * 100).toFixed(1);
        } else percent = (0).toFixed(1);
        if (percent >= 0) tooltipContent += `<br/><span style="color:#32CD32;">&#x25B2;</span> +`;
        else tooltipContent += `<br/><span style="color:#E60000;">&#x25BC;</span> `;
        tooltipContent += `${percent}%`;
        return tooltipContent;
      }
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + 2017),
        axisTick: {
          alignWithLabel: true,
          show: false
        },
        axisLine: {
          //show: false
        },
        axisLabel: {
          fontSize: Math.round(0.036 * dimensions.width),
          fontWeight: 'bold'
        }
      }
    ],
    yAxis: [
      {
        position: 'left',
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      {
        position: 'right',
        axisTick: {
          show: true
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '90%',
        data: values,
        itemStyle: {
          color: function (params) {
            const index = params.dataIndex;
            if (index > 0) {
              const previousValue = values[index - 1];
              const currentValue = params.value;
              const percentChange = ((currentValue - previousValue) / previousValue) * 100;
              if (percentChange < 0) {
                return 'rgb(255, 110, 140)'; // Pink color for decreasing percent change
              }
            }
            return 'rgb(80, 110, 237)'; // Default blue color
          }
        },
      }
    ]
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option}/>
    </div>
  );
};

export default BarChart;

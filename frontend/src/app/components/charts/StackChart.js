'use client';
// BarChartComponent.js
import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param revenues -     an array of revenues measured each year
 * @param expenses -    an array of expenses measured each year
 * @param assets -      an array of assets measured each year
 * @param liabilities - an array of liabilities measured each year
*/
const StackChart = ({revenues, expenses, assets, liabilities}) => {
  // ensures arg is an array
  if (!Array.isArray(revenues) || !Array.isArray(expenses) || !Array.isArray(assets) || !Array.isArray(liabilities)) {
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

  revenues = [...revenues].reverse();
  expenses = [...expenses].reverse();
  assets = [...assets].reverse()
  liabilities = [...liabilities].reverse();

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      },
      formatter: function (params) {
        let tooltipContent = `<div>${params[0].name}<br/>`;
        params.forEach(item => {
          tooltipContent += `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
                ${item.seriesName}: 
              </span>
              <span style="text-align: right;">&nbsp;$${item.value}</span>
            </div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      }
    },
    grid: {
      left: 0.01 * dimensions.width,
      right: 0,
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
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: Array.from({ length: revenues.length }, (_, index) => 2017 + revenues.length - 1 - index),
      handle: {
        show: true,
        color: '#7581BD',
        fontSize: Math.round(0.036 * dimensions.width),
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        stack: 'total',
        color: 'rgb(80, 110, 237)',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: revenues
      },
      {
        name: 'Expenses',
        type: 'bar',
        stack: 'total',
        color: 'rgb(255, 110, 140)',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: expenses
      },
      {
        name: 'Assets',
        type: 'bar',
        stack: 'total',
        color: '#91CC75',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: assets
      },
      {
        name: 'Liabilities',
        type: 'bar',
        stack: 'total',
        color: '#FAC858',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        data: liabilities,
        itemStyle: {
            barBorderRadius: [0, 0.016*dimensions.width, 0.016*dimensions.width, 0],
        }
      }
    ]
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option}/>
    </div>
  );
};

export default StackChart;
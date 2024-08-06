'use client';
// BarChartComponent.js
import React from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param revenues -     an array of revenues measured each year
 * @param expenses -    an array of expenses measured each year
 * @param assets -      an array of assets measured each year
 * @param liabilities - an array of liabilities measured each year
 * @param style -       a struct containing format options - height and width
 *                      must be defined as numbers.
*/
const StackChart = ({revenues, expenses, assets, liabilities, style, minYear}) => {
  // ensures arg is an array
  if (!Array.isArray(revenues) || !Array.isArray(expenses) || !Array.isArray(assets) || !Array.isArray(liabilities)) {
    return <div>ERROR: chart arg must be an array</div>;
  }

  //let scale = Math.round((style.width+style.height)/2);
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
              <span style="text-align: right;">&nbsp;$${formatNumber(item.value)}</span>
            </div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      }
    },
    //legend: {},
    grid: {
      //left: 0.01*style.width,
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
      data: Array.from({ length: revenues.length }, (_, index) => parseInt(minYear) + revenues.length - 1 - index),
      handle: {
        show: true,
        color: '#7581BD'
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        //fontSize: Math.round(0.036*style.width),
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
            //barBorderRadius: [0, 0.017*scale, 0.017*scale, 0],
        }
      }
    ]
  };

  return (
    <ReactECharts option={option} style={style} />
  );
};

export default StackChart;
'use client';
// BarChartComponent.js
import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * TO DO: Account for two variables with a different number of data points.
 *        Account for data that doesn't start in 2017
 */

/**
 * @param variable1 - string containing the first variable recorded in the graph
 * @param values1 -   an array of values measured each year for the first variable
 * @param variable2 - string containing the second variable recorded in the graph
 * @param values2 -   an array of values measured each year for the second variable
 * @param style -    a struct containing format options - height and width
 *                   must be defined as numbers.
 */
const LineCompareChart = ({ variable1, values1, variable2, values2, style }) => {
  // ensures args are arrays
  if (!Array.isArray(values1) || values1.length === 0 || !Array.isArray(values2) || values2.length === 0) {
    return <div>ERROR: chart arg must be an array</div>;
  }

  let scale = Math.round((style.width + style.height) / 2);

  // used for scaling the y axis
  const min = Math.min(...values1, ...values2);
  const max = Math.max(...values1, ...values2);
  const buffer = (max-min)*0.05;

  const option = {
    legend: {
      top: 'bottom',
      data: ['Intention']
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const tooltipContent = params.map(item => {
          return `${item.seriesName}: $${item.value} <span style="color:#32CD32;">&#x25B2;</span>`;
        }).join('<br/>');
        return tooltipContent;
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: values1.length }, (_, index) => index + 2017),
      handle: {
        show: true,
        color: '#7581BD'
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: Math.round(0.036*style.width),
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      min: min - buffer,
      max: max + buffer,
      axisTick: {
        inside: true
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: function (value) {
          return '$' + value;
        },
        fontSize: Math.round(0.018*scale),
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
    <ReactECharts option={option} style={style} />
  );
};

export default LineCompareChart;
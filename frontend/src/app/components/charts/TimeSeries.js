'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * @param variable - string containing the variable recorded in the graph
 * @param values -   an array of values measured each year
 * @param style -    a struct containing format options - height and width
 *                   must be defined as numbers.
*/

const TimeSeries = ({variable, values, style, minYear}) => {
  // ensures arg is an array
  if (!Array.isArray(values) || values.length === 0) {
    return <div>ERROR: chart arg must be an array</div>;
  }

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
  const width = typeof style.width === 'number' ? style.width : parseInt(style.width, 10);
  const height = typeof style.height === 'number' ? style.height : parseInt(style.height, 10);

  let scale = Math.round((width + height)/2);
  console.log(scale);

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
          return `${item.name}: $${formatNumber(item.value)}`;
        }).join('<br/>');
        return tooltipContent;
      }
    },
    grid: {
      left: Math.round(0.90 * scale),
      bottom: Math.round(0.25 * scale),
      right: Math.round(0.90 * scale),
      top: Math.round(0.1 * scale),
      containLabel: true
    },
    xAxis: [
      {
        name: 'Year',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.20*scale),
          padding: Math.round(0.10*scale),
        },
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + parseInt(minYear)),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.15* scale)
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value) {
            return '$' + formatNumber(value);
          },
          fontSize: Math.round(0.15 * scale)
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
    <ReactECharts option={option} style={style} />
  );
};

export default TimeSeries;


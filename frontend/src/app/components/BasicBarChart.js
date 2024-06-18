'use client';
// BarChartComponent.js
import React from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param variable - string containing the variable recorded in the graph
 * @param values -   an array of values measured each year
 * @param style -    a struct containing format options - height and width
 *                   must be defined as numbers.
*/
const BasicBarChart = ({variable, values, style}) => {
  // ensures arg is an array
  if (!Array.isArray(values) || values.length === 0) {
    return <div>ERROR: chart arg must be an array</div>;
  }
  let scale = Math.round((style.width+style.height)/2);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params) {
        // params is an array containing the information for each series in the tooltip
        const tooltipContent = params.map(item => {
          return `${item.name}: $${item.value}`;
        }).join('<br/>');
        return tooltipContent;
      }
    },
    grid: {
      left: Math.round(0.06*scale),
      bottom: Math.round(0.06*scale),
      containLabel: true
    },
    xAxis: [
      {
        name: 'Year',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.03*scale),
          padding: Math.round(0.03*scale)
        },
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + 2017),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.018*scale)
        }
      }
    ],
    yAxis: [
      {
        name: variable,
        type: 'value',
        nameLocation: 'middle',
        nameRotate: 90,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.03*scale),
          padding: Math.round(0.03*scale)
        },
        axisLabel: {
          formatter: function (value) {
            return '$' + value;
          },
          fontSize: Math.round(0.018*scale)
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '80%',
        data: values
      }
    ]
  };

  return (
    <ReactECharts option={option} style={style} />
  );
};

export default BasicBarChart;
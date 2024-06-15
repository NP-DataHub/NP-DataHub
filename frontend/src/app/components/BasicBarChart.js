'use client';
// BarChartComponent.js
import React from 'react';
import ReactECharts from 'echarts-for-react';

const BasicBarChart = () => {
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
      left: '8%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: [
      {
        name: 'Day',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 16,
          padding: 20
        },
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name: 'Revenue',
        type: 'value',
        nameLocation: 'middle',
        nameRotate: 90,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 16,
          padding: 50
        },
        axisLabel: {
          formatter: function (value) {
            return '$' + value;
          }
        }
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '80%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  };

  return (
    <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
  );
};

export default BasicBarChart;
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
const BarChart = ({variable, values, style}) => {
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
        const index = params[0].dataIndex;
        let tooltipContent = `${params[0].name}: $${params[0].value}`;
        let percent;
        if (index > 0) {
          const previousValue = values[index - 1];
          percent = (((params[0].value - previousValue) / previousValue) * 100).toFixed(1);
        }
        else percent = (0).toFixed(1);
        if (percent >= 0) tooltipContent += `<br/><span style="color:#32CD32;">&#x25B2;</span> +`;
        else tooltipContent += `<br/><span style="color:#E60000;">&#x25BC;</span>`
        tooltipContent += `${percent}%`;
        return tooltipContent;
      }
    },
    grid: {
      left: 0.01 * scale,
      right: 0.01 * scale,
      bottom: 0.045 * scale,
      top: 0
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from({ length: values.length }, (_, index) => index + 2017),
        axisTick: {
          //alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.034*scale)
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
          show: true
        },
        axisTick: {
          show: true
        }
      },
      {
        position: 'right',
        axisTick: {
          show: true
        },
        axisLine: {
          show: true
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
            // Customize color based on percent change
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
          },
          barBorderRadius: [0.02 * scale, 0.02 * scale, 0, 0]
        },
      }
    ]
  };

  return (
    <ReactECharts option={option} style={style} />
  );
};

export default BarChart;
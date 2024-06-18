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
const LineCompareChart = ({variable1, values1, variable2, values2, style}) => {
  // ensures args are arrays
  if (!Array.isArray(values1) || values1.length === 0 || !Array.isArray(values2) || values2.length === 0) {
    return <div>ERROR: chart arg must be an array</div>;
  }
  let scale = Math.round((style.width+style.height)/2);

  const option = {
        title: {
            left: 'center',
            text: `${variable1} vs. ${variable2}`
        },
        legend: {
            top: 'bottom',
            data: ['Intention']
        },
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
            return [pt[0], 130];
            }
        },
        xAxis: {
            name: 'Year',
            nameLocation: 'middle',
            nameTextStyle: {
                fontWeight: 'bold',
                fontSize: Math.round(0.03*scale),
                padding: Math.round(0.03*scale)
            },
            type: 'category',
            data: Array.from({ length: values1.length }, (_, index) => index + 2017),
            handle: {
                show: true,
                color: '#7581BD'
            },
            splitLine: {
            show: false
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
            inside: true
            },
            splitLine: {
            show: false
            },
            axisLabel: {
            inside: true,
            formatter: '{value}\n'
            },
            z: 10
        },
        grid: {
            top: 110,
            left: 15,
            right: 15,
            height: 160
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
            stack: 'a',
            areaStyle: {
                color: new ReactECharts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgba(58,77,233,0.8)'
                },
                {
                    offset: 1,
                    color: 'rgba(58,77,233,0.3)'
                }
                ])
            },
            data: values1
            },
            {
            name: variable2,
            type: 'line',
            smooth: true,
            stack: 'a',
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
                color: '#F2597F'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgba(213,72,120,0.8)'
                },
                {
                    offset: 1,
                    color: 'rgba(213,72,120,0.3)'
                }
                ])
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
'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param values -   an array of values measured each year
 * @param style -    a struct containing format options - height and width
 *                   must be defined as numbers.
*/
const PerformanceMeter = ({values, style}) => {
    const gaugeData = [
        {
          value: 66,
          name: 'Assets/Liabilities',
          title: {
            offsetCenter: ['0%', '-30%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-20%']
          }
        },
        {
          value: 98,
          name: 'Revenue/Expenses',
          title: {
            offsetCenter: ['0%', '0%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '10%']
          }
        },
        {
          value: 60,
          name: 'Health?',
          title: {
            offsetCenter: ['0%', '30%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '40%']
          }
        }
      ];

    const option = {
        series: [
            {
              type: 'gauge',
              startAngle: 90,
              endAngle: -270,
              pointer: {
                show: false
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#464646' //change as needed for styling
                }
              },
              axisLine: {
                lineStyle: {
                  width: 40
                }
              },
              splitLine: {
                show: false,
                distance: 0,
                length: 10
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                distance: 50
              },
              data: gaugeData,

              title: {
                fontSize: 14
              },
              detail: {
                width: 50,
                height: 14,
                fontSize: 14,
                color: 'inherit',
                borderColor: 'inherit',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}%'
              }
            }
        ]
    };

    return (
        <ReactECharts option={option} style={style} />
    );

};

export default PerformanceMeter;
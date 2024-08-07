'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param values -   an array of values measured each year
*/
const Gauge = ({orgName, orgVal, stateName, stateVal, nationalVal}) => {
  
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

    const gaugeData = [
        {
          value: orgVal,
          name: orgName,
          title: {
            offsetCenter: ['0%', '-30%'],
            color: '#666666',
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-18%']
          }
        },
        {
          value: stateVal,
          name: stateName + " Median",
          title: {
            offsetCenter: ['0%', '0%'],
            color: '#666666',
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '12%']
          }
        },
        {
          value: nationalVal,
          name: 'National Median',
          title: {
            offsetCenter: ['0%', '30%'],
            color: '#666666',
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '42%']
          }
        }
    ];

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
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          containLabel: true
        },
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
                    borderColor: '#464646'
                }
              },
              axisLine: {
                lineStyle: {
                    width: 40,
                    color: [
                        [1, '#464646'],
                    ]
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
                fontSize: 0.036*dimensions.width
              },
              detail: {
                width: dimensions.width,
                height: dimensions.height,
                fontSize: 0.036*dimensions.width,
                color: 'inherit',
                formatter: function (value) {
                  return `$${formatNumber(value)}`;
                },
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

export default Gauge;
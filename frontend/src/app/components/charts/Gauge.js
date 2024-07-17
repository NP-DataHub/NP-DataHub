'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param values -   an array of values measured each year
*/
const Gauge = ({orgName, orgVal, stateName, stateVal, nationalVal}) => {
    const gaugeData = [
        {
          value: orgVal,
          name: "Your Org",
          title: {
            offsetCenter: ['0%', '-30%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-18%']
          }
        },
        {
          value: stateVal,
          name: stateName,
          title: {
            offsetCenter: ['0%', '0%']
          },
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '12%']
          }
        },
        {
          value: nationalVal,
          name: 'National Avg',
          title: {
            offsetCenter: ['0%', '30%']
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
                    borderColor: '#464646' //change as needed for styling
                }
              },
              axisLine: {
                lineStyle: {
                    width: 40,
                    color: [
                        [1, '#464646'], // Empty portion color
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
                formatter: '{value}%'
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
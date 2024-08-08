'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


/** 
 * @param data - a list of nonprofits that have been filtered by the user. This data is used to create the scatter plot
 * @param filters - the filters that are used to filter the data. These are used to label the data on the graph
 *                - Expects the following format: [NTEE1, NTEE2, NTEE3, City, Zip, X_axis_var, Y_axis_var]
 * @param minYear - the minimum year for the data that we are graphing. This is used to determine the x-axis
 * 
 * @Overview Creates a scatter plot using the given variables, where they function as filters for the total data that we have
 *           Each NTEE code is a different color on the scatter plot
*/
const ScatterPlot = ({data, filters, minYear}) => {


    console.log("Data:", data);

    // Handles resizing of the chart
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


    option = {
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
            },
          grid: {
            left: 0,
            bottom: 0.036 * dimensions.width,
            right: 0,
            top: 0.01 * dimensions.width,
            containLabel: true
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          }
        },
        toolbox: {
            feature:{
                dataZoom: {},
                brush: {
                    type: ['rect', 'polygon', 'clear']
                }
            }
        },
        brush: {},
        legend: {
            data: ["NTEE " + filters[0].toString(), "NTEE " + filters[1].toString(), "NTEE " + filters[2].toString()],
            left: 'center',
            bottom: 5
        },
        xAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        },
        series: [
            {
                name: filters[0].toString(),
                type: 'scatter',
                // get all the X_axis_var and Y_axis_var data from the data variable for NTEE1
                data: data.map(item => [item.X_axis_var, item.Y_axis_var])
            }, 
            {
                name: filters[1].toString(),
                type: 'scatter',
                // get all the X_axis_var and Y_axis_var data from the data variable for NTEE2
                data: data.map(item => [item.X_axis_var, item.Y_axis_var])
            },
            {
                name: filters[2].toString(),
                type: 'scatter',
                // get all the X_axis_var and Y_axis_var data from the data variable for NTEE3
                data: data.map(item => [item.X_axis_var, item.Y_axis_var])
            }
        ]

    };
    return (
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
          <ReactECharts option={option}/>
        </div>
      );

};

export default ScatterPlot;
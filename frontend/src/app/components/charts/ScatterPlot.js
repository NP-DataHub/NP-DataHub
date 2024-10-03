'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';


/** 
 * @param data - a list of nonprofits that have been filtered by the user. This data is used to create the scatter plot
 * @param filters - the filters that are used to filter the data. These are used to label the data on the graph
 *                - Expects the following format: [NTEE1, NTEE2, City, Zip, X_axis_var, Y_axis_var]
 * @param minYear - the minimum year for the data that we are graphing. This is used to determine the x-axis
 * 
 * @Overview Creates a scatter plot using the given variables, where they function as filters for the total data that we have
 *           Each NTEE code is a different color on the scatter plot
*/
const ScatterPlot = ({data, X_axis_var,  Y_axis_var, filters, minYear}) => {

    // placeholder for filters var for now
    const filters_placeholder = ["A", "B", "C"];


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

      // Format the number 
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


      // Convert filters to actual english
      const labels = {
        "TotRev": "Total Revenue",
        "TotExp": "Total Expenses",
        "TotAst": "Total Assets",
        "TotLia": "Total Liabilities",
      }

      // Get the labels for the X and Y axis variables
      const X_axis_label = labels[X_axis_var];
      const Y_axis_label = labels[Y_axis_var];

      console.log("X Axis Label:", X_axis_label);
      console.log(X_axis_var);

      // Extract the data for the scatter plot, each 
      const scatter_data = [];

      // Loop through the data and extract the X and Y axis variables
      data.forEach((nonprofit) => {
        Object.keys(nonprofit).forEach((key) => {
          // check if the key is a year to extract data from
          if(!isNaN(key)){
            // Extract the X and Y axis variables
            const X_axis = nonprofit[key][X_axis_var];
            const Y_axis = nonprofit[key][Y_axis_var];

            // Add the data to the scatter plot data
            scatter_data.push({
              name: nonprofit["Nm"],
              state: nonprofit["St"],
              city: nonprofit["Cty"],
              zip: nonprofit["Zip"],
              value: [X_axis, Y_axis]
            });
          }
        });
      });



    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: function (params) {
              const tooltipContent = params.map(item => {       
                return `<strong>${item.name}</strong><br/> 
                        ${item.data.city}, ${item.data.state} ${item.data.zip}<br/>
                        ${X_axis_label}: ${formatNumber(item.value[0])}<br/>
                        ${Y_axis_label}: ${formatNumber(item.value[1])}
                          `;
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
        // legend: {
        //     data: ["NTEE " + filters_placeholder[0].toString()],
        //     left: 'center',
        //     bottom: 5
        // },
        xAxis: {
            type: 'value',
            scale: true,
            name: X_axis_label,
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
            name: Y_axis_label,
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        },
        series: [
            {
                name: "NTEE " + filters_placeholder[0].toString(),
                type: 'scatter',
                
                data: scatter_data
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
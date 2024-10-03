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
const ScatterPlot = ({data, filters, minYear}) => {

    // placeholder for filters var for now
    const filters_placeholder = ["A", "B", "C"];

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


      /**
       *  As it stands right now, the data object contains a list of all nonprofits that have been filtered by the user.
       *  However, we need to extract useful data. Right now I am assuming that there will be two more selectors that will 
       *  determine the X and Y axis variables. Then we can extract the data from the data object and create the scatter plot.
       *  For now we can use all the years for each nonprofit.
       */

      // Extract the X and Y axis variables from the filters
      const X_axis_var = "TotRev"; // filters[4];
      const Y_axis_var = "TotExp"; // filters[5];

      // Convert filters to actual english
      const labels = {
        "TotRev": "Total Revenue",
        "TotExp": "Total Expenses",
        "TotAst": "Total Assets",
        "TotLiab": "Total Liabilities",
      }

      // Get the labels for the X and Y axis variables
      const X_axis_label = labels[X_axis_var];
      const Y_axis_label = labels[Y_axis_var];

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
            scatter_data.push([X_axis, Y_axis]);
          }
        });
      });






      console.log("Scatter Data:", scatter_data);



    const option = {
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
            data: ["NTEE " + filters_placeholder[0].toString()],
            left: 'center',
            bottom: 5
        },
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
                // get all the X_axis_var and Y_axis_var data from the data variable for NTEE1
                
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
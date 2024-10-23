'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useRouter } from 'next/navigation';
import { color } from 'd3';

/** 
 * @param data - a list of nonprofits that have been filtered by the user. This data is used to create the scatter plot
 * @param filters - the filters that are used to filter the data. These are used to label the data on the graph
 * @param X_axis_var - the variable that is used for the x-axis of the scatter plot
 * @param Y_axis_var - the variable that is used for the y-axis of the scatter plot
 * 
 * @Overview Creates a scatter plot using the given variables, where they function as filters for the total data that we have
 *           Each NTEE code is a different color on the scatter plot
*/
const ScatterPlot = ({data, X_axis_var,  Y_axis_var, filters}) => {

    // Check for invalid inputs
    if (!Array.isArray(data) || !X_axis_var || !Y_axis_var) {
        return <div>ERROR: Invalid Scatterplot parameters</div>;
    }

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

      // Handle clicks on the scatter plot. When a user clicks on a point, they are redirected to the nonprofit's page
      const router = useRouter();
      const handleChartClick = (params) => {
        console.log(params);
        if (params.componentType === 'series') {
          const nonprofit = data.find((nonprofit) => nonprofit["Nm"] === params.data.name);
          if (nonprofit) {
            // Get the id from the data component
            router.push(`/nonprofit/${params.data.id}`);
          }
        }
      };

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

      // Extract all non null NTEE codes from filters
        const filterKeys = Object.keys(filters).filter(key => filters[key] !== null);

      // Initialize scatter_data with filters
      const scatter_data = {};
      if (filterKeys.length > 0) {
        filterKeys.forEach((filter) => {
          scatter_data[filters[filter]] = [];
        });
      } else {
        scatter_data["All Data"] = [];
      }


      // begin building the scatter data with the data
      data.forEach((nonprofit) => {
        // Get the most recent year for the financial data
        const years = Object.keys(nonprofit).filter(key => key.match(/^\d{4}$/));
        const mostRecentYear = Math.max(...years);
        // Get the x and y values for the scatter plot
        const x = nonprofit[mostRecentYear][X_axis_var];
        const y = nonprofit[mostRecentYear][Y_axis_var];



        const name = nonprofit["Nm"];
        const id = nonprofit["_id"];

        // Get the NTEE code for the nonprofit
        const nteeCode = nonprofit["MajGrp"];
        // If the NTEE code is in the filters, add the data to the scatter plot
        if (scatter_data[nteeCode]) {
          scatter_data[nteeCode].push({
            name: name,
            value: [x, y],
            city: nonprofit["Cty"],
            state: nonprofit["St"],
            zip: nonprofit["Zip"],
            id: id
          });
        } else if (filterKeys.length === 0) {
          scatter_data["All Data"].push({
            name: name,
            value: [x, y],
            city: nonprofit["Cty"],
            state: nonprofit["St"],
            zip: nonprofit["Zip"],
            id: id
          });
        }
      }
      );

      console.log("Scatter Data:", scatter_data);

      const colors = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'];



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
            },
            // itemSize: 30,
            // itemGap: 10,
            // iconStyle: {
            //   color: '#FFFFFF' //Set the color the be white
            // }
        },
        brush: {},
        legend: {
            data: Object.keys(scatter_data),
            left: 'center',
            top: 30,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 20
            }
        },
        xAxis: {
          type: 'value',
          scale: true,
          name: X_axis_label,
          nameTextStyle: {
              color: '#FFFFFF', // Set x-axis name text color to white
              fontSize: 20
          },
          axisLabel: {
              formatter: '{value}',
              color: '#FFFFFF', // Set x-axis label text color to white
              backgroundColor: 'transparent'
          },
          splitLine: {
              show: false
          }
      },
      yAxis: {
          type: 'value',
          scale: true,
          name: Y_axis_label,
          nameTextStyle: {
              color: '#FFFFFF', // Set y-axis name text color to white
              fontSize: 20,
          },
          axisLabel: {
              formatter: '{value}',
              color: '#FFFFFF', // Set y-axis label text color to white

          },
          splitLine: {
              show: false
          }
      },
      series: Object.keys(scatter_data).map((key, index) => ({
        name: key,
        type: 'scatter',
        data: scatter_data[key].map(item => ({
          value: item.value, // Use the value array directly
          name: item.name,
          id: item.id,
          city: item.city,
          state: item.state,
          zip: item.zip
      })),
        itemStyle: {
            color: colors[index % colors.length], // Assign a color from the palette
            opacity: 0.7
        }
    }))
    };

    return (
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
          <ReactECharts option={option} 
                        style={{width: '100%', height: '100%'}}
                        onEvents={{'click': handleChartClick}}
                        />
        </div>
      );

};

export default ScatterPlot;
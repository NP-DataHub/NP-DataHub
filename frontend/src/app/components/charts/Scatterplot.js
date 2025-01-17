'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useRouter } from 'next/navigation';
import ntee_codes from '../ntee';
import { color } from 'd3';
import { get } from 'mongoose';

/** 
 * @param data - a list of nonprofits that have been filtered by the user. This data is used to create the scatter plot
 * @param filters - the filters that are used to filter the data. These are used to label the data on the graph
 * @param X_axis_var - the variable that is used for the x-axis of the scatter plot
 * @param Y_axis_var - the variable that is used for the y-axis of the scatter plot
 * 
 * @Overview Creates a scatter plot using the given variables, where they function as filters for the total data that we have
 *           Each NTEE code is a different color on the scatter plot
 */
const ScatterPlot = ({ data, X_axis_var, Y_axis_var, filters, isDarkMode }) => {

  console.log("Filters:", filters);

  // Handles resizing of the chart
  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const router = useRouter();

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

  const handleChartClick = (params) => {
    if (params.componentType === 'series') {
      const nonprofit = data.find((nonprofit) => nonprofit["Nm"] === params.data.name);
      if (nonprofit) {
        router.push(`/nonprofit/${params.data.id}`);
      }
    }
  };

  // Get the NTEE code descriptions
  const getNteeDescription = (nteeCode) => {
    return ntee_codes[nteeCode] || 'N/A';
  };


  // Check for invalid inputs
  if (!Array.isArray(data) || data === null || data === undefined) {
    return <div>ERROR: chart arg must be an array, or chart arg is undefined</div>;
  }

  if(!X_axis_var || !Y_axis_var){
    return <div>ERROR: X and Y axis variables must be defined</div>;
  }

  if(!filters){
    return <div>ERROR: filters must be defined</div>;
  }

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const labels = {
    TotRev: 'Total Revenue',
    TotExp: 'Total Expenses',
    TotAst: 'Total Assets',
    TotLia: 'Total Liabilities',
  };

  const X_axis_label = labels[X_axis_var];
  const Y_axis_label = labels[Y_axis_var];

  const filterKeys = Object.keys(filters).filter((key) => filters[key] !== null);

  const scatter_data = {};
  if (filterKeys.length > 0) {
    filterKeys.forEach((filter) => {
      scatter_data[filters[filter]] = [];
    });
  } else {
    scatter_data['All Data'] = [];
  }

  data.forEach((nonprofit) => {
    const years = Object.keys(nonprofit).filter((key) => key.match(/^\d{4}$/));
    const mostRecentYear = Math.max(...years);
    const x = nonprofit[mostRecentYear][X_axis_var];
    const y = nonprofit[mostRecentYear][Y_axis_var];
    const name = nonprofit["Nm"];
    const id = nonprofit["_id"];
    const nteeCode = nonprofit["MajGrp"];

    if (scatter_data[nteeCode]) {
      scatter_data[nteeCode].push({
        name,
        value: [x, y],
        city: nonprofit["Cty"],
        state: nonprofit["St"],
        zip: nonprofit["Zip"],
        id,
      });
    } else if (filterKeys.length === 0) {
      scatter_data['All Data'].push({
        name,
        value: [x, y],
        city: nonprofit["Cty"],
        state: nonprofit["St"],
        zip: nonprofit["Zip"],
        id,
      });
    }
  });

  const colors = ['#FF00FF', '#3366ff', '#FF4500', '#00ff00', '#b84dff', '#00FF00', '#00FFFF', '#1E90FF'];

  const axisColor = isDarkMode ? '#FFFFFF' : '#000000'; // Adjust color dynamically

  // Rename the keys in the scatter_data object to be the NTEE code descriptions
  Object.keys(scatter_data).forEach((key) => {
    if(key === 'All Data') return;
    scatter_data[`${key} - ${getNteeDescription(key)}`] = scatter_data[key];
    delete scatter_data[key];
  });
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      formatter: function (params) {
        const tooltipContent = params
          .map((item) => {
            return `<strong>${item.name}</strong><br/> 
                    ${item.data.city}, ${item.data.state} ${item.data.zip}<br/>
                    ${X_axis_label}: ${formatNumber(item.value[0])}<br/>
                    ${Y_axis_label}: ${formatNumber(item.value[1])}`;
          })
          .join('<br/>');
        return tooltipContent;
      },
    },
    // grid: {
    //   // left: 20,
    //   // bottom: 50,
    //   // right: 20,
    //   // top: 80, // Increase top padding for labels and legend
    //   // containLabel: true,
    // },
    toolbox: {
      feature: {
        dataZoom: {},
        brush: { type: ['rect', 'polygon', 'clear'] },
      },
    },
    brush: {},
    legend: {
      data: Object.keys(scatter_data),
      left: 'center',
      top: 10, // Ensure legend fits within the grid
      textStyle: { color: axisColor, fontSize: 14 },
    },
    xAxis: {
      type: 'value',
      scale: true,
      name: X_axis_label,
      nameTextStyle: { color: axisColor, fontSize: 18 },
      axisLabel: { formatter: (value) => formatNumber(value), 
        color: axisColor, 
        fontSize: 12 },
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: Y_axis_label,
      nameTextStyle: { color: axisColor, fontSize: 18 },
      axisLabel: { formatter: (value) => formatNumber(value), 
        color: axisColor, 
        fontSize: 12 },
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { show: false },
    },
    series: Object.keys(scatter_data).map((key, index) => ({
      name: key,
      type: 'scatter',
      data: scatter_data[key].map((item) => ({
        value: item.value,
        name: item.name,
        id: item.id,
        city: item.city,
        state: item.state,
        zip: item.zip,
      })),
      itemStyle: { color: colors[index % colors.length], opacity: 0.7 },
    })),
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        onEvents={{ click: handleChartClick }}
      />
    </div>
  );
};

ScatterPlot.displayname = 'ScatterPlot'

export default ScatterPlot;

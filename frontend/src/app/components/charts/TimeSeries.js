'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import regression from 'regression';
import { split } from 'postcss/lib/list';
/**
 * @param values -   an array of values measured each year
*/

const TimeSeries = ({values, minYear}) => {
  // ensures arg is an array
  if (!Array.isArray(values) || values.length === 0) {
    console.log(values);
    return <div>ERROR: chart arg must be an array</div>;
  }

  const chartContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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

  const data = values.map((value, index) => [index, value]);
  const fitted_line = regression.linear(data);

  // print the regression line
  //console.log(fitted_line);


  // extend the data to include the predicted values
  const extendedData = Array.from({ length: values.length + 2 }, (_, index) => [index, fitted_line.predict(index)[1]]);
  const FittedData = extendedData.slice(0, values.length);
  const predictedData = extendedData.slice(extendedData.length);

  // debug
  //console.log(extendedData);
  //console.log(FittedData);
  //console.log(predictedData);

  const option = {
    legend: {
      data: ['Data', 'Trend Line'],
      textStyle: {
        color: 'white'
      }
    },
    dataset: [
      {
        // Real data
        source: data
      },
      {
        // fitted data - for the dashed regression line
        source: FittedData
      },
      {
        // predicted data
        source: extendedData
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      trigger: 'axis',
      formatter: function (params) {
        let tooltipContent = `<div>${params[0].name}<br/>`;
        params.forEach(item => {
          tooltipContent += `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
                ${item.seriesName}: 
              </span>
              <span style="text-align: right;">&nbsp;$${formatNumber(item.value)}</span>
            </div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      }
    },
    grid: {
      left: 0,
      bottom: 0.036 * dimensions.width,
      right: 0,
      top: 0.01 * dimensions.width,
      containLabel: true
    },
    xAxis: [
      {
        //name: 'Year',
        nameLocation: 'middle',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: Math.round(0.036 * dimensions.width),
        },
        type: 'category',
        data: Array.from({ length: values.length + 2 }, (_, index) => index + parseInt(minYear)),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: Math.round(0.015 * dimensions.width)
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value) {
            return '$' + formatNumber(value);
          },
          fontSize: Math.round(0.015 * dimensions.width)
        },
        splitLine: {
          show: false
        }

      }
    ],
    series: [
      {
        name: 'Data',
        type: 'line',
        datasetIndex: 0,
        symbol: 'circle',
        itemStyle: {
          color: '#0770FF'
        },

      },
      {
        name: 'Trend Line',
        type: 'line',
        datasetIndex: 2,
        color: 'red', // Set the color of the regression line here
        lineStyle: {
          type: 'dashed'
        },
        symbol: 'circle',
        itemStyle: {
          color: 'red'
        }
      },
      // {
      //   name: 'Predicted',
      //   type: 'line',
      //   datasetIndex: 2,
      //   symbol: 'none',
      //   color: 'red'
      // }
    ],
    graphic: {
      type: 'text',
      left: '5%',
      bottom: 'bottom',
      style: {
        text: 'Accuracy (R²): ' + fitted_line.r2.toFixed(2),
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'white'
      }
    }
  };
  //console.log(option)

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option}/>
    </div>
  );
};

export default TimeSeries;


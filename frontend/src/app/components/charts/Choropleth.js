'use client';

import React, { useEffect, useState, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

/**
 * @param sector the non-profit sector to pull data from
 */
const Choropleth = (sector) => {

  const [option, setOption] = useState(null);

  // used to convert abbreviatoms from db to full names
  const abbreviationToName = {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District of Columbia',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
    PR: 'Puerto Rico',
  };

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

  useEffect(() => {
    const fetchData = async () => {

      // retrieve map data
      const PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/95368/USA_geo.json';
      response = await fetch(PATH);
      const usaJson = await response.json();

      echarts.registerMap('USA', usaJson, {
        Alaska: {
          left: -131,
          top: 25,
          width: 15
        },
        Hawaii: {
          left: -110,
          top: 24,
          width: 5
        },
        'Puerto Rico': {
          left: -76,
          top: 26,
          width: 2
        }
      });

      const chartOption = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2
        },
        formatter: function (params) {
          return `${params.name}: $${formatNumber(params.value)}`;
        },
        visualMap: {
          left: 'right',
          min: 500000,
          max: 38000000,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          },
          text: ['High', 'Low'],
          textStyle: {
            fontWeight: 'bold',
            color: '#666666',
          },
          calculable: true,
          show: true,
        },
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          containLabel: false
        },
        series: [
          {
            name: 'USA PopEstimates',
            type: 'map',
            roam: true,
            map: 'USA',
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { name: 'Alabama', value: 4822023 },
              { name: 'Alaska', value: 731449 },
              { name: 'Arizona', value: 6553255 },
              { name: 'Arkansas', value: 2949131 },
              { name: 'California', value: 38041430 },
              { name: 'Colorado', value: 5187582 },
              { name: 'Connecticut', value: 3590347 },
              { name: 'Delaware', value: 917092 },
              { name: 'District of Columbia', value: 632323 },
              { name: 'Florida', value: 19317568 },
              { name: 'Georgia', value: 9919945 },
              { name: 'Hawaii', value: 1392313 },
              { name: 'Idaho', value: 1595728 },
              { name: 'Illinois', value: 12875255 },
              { name: 'Indiana', value: 6537334 },
              { name: 'Iowa', value: 3074186 },
              { name: 'Kansas', value: 2885905 },
              { name: 'Kentucky', value: 4380415 },
              { name: 'Louisiana', value: 4601893 },
              { name: 'Maine', value: 1329192 },
              { name: 'Maryland', value: 5884563 },
              { name: 'Massachusetts', value: 6646144 },
              { name: 'Michigan', value: 9883360 },
              { name: 'Minnesota', value: 5379139 },
              { name: 'Mississippi', value: 2984926 },
              { name: 'Missouri', value: 6021988 },
              { name: 'Montana', value: 1005141 },
              { name: 'Nebraska', value: 1855525 },
              { name: 'Nevada', value: 2758931 },
              { name: 'New Hampshire', value: 1320718 },
              { name: 'New Jersey', value: 8864590 },
              { name: 'New Mexico', value: 2085538 },
              { name: 'New York', value: 19570261 },
              { name: 'North Carolina', value: 9752073 },
              { name: 'North Dakota', value: 699628 },
              { name: 'Ohio', value: 11544225 },
              { name: 'Oklahoma', value: 3814820 },
              { name: 'Oregon', value: 3899353 },
              { name: 'Pennsylvania', value: 12763536 },
              { name: 'Rhode Island', value: 1050292 },
              { name: 'South Carolina', value: 4723723 },
              { name: 'South Dakota', value: 833354 },
              { name: 'Tennessee', value: 6456243 },
              { name: 'Texas', value: 26059203 },
              { name: 'Utah', value: 2855287 },
              { name: 'Vermont', value: 626011 },
              { name: 'Virginia', value: 8185867 },
              { name: 'Washington', value: 6897012 },
              { name: 'West Virginia', value: 1855413 },
              { name: 'Wisconsin', value: 5726398 },
              { name: 'Wyoming', value: 576412 },
              { name: 'Puerto Rico', value: 3667084 }
            ]
          }
        ]
      };

      setOption(chartOption);
    };

    fetchData();
  }, []);

  if (!option) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
        <ReactECharts option={option}/>
      </div>
  );
};

export default Choropleth;
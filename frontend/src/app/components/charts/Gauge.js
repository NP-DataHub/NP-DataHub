import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const Gauge = ({ orgName, selectedMetric, nonprofitData, sectorData, mostRecentYear, stateName }) => {
  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Map selectedMetric to specific fields for state data and national data
  const stateMetricMap = {
    TotRev: 'RevMed',
    TotExp: 'ExpMed',
    TotAst: 'AstMed',
    TotLia: 'LiaMed',
  };
  const nationalMetricMap = {
    TotRev: 'NatMedRev',
    TotExp: 'NatMedExp',
    TotAst: 'NatMedAst',
    TotLia: 'NatMedLia',
  };

  // Fetch values based on the selected metric
  const orgVal = nonprofitData[mostRecentYear]?.[selectedMetric] || 0;
  const stateVal = sectorData[mostRecentYear]?.[stateName]?.[stateMetricMap[selectedMetric]] || 0;
  const nationalVal = sectorData[mostRecentYear]?.[nationalMetricMap[selectedMetric]] || 0;

  // Split long text if it exceeds a certain length (for example, 15 characters)
  const splitText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach((word) => {
      if ((line + word).length > maxLength) {
        lines.push(line.trim());
        line = '';
      }
      line += `${word} `;
    });
    lines.push(line.trim());
    return lines.join('\n')+'\n';
  };

  const formattedOrgName = splitText(orgName, 30);
  const formattedStateName = splitText(`${stateName} Median`, 30);

  // Get the maximum value to normalize the gauge
  const maxVal = Math.max(orgVal, stateVal, nationalVal);

  const gaugeData = [
    {
      value: (orgVal / maxVal) * 100,
      name: formattedOrgName,
      title: { 
        offsetCenter: ['0%', '-35%'], 
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-22%'],
        formatter: () => `$${formatNumber(orgVal)}`,
      },
    },
    {
      value: (stateVal / maxVal) * 100,
      name: formattedStateName,
      title: { 
        offsetCenter: ['0%', '5%'], 
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '18%'],
        formatter: () => `$${formatNumber(stateVal)}`,
      },
    },
    {
      value: (nationalVal / maxVal) * 100,
      name: 'National Median',
      title: { 
        offsetCenter: ['0%', '45%'], 
        color: '#A9DFD8',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '58%'],
        formatter: () => `$${formatNumber(nationalVal)}`,
      },
    },
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
    grid: { left: 0, right: 0, bottom: 0, top: 0, containLabel: true },
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '95%',
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: { borderWidth: 1, borderColor: '#464646' },
        },
        axisLine: { lineStyle: { width: 30, color: [[1, '#464646']] } },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: gaugeData,
        title: { fontSize: Math.max(0.025 * dimensions.width, 12) },
        detail: {
          width: dimensions.width,
          height: dimensions.height,
          fontSize: Math.max(0.025 * dimensions.width, 12),
          color: 'inherit',
        },
      },
    ],
  };

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default Gauge;

'use client';

import React, { useRef, useEffect, useState, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Tooltip } from 'react-tooltip';

// Import the SimilarityScore function from the similarityScore.js file - custom hueristic to calculate similarity between two nonprofits
import SimilarityScore from '@/app/components/SimilarityScore';

/**
 * 
 * @param data - a list of nonprofits that have been filtered by the user. 
 * @param filters - the filters that are used to filter the data. These are used to label the data on the graph
 */

const COLABGraph = memo(({data, filters, onNonprofitClick, isDarkMode, threshold}) => {

    //console.log("colab data:", data);

    // Handle the click event on the graph
    const handleGraphClick = (node) => {
      
      onNonprofitClick(node.nonprofit);
    };


    // Check for invalid inputs
    if (!Array.isArray(data)) {
        return <div>ERROR: chart arg must be an array</div>;
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

      // // Find the min and max revenue for scaling the nodes
      // let min_revenue = 0;
      // let max_revenue = 0;

      // // loop through each nonprofit, find the most recent year, and get the revenue
      // data.forEach((entry) => {
      //   console.log("Entry:", entry);
      //   const nonprofit = entry.nonprofit;
      //   console.log("Nonprofit:", nonprofit);
      //   // Get the year most recent year with financial data
      //   const years = Object.keys(nonprofit).filter(year => !isNaN(year)).sort();
      //   let mostRecentYear = years[years.length - 1];
      //   const revenue = nonprofit[mostRecentYear]['TotRev'];


      //   // Update the min and max revenue
      //   if(min_revenue === 0){
      //     min_revenue = revenue;
      //   }
      //   if (revenue < min_revenue && revenue > 0) {
      //     min_revenue = revenue;
      //   }
      //   if (revenue > max_revenue) {
      //     max_revenue = revenue;
      //   }
      // });


      /**
       *  Create a graph of all the nonprofits in the data
       *  - Each node is a nonprofit
       *  - Scale the size of the node based on their revenue
       *  - Each edge is represents nonprofits that have a similarity score above a certain threshold
       *  - The color of the node is based on the NTEE code
       */

      // Create the nodes
      let i = 0;
      const nodes = data.map(( entry ) => {
        const nonprofit = entry.nonprofit;
        // // --- Dynamic Size Calculation ---
        // // Get the most recent year with financial data
        // const years = Object.keys(nonprofit).filter(year => !isNaN(year)).sort();
        // let mostRecentYear = years[years.length - 1];
        // const revenue = nonprofit[mostRecentYear]['TotRev'];

        // // Scale the size of the node based on the revenue.
        // // Scale should be in the range [6, 20], scaled exponentially based on the revenue
        // let node_size = 6;
        // if(revenue > 0){
        //   node_size = 6 + 12 * Math.log(revenue / min_revenue) / Math.log(max_revenue / min_revenue);
        // }

        let node_size = 20;

        return {
          id: i++,
          name: nonprofit.Nm,
          category: nonprofit.NTEE,

          /**
           *  TODO: Add color coding based on the NTEE code
           */

          /**
           *  TODO: Create a smarter way of placing nodes on the graph. Not exactly sure how to do this yet
           */
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,

          symbolSize: node_size,
          

          //symbolSize: nonprofit.Rev / 1000000,
          //value: nonprofit.Rev,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}',
          },
        };
      });

      //console.log("Nodes:", nodes);

      // Create the edges
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let score = SimilarityScore(data[i].nonprofit, data[j].nonprofit);
          //console.log("comparing", data[i].nonprofit.Nm, data[j].nonprofit.Nm, score);
          if (score >= threshold){    
            edges.push({ source: nodes[i].id, target: nodes[j].id});
          }
        }
      }


      // Get categories (NTEE codes) from the filters param
      const categories = [];
      const NTEE_codes = new Set(filters.map((filter) => filter.NTEE));

      const option = {
        tooltip: {
          formatter: function (params) {
            //console.log("Params:", params);
            let tooltipContent = `<div>${params.name}<br/>`;
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
        // legend: {
        //   //data: Array.from(NTEE_codes),
        // },
        series: [
          {
            name: 'COLAB Graph',
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            roam: true,
            label: {
              show: true,
            },
            force: {
              repulsion: 300,
              gravity: 0.1,
            },
            data: nodes,
            links: edges
            //categories: categories,
          },
        ],
      };

    return (
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
          <ReactECharts option={option}
            style={{ width: '100%', height: '100%' }}
            onEvents={ {click: (e) => handleGraphClick(data[e.dataIndex])} }
          />
        </div>
      );

});

export default COLABGraph;
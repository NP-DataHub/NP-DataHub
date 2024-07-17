'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';


/**
 * @param input_data -   who knows what this is ultimately supposed to be
 * @param style -    a struct containing format options - height and width
 *                   must be defined as numbers.
*/
const SectorGraph = ({input_data, style}) => {

    var option = {
        title: {
            text: 'Simple Node-Edge Graph'
        },
        tooltip: {},
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 20,
                roam: true,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{b}'
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: [
                    {name: 'Node1'},
                    {name: 'Node2'},
                    {name: 'Node3'},
                    {name: 'Node4'}
                ],
                links: [
                    {source: 'Node1', target: 'Node2'},
                    {source: 'Node2', target: 'Node3'},
                    {source: 'Node3', target: 'Node4'},
                    {source: 'Node4', target: 'Node1'}
                ],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0.3
                }
            }
        ]
    };





    return (
        <ReactECharts option={option} style={style} />
    );

};

export default SectorGraph;
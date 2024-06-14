// components/BarChart.js
import { ResponsiveBar } from '@nivo/bar';

const data = [
  { country: 'AD', 'hot dog': 60, 'hot dogColor': 'hsl(229, 70%, 50%)', burger: 80, burgerColor: 'hsl(296, 70%, 50%)', sandwich: 100, sandwichColor: 'hsl(97, 70%, 50%)', kebab: 120, kebabColor: 'hsl(340, 70%, 50%)', fries: 140, friesColor: 'hsl(84, 70%, 50%)', donut: 160, donutColor: 'hsl(198, 70%, 50%)' },
  { country: 'AE', 'hot dog': 70, 'hot dogColor': 'hsl(229, 70%, 50%)', burger: 90, burgerColor: 'hsl(296, 70%, 50%)', sandwich: 110, sandwichColor: 'hsl(97, 70%, 50%)', kebab: 130, kebabColor: 'hsl(340, 70%, 50%)', fries: 150, friesColor: 'hsl(84, 70%, 50%)', donut: 170, donutColor: 'hsl(198, 70%, 50%)' }
];

const BarChart = () => (
  <ResponsiveBar
    data={data}
    keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
    indexBy="country"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={{ scheme: 'nivo' }}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'food',
      legendPosition: 'middle',
      legendOffset: -40
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
);

export default BarChart;
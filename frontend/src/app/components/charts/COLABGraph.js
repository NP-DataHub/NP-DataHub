'use client';

import React, { useRef, useEffect, useState, memo} from 'react';
import ReactECharts from 'echarts-for-react';
import { Tooltip } from 'react-tooltip';
import addrToLatLong from '@/pages/api/geocode';

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Import the SimilarityScore function from the similarityScore.js file - custom hueristic to calculate similarity between two nonprofits
import SimilarityScore from '@/app/components/SimilarityScore';

const getColorForNTEE = (ntee) => {
  // Use the first letter of the NTEE code
  const char = ntee[0].toUpperCase();
  // Map 'A' to 0, 'B' to 1, ... 'Z' to 25
  const charCode = char.charCodeAt(0) - 65;
  // Convert to a hue (0 to 360 degrees)
  const hue = (charCode / 26) * 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const averageHue = (color1, color2) => {
  const hsl1 = color1.match(/\d+/g).map(Number);
  const hsl2 = color2.match(/\d+/g).map(Number);

  const avgHue = Math.round((hsl1[0] + hsl2[0]) / 2); // Average the hue
  return `hsl(${avgHue}, 70%, 50%)`; // Keep saturation & lightness fixed
};

async function createGraph(data, threshold) {
  // Convert addresses to lat/lng asynchronously
  const nodes = await Promise.all(
    data.map(async (item, i) => {
      let location = await addrToLatLong(item.nonprofit);
      return {
        id: i,
        name: item.nonprofit.Nm,
        ntee: item.nonprofit.NTEE,
        lat: location.lat,
        lng: location.lng,
      };
    })
  );

  // Create edges based on similarity score
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let score = SimilarityScore(data[i].nonprofit, data[j].nonprofit);
      if (score >= threshold) {
        const color1 = getColorForNTEE(nodes[i].ntee);
        const color2 = getColorForNTEE(nodes[j].ntee);
        const avgColor = averageHue(color1, color2);
        edges.push({
          coords: [
            [nodes[i].lat, nodes[i].lng],
            [nodes[j].lat, nodes[j].lng],
          ],
          similarityScore: score,
          color: avgColor,
        });
      }
    }
  }
  
  return { nodes, edges };
}

const computeCenter = (nodes) => {
  // Return the default center if there are no nodes
  if (!nodes.length) return [37.7749, -98.5795];

  let sumLat = 0;
  let sumLng = 0;
  
  nodes.forEach(node => {
    sumLat += node.lat;
    sumLng += node.lng;
  });
  
  const avgLat = sumLat / nodes.length;
  const avgLng = sumLng / nodes.length;
  
  return [avgLat, avgLng];
};


const FitBounds = ({ nodes, buffer = 0.05 }) => {
  const map = useMap();

  useEffect(() => {
    if (nodes.length === 0) return; // Prevent error if no nodes

    const bounds = L.latLngBounds(nodes.map(node => [node.lat, node.lng]));

    // Add a buffer to the bounds
    const paddedBounds = bounds.pad(buffer);

    // Fit the map to the new bounds
    map.fitBounds(paddedBounds);
  }, [nodes, buffer, map]);

  return null;
};

/**
 * 
 * @param data - a list of nonprofits that have been filtered by the user. 
 * @param filters - currently unused
 */

const COLABGraph = ({data, filters, onNonprofitClick, isDarkMode, threshold}) => {

  // Handles resizing of the chart - BEFORE THE CONDITIONAL RETURNS!!!!!!!!!
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

  // Handle the click event on the graph
  const handleGraphClick = (node) => {
    console.log(node)
    if(node != undefined){
      onNonprofitClick(node.nonprofit);
    }
  };


  /**
   * Unforetunately, the component currently loads in even with no data. I have tried to fix this but lowk couldn't be bothered,
   * so this is a workaround. 
   * 
   * fetchGraph reloads nodes and edges used to create the graph upon a change in data or threshold
   */
  const [nodes, setNodes] = useState([]); 
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {

          /**
           * Since I really dont feel like using Cal's map, I am repurposing mine to work in his regional health tool.
           * The one caveat here is that this expects data to be of the form [ {nonprofit, score}, ... ], whereas Cal's
           * is just [ {...}, ...]. So, I simply give each entry a score of 100, since there is no thresholding.
           * 
           * Really we should just make a single map component that is robust enough to be reused without all this tomfoolery,
           * but I digress...
           * 
           * -Emmet W.
           */
          if( data.length > 0 && !('score' in data[0])) {
            data = data.map( item => ( { nonprofit: item, score: 0 } ) );
          }



        const { nodes, edges } = await createGraph(data, threshold);
        setNodes(nodes);
        setEdges(edges);
      } catch (error) {
        console.error("Error creating graph:", error);
      }
    };

    fetchGraph();
  }, [data, threshold]);


  /**
   * Another workaround, this is a result of the parent divs of which this component resides having no fixed size.
   * This causes the graph to break visually on the first load. Resizing is required to fix it.
   * 
   * This causes a graph reload by invalidating the map object, which recomputes to the current div size.
   * 
   */
  function InvalidateMapSize() {
    const map = useMap();
  
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
  
    return null;
  }

  // Check for invalid inputs
  if (!Array.isArray(data)) {
    return <div>ERROR: chart arg must be an array</div>;
  }

    return (
        <div ref={chartContainerRef} className="w-full h-full rounded-lg overflow-hidden">
            <MapContainer
              center={computeCenter( nodes )}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
            >
              <InvalidateMapSize/>
              <FitBounds nodes={nodes} buffer={0.05} />
              {/* Minimalist Map */}
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png"
                attribution='&copy; Stadia Maps, Stamen Design'
              />

              {/* Render Nonprofit Nodes */}
              {nodes.map((node) => (
                <CircleMarker
                  key={node.id}
                  center={[node.lat, node.lng]}
                  radius={10} // Adjust radius as needed
                  pathOptions={{ color: getColorForNTEE(node.ntee), fillColor: getColorForNTEE(node.ntee), fillOpacity: 0.8 }}
                >
                <Popup>
                  <b>{node.name}</b> <br />
                  Category: {node.ntee}
                </Popup>
                </CircleMarker>
              ))}

              {/* Render Edges (Connections) */}
              {edges.map((edge, index) => (
                <Polyline key={index} positions={edge.coords} pathOptions={{ color: edge.color, weight: 2 }} />
              ))}
            </MapContainer>
        </div>
      );
};

COLABGraph.displayName = 'COLABGraph'

export default COLABGraph;
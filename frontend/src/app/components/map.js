import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as d3 from 'd3';
import 'tippy.js/dist/tippy.css';
import tippy from 'tippy.js';

// Dummy data (GeoJSON format)
const geoJsonData = {
  "type": "FeatureCollection",
  "features": [
    // Add your GeoJSON features here
  ]
};

// Function to style each feature based on a property
const getColor = d => {
  // Define your logic to assign color based on data
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
};

const style = feature => {
  return {
    fillColor: getColor(feature.properties.density), // Adjust property name as needed
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
};

const onEachFeature = (feature, layer) => {
  const tooltipContent = `<div>
    <h4>${feature.properties.name}</h4> <!-- Adjust property name as needed -->
    <p>Density: ${feature.properties.density}</p> <!-- Adjust property name as needed -->
  </div>`;

  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      tippy(layer.getElement(), {
        content: tooltipContent,
        allowHTML: true,
        theme: 'light',
        interactive: true,
        appendTo: document.body
      });
    },
    mouseout: (e) => {
      geoJsonLayer.resetStyle(e.target);
    }
  });
};

const ChoroplethMap = () => {
  return (
    <MapContainer style={{ height: "600px", width: "100%" }} center={[37.8, -96]} zoom={4}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default ChoroplethMap;

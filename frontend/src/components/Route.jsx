import { Source, Layer } from "react-map-gl";
import { useEffect, useState } from "react";

const Route = ({ routeData, routeOpacity, mapLoaded }) => {
  return (
    routeData && (
      <Source
        id="route"
        type="geojson"
        data={{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeData.geometry.coordinates,
          },
          properties: {},
        }}
      >
        <Layer
          id="route-line"
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#3B82F6", // Customize the color of the ant line
            "line-width": 8, // Adjust the width of the line
            "line-opacity": routeOpacity.line,
            "line-border-color": "#1350b1",
            "line-border-width": 1,
          }}
        />
      </Source>
    )
  );
};

export default Route;

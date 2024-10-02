import { Source, Layer } from "react-map-gl";
import { useEffect, useState } from "react";

const Route = ({ routeData, routeOpacity, mapLoaded }) => {
  const [dashArray, setDashArray] = useState([0, 4, 3]);

  const animateRoute = () => {
    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5],
    ];

    let step = 0;

    function animateDashArray(timestamp) {
      const newStep = parseInt((timestamp / 100) % dashArraySequence.length);

      if (newStep !== step) {
        setDashArray(dashArraySequence[step]);

        step = newStep;
      }

      requestAnimationFrame(animateDashArray);
    }

    animateDashArray(0);
  };

  useEffect(() => {
    if (mapLoaded) {
      animateRoute();
    }
  }, [mapLoaded]);

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
          id="route-background"
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#3B82F6", // Customize the color of the ant line
            "line-width": 6, // Adjust the width of the line
            "line-opacity": routeOpacity.background,
          }}
        />

        <Layer
          id="route-line"
          type="line"
          paint={{
            "line-color": "#3B82F6", // Customize the color of the ant line
            "line-width": 6, // Adjust the width of the line
            "line-dasharray": dashArray,
            "line-opacity": routeOpacity.line,
          }}
        />
      </Source>
    )
  );
};

export default Route;

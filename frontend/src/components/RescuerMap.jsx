import { useState, useRef } from "react";
import { GeolocateControl, Map as MapGL } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const RescuerMap = () => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef();
  const geoControlRef = useRef();

  const handleGeolocation = (coords) => {
    setRescuer({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  //TODO: add markers, route, distance, eta, diff view
  return (
    <MapGL
      ref={mapRef}
      initialViewState={rescuer}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onLoad={() => {
        geoControlRef.current?.trigger();
        setMapLoaded(true);
      }}
    >
      <GeolocateControl
        ref={geoControlRef}
        position="top-right"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserLocation={false}
        onGeolocate={({ coords }) => {
          handleGeolocation(coords);
        }}
      />
    </MapGL>
  );
};

export default RescuerMap;

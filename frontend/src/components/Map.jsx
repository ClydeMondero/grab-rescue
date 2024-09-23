import { useState, useRef, useEffect } from "react";
import { Map as MapGL, GeolocateControl, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import citizenMarker from "../assets/citizen-marker.png";
import rescuerMarker from "../assets/rescuer-marker.png";

const Map = ({ locations }) => {
  //set initial viewport to BSU-BUSTOS
  const [viewport, setViewport] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });
  const geoControlRef = useRef();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkers(locations);
  }, [locations]);

  return (
    <MapGL
      initialViewState={viewport}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onLoad={() => {
        geoControlRef.current?.trigger();
      }}
    >
      <GeolocateControl
        ref={geoControlRef}
        position="top-right"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserLocation={false}
        onGeolocate={({ coords }) => {
          setViewport({
            longitude: coords.longitude,
            latitude: coords.latitude,
            zoom: 15,
          });
        }}
      />
      <Popup
        longitude={viewport.longitude}
        latitude={viewport.latitude}
        offset={10}
        closeButton={false}
      >
        You are here!
      </Popup>

      {/* Citizen marker */}
      <Marker longitude={viewport.longitude} latitude={viewport.latitude}>
        <img src={citizenMarker} width={25} height={25} />
      </Marker>

      {/* Rescuers marker */}
      {markers.map(
        (marker) =>
          marker.status === "available" && (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
            >
              <img src={rescuerMarker} width={30} height={30} />
            </Marker>
          )
      )}
    </MapGL>
  );
};

export default Map;

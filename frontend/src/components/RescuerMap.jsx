import { useState, useRef, useEffect } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocating } from "../hooks";
import { LocatingIndicator } from "../components";
import { RescuerMarker } from "../components";
import {
  addUserLocation,
  updateUserLocation,
} from "../services/locationService";
import { getIDFromCookie } from "../services/authService";
import { getLocationsFromFirestore } from "../services/firestoreService";

//TODO: Show markers, controls, routes
const RescuerMap = () => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  const [locations, setLocations] = useState(null);

  const mapRef = useRef();
  const geoControlRef = useRef();

  const locating = useLocating(geoControlRef);

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  //TODO: fix duplcate locations
  const handleGeolocation = async (coords) => {
    const locations = await getLocationsFromFirestore("rescuer");

    const id = await getIDFromCookie();

    // Use some to check if the location already exists
    const existingLocation = locations.find(
      (location) => location.userId === id
    );

    if (existingLocation) {
      // If location exists, update it
      updateUserLocation(
        existingLocation.id,
        rescuer.longitude,
        rescuer.latitude,
        coords.longitude,
        coords.latitude
      );
    } else {
      // If location does not exist, add a new one
      addUserLocation(coords.longitude, coords.latitude, "rescuer", id);
    }

    setRescuer({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  return (
    <MapGL
      ref={mapRef}
      initialViewState={rescuer}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      maxBounds={bounds}
      maxZoom={18}
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
          handleGeolocation(coords);
        }}
      />

      {locating && <LocatingIndicator locating={locating} type="rescuer" />}

      {!locating && (
        <Marker longitude={rescuer.longitude} latitude={rescuer.latitude}>
          <RescuerMarker view="top-down" />
        </Marker>
      )}
    </MapGL>
  );
};

export default RescuerMap;

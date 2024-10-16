import { useState, useRef, useEffect } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocating } from "../hooks";
import { LocatingIndicator } from "../components";
import { RescuerMarker } from "../components";
import {
  addUserLocation,
  updateUserLocation,
  getRescuerLocations,
} from "../services/locationService";
import { getUserCookie } from "../services/cookieService";

const RescuerMap = () => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  const [locations, setLocations] = useState([]);

  const mapRef = useRef();
  const geoControlRef = useRef();

  const locating = useLocating(geoControlRef);

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  //TODO: save rescuer location
  const handleGeolocation = async (coords) => {
    if (!mapRef.current) return;
    const cookie = getUserCookie("token");

    // Use find to check if the location already exists
    const existingLocation = locations.find(
      (location) => location.userId === cookie
    );

    if (existingLocation) {
      console.log("updating rescuer location");

      // If location exists, update it
      updateUserLocation(
        existingLocation.id,
        rescuer.longitude,
        rescuer.latitude,
        coords.longitude,
        coords.latitude
      );
    } else {
      console.log("adding rescuer location");

      // If location does not exist, add a new one
      addUserLocation(coords.longitude, coords.latitude, "rescuer", cookie);
    }

    setRescuer({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  useEffect(() => {
    getRescuerLocations(setLocations);
  }, []);

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

import { useState, useRef, useEffect, useContext } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocating } from "../hooks";
import {
  LocatingIndicator,
  RescuerMarker,
  DistanceEta,
  Route,
  Controls,
} from "../components";
import {
  addUserLocation,
  updateUserLocation,
  getRouteData,
} from "../services/locationService";
import { getIDFromCookie } from "../services/authService";
import { getLocationsFromFirestore } from "../services/firestoreService";
import { RescuerContext } from "../contexts/RescuerContext";
import { FaLocationPin } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { setGeolocateIcon } from "../utils/GeolocateUtility";

//TODO: Show markers, controls, routes
//TODO: show no current request
const RescuerMap = ({ citizen }) => {
  const { rescuer, setRescuer } = useContext(RescuerContext);
  const [locations, setLocations] = useState(null);

  const mapRef = useRef();
  const geoControlRef = useRef();
  const buttonsRef = useRef();

  const locating = useLocating(geoControlRef);

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  const [routeData, setRouteData] = useState(null);
  const [routeOpacity, setRouteOpacity] = useState({
    background: 0.2,
    line: 1,
  });

  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const location = useLocation();

  const handleGeolocation = async (coords) => {
    if (mapRef.current.resize()) {
      mapRef.current.resize();
    }

    setGeolocateIcon(location);

    if (locations == null) return;

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

  const getRoute = async () => {
    const route = await getRouteData(rescuer, citizen);

    setRouteData(route);
    setDistance(route.distance);
    setEta(route.duration);
  };

  useEffect(() => {
    if (citizen) {
      getRoute();
    }
  }, [citizen, rescuer]);

  useEffect(() => {
    const unsubscribe = getLocationsFromFirestore("rescuer", setLocations);

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <MapGL
      ref={mapRef}
      initialViewState={rescuer}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      maxBounds={bounds}
      maxZoom={18}
      dragRotate={false}
      pitchWithRotate={false}
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

      <Controls
        mapRef={mapRef}
        otherMarker={citizen}
        routeData={routeData}
        setRouteOpacity={setRouteOpacity}
        ref={buttonsRef}
      />

      {locating && <LocatingIndicator locating={locating} type="rescuer" />}

      {!locating && (
        <>
          <Marker longitude={rescuer.longitude} latitude={rescuer.latitude}>
            <RescuerMarker view="top-down" />
          </Marker>
          <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
            <FaLocationPin className="text-3xl text-secondary red-pulse" />
          </Marker>

          <Route routeData={routeData} routeOpacity={routeOpacity} />

          {distance && eta && <DistanceEta distance={distance} eta={eta} />}
        </>
      )}
    </MapGL>
  );
};

export default RescuerMap;

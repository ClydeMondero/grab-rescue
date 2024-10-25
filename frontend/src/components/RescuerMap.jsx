import { useState, useRef, useEffect, useContext } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocating } from "../hooks";
import {
  LocatingIndicator,
  RescuerMarker,
  DistanceEta,
  TurnIndicator,
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
import * as turf from "@turf/turf";

//TODO: show no current request
const RescuerMap = ({ citizen, onLocatingChange, navigating }) => {
  const { rescuer, setRescuer } = useContext(RescuerContext);
  const [locations, setLocations] = useState(null);

  const mapRef = useRef();
  const geoControlRef = useRef();

  const locating = useLocating(geoControlRef, onLocatingChange);

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  const [routeData, setRouteData] = useState(null);

  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const location = useLocation();

  const [isOnRoute, setIsOnRoute] = useState(false);

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
      ...rescuer,
      longitude: coords.longitude,
      latitude: coords.latitude,
    });

    const currentLocation = {
      longitude: coords.longitude,
      latitude: coords.latitude,
    };

    // Check if rescuer is on the route
    if (routeData) {
      const onRoute = checkIfOnRoute(currentLocation, routeData);
      setIsOnRoute(onRoute);
    }
  };

  // Helper function to check proximity to the route
  const checkIfOnRoute = (currentLocation, route) => {
    const currentPoint = turf.point([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);
    const line = turf.lineString(route.geometry.coordinates); // Assuming geometry is a LineString

    const distance = turf.pointToLineDistance(currentPoint, line, {
      units: "meters",
    });

    // Define a threshold (e.g., 20 meters)
    const threshold = 20;
    return distance <= threshold;
  };

  const getRoute = async () => {
    const route = await getRouteData(rescuer, citizen);

    setRouteData(route);
    setDistance(route.distance);
    setEta(route.duration);
  };

  const handleNavigating = () => {
    mapRef.current.flyTo({
      center: [rescuer.longitude, rescuer.latitude],
      zoom: rescuer.zoom, // Adjust zoom as needed
      pitch: 60, // Set the pitch here to tilt the map
      bearing: rescuer.bearing, // Optionally, control the bearing (rotation)
      essential: true,
    });

    setRescuer({ ...rescuer, pitch: 60 });
  };

  const handleOrientation = (event) => {
    const { alpha } = event;
    if (alpha !== null) {
      setRescuer((prev) => ({
        ...prev,
        bearing: alpha,
      }));
    }
  };

  useEffect(() => {
    if (citizen) {
      getRoute();
    }
  }, [citizen, rescuer]);

  useEffect(() => {
    if (navigating) {
      handleNavigating();

      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              console.log("granted");
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } else {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [rescuer.longitude, rescuer.latitude],
        zoom: 15, // Adjust zoom as needed
        pitch: 0, // Set the pitch here to tilt the map
        bearing: 0, // Optionally, control the bearing (rotation)
        essential: true,
      });

      setRescuer((prev) => ({
        ...prev,
        pitch: 0,
        bearing: 0,
      }));
    }
  }, [navigating]);

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
        style={{ display: "none" }}
        onGeolocate={({ coords }) => {
          handleGeolocation(coords);
        }}
      />

      {locating && <LocatingIndicator locating={locating} type="rescuer" />}

      {navigating && (
        <TurnIndicator
          routeData={routeData}
          routeOpacity={{ background: 0.2, line: 1 }}
          isOnRoute={isOnRoute}
        />
      )}

      {!locating && (
        <>
          <Marker longitude={rescuer.longitude} latitude={rescuer.latitude}>
            {!navigating ? (
              <RescuerMarker view="top-down" />
            ) : (
              <RescuerMarker view="3d" />
            )}
          </Marker>
          <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
            <FaLocationPin className="text-3xl text-secondary red-pulse" />
          </Marker>

          <Route
            routeData={routeData}
            routeOpacity={{
              background: 0.2,
              line: 1,
            }}
          />
        </>
      )}
    </MapGL>
  );
};

export default RescuerMap;

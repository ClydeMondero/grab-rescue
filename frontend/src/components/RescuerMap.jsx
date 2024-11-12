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
import { set } from "lodash";

const RescuerMap = ({ citizen, onLocatingChange, navigating }) => {
  const { rescuer, setRescuer } = useContext(RescuerContext);
  const [locations, setLocations] = useState(null);
  const [coords, setCoords] = useState(null);

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
  const [isOnRoute, setIsOnRoute] = useState(false);
  const location = useLocation();
  const [geolocated, setGeolocated] = useState(false);

  const handleGeolocation = async (coords) => {
    setCoords(coords);

    if (mapRef.current && mapRef.current.resize()) {
      mapRef.current.resize();
    }

    setGeolocateIcon(location);

    if (locations == null) return;

    const id = await getIDFromCookie();

    const existingLocation = locations.find(
      (location) => location.userId === id
    );

    console.log("existingLocation", existingLocation);

    if (existingLocation) {
      console.log("updating location");
      updateUserLocation(
        existingLocation.id,
        rescuer.longitude,
        rescuer.latitude,
        coords.longitude,
        coords.latitude
      );
    } else {
      console.log("adding location");
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

    if (routeData) {
      const onRoute = checkIfOnRoute(currentLocation, routeData);
      setIsOnRoute(onRoute);
    }
  };

  useEffect(() => {
    if (!geolocated) return;

    const timeoutID = setTimeout(() => {
      // Start watching the user's location in a loop
      let watchID = navigator.geolocation.watchPosition(
        ({ coords }) => {
          // Trigger handleGeolocation each time there's a position update
          handleGeolocation(coords);
          // Clear the watch, and start a new one
          navigator.geolocation.clearWatch(watchID);
          watchID = navigator.geolocation.watchPosition(
            ({ coords }) => handleGeolocation(coords),
            (error) => console.log("Error watching position:", error),
            {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 5000,
            }
          );
        },
        (error) => console.log("Error watching position:", error),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      // Clear the watch on component unmount
      return () => navigator.geolocation.clearWatch(watchID);
    }, 3000);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeoutID);
  }, [geolocated]);

  const checkIfOnRoute = (currentLocation, route) => {
    const currentPoint = turf.point([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);
    const line = turf.lineString(route.geometry.coordinates);

    const distance = turf.pointToLineDistance(currentPoint, line, {
      units: "meters",
    });

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
      zoom: rescuer.zoom,
      pitch: 60,
      bearing: rescuer.bearing,
      essential: true,
    });

    setRescuer({ ...rescuer, pitch: 60 });
  };

  const handleOrientation = (event) => {
    const { alpha } = event;

    if (alpha !== null) {
      const bearing = alpha;
      const zoom = 18; // Set desired zoom level

      setRescuer((prev) => ({
        ...prev,
        bearing,
        zoom,
      }));

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [rescuer.longitude, rescuer.latitude],
          zoom: zoom,
          bearing: bearing,
          pitch: 60, // Optional: set a pitch for a 3D effect
          essential: true,
        });
      }
    }
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.resize()) {
      mapRef.current.resize();
    }
  }, [navigating]);

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
        zoom: 15,
        pitch: 0,
        bearing: 0,
        essential: true,
      });

      setRescuer((prev) => ({
        ...prev,
        pitch: 0,
        bearing: 0,
      }));
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [navigating]);

  useEffect(() => {
    if (mapRef.current && geoControlRef.current) {
      setTimeout(() => {
        geoControlRef.current.trigger(); // Trigger after map is fully loaded
      }, 1000);
    }

    const unsubscribe = getLocationsFromFirestore("rescuer", setLocations);

    return () => {
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
        geoControlRef.current?.trigger(); // Trigger after map is fully loaded
      }}
    >
      <GeolocateControl
        ref={geoControlRef}
        position="top-right"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserLocation={coords && false}
        showAccuracyCircle={false}
        style={{ display: "none" }}
        onGeolocate={({ coords }) => {
          setGeolocated(true);
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
          {citizen && (
            <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
              <FaLocationPin className="text-3xl text-secondary red-pulse" />
            </Marker>
          )}

          {citizen && (
            <Route
              routeData={routeData}
              routeOpacity={{
                background: 0.2,
                line: 1,
              }}
            />
          )}
        </>
      )}
    </MapGL>
  );
};

export default RescuerMap;

import { useState, useRef, useEffect } from "react";
import { GeolocateControl, Map as MapGL } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCitizenCookie } from "../services/cookieService";
import {
  addCitizenLocation,
  updateCitizenLocation,
  getNearestRescuer,
  getRescuerLocations,
  getRouteData,
} from "../services/locationService";
import Markers from "./Markers";
import Route from "./Route";
import Controls from "./Controls";

const Map = () => {
  const [citizen, setCitizen] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });
  const [rescuers, setRescuers] = useState([]);
  const [nearestRescuer, setNearestRescuer] = useState(null);

  const [routeData, setRouteData] = useState(null);
  const [routeOpacity, setRouteOpacity] = useState({
    background: 0.2,
    line: 1,
  });

  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef();
  const geoControlRef = useRef();

  const handleGeolocation = (coords) => {
    const cookie = getCitizenCookie();

    if (cookie) {
      updateCitizenLocation(
        cookie,
        citizen.longitude,
        citizen.latitude,
        coords.longitude,
        coords.latitude
      );
    } else {
      addCitizenLocation(coords.longitude, coords.latitude);
    }

    const nearest = getNearestRescuer(citizen, rescuers);
    setNearestRescuer(nearest);
    setCitizen({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  const getRoute = async () => {
    const route = await getRouteData(nearestRescuer, citizen);

    setRouteData(route);
    setDistance(route.distance);
    setEta(route.duration);
  };

  useEffect(() => {
    getRescuerLocations(setRescuers);
  }, []);

  useEffect(() => {
    if (nearestRescuer) {
      getRoute();
    }
  }, [nearestRescuer, citizen]);

  return (
    <MapGL
      ref={mapRef}
      initialViewState={citizen}
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
      <Markers
        citizen={citizen}
        rescuers={rescuers}
        nearestRescuer={nearestRescuer}
      />
      <Route
        routeData={routeData}
        routeOpacity={routeOpacity}
        mapLoaded={mapLoaded}
      />
      <Controls
        mapRef={mapRef}
        nearestRescuer={nearestRescuer}
        routeData={routeData}
        setRouteOpacity={setRouteOpacity}
      />
    </MapGL>
  );
};

export default Map;

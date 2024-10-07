import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { Markers, Route, Controls, DistanceEta } from "../components";

//TODO: update marker icons and route
const CitizenMap = forwardRef((props, ref) => {
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

  const mapRef = useRef();
  const geoControlRef = useRef();
  const buttonsRef = useRef();

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
    console.log("Nearest rescuer:", nearest);
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

  useImperativeHandle(ref, () => ({
    locateCitizen: () => {
      geoControlRef.current?.trigger();
    },
    goToNearestRescuer: () => {
      buttonsRef.current.goToNearestRescuer();
    },
    hideRoute: () => {
      buttonsRef.current.hideRoute();
    },
    viewRoute: () => {
      buttonsRef.current.viewRoute();
    },
  }));

  return (
    <MapGL
      ref={mapRef}
      initialViewState={citizen}
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
          handleGeolocation(coords);
        }}
      />
      <Markers
        citizen={citizen}
        rescuers={rescuers}
        nearestRescuer={nearestRescuer}
      />
      <Route routeData={routeData} routeOpacity={routeOpacity} />
      <Controls
        mapRef={mapRef}
        nearestRescuer={nearestRescuer}
        routeData={routeData}
        setRouteOpacity={setRouteOpacity}
        ref={buttonsRef}
      />
      <DistanceEta distance={distance} eta={eta} />
    </MapGL>
  );
});

export default CitizenMap;

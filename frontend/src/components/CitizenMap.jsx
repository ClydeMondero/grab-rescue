import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GeolocateControl, Map as MapGL } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  getCitizenCookie,
  generateID,
  getLocationCookie,
  setLocationCookie,
} from "../services/cookieService";
import {
  addUserLocation,
  updateUserLocation,
  getNearestRescuer,
  getRouteData,
} from "../services/locationService";
import {
  Markers,
  Route,
  Controls,
  DistanceEta,
  LocatingIndicator,
} from "../components";
import { useLocating } from "../hooks";
import { useLocation } from "react-router-dom";
import { setGeolocateIcon } from "../utils/GeolocateUtility";

const CitizenMap = forwardRef((props, ref) => {
  const { assignedRescuer, requesting, rescuers } = props;
  const [citizen, setCitizen] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });

  const [coords, setCoords] = useState(null);

  const [nearestRescuer, setNearestRescuer] = useState(null);

  const [routeData, setRouteData] = useState(null);
  const [routeOpacity, setRouteOpacity] = useState({
    background: 0.2,
    line: 1,
  });

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const { onLocatingChange, onNearestRescuerUpdate } = props;

  const mapRef = useRef();
  const geoControlRef = useRef();
  const buttonsRef = useRef();

  const locating = useLocating(geoControlRef, onLocatingChange);

  const location = useLocation();

  const handleGeolocation = async (coords) => {
    setCoords(coords);

    if (mapRef.current && mapRef.current.resize()) {
      mapRef.current.resize();
    }

    setGeolocateIcon(location);

    if (rescuers == null) return;
    const cookie = getCitizenCookie();
    const previousLocation = getLocationCookie();

    if (cookie && previousLocation) {
      if (
        parseFloat(previousLocation.longitude).toFixed(4) !=
          parseFloat(coords.longitude).toFixed(4) &&
        parseFloat(previousLocation.latitude).toFixed(4) !=
          parseFloat(coords.latitude).toFixed(4)
      ) {
        setLocationCookie({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        console.log("Updating Location");

        updateUserLocation(
          cookie,
          citizen.longitude,
          citizen.latitude,
          coords.longitude,
          coords.latitude
        );
      }
    } else {
      const citizenId = generateID();

      console.log("Adding Location");

      setLocationCookie({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      addUserLocation(coords.longitude, coords.latitude, "citizen", citizenId);
    }

    const nearest = getNearestRescuer(citizen, rescuers);
    setNearestRescuer(nearest);
    onNearestRescuerUpdate(nearest);

    setCitizen({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  const getRoute = async () => {
    let route = null;

    if (assignedRescuer) {
      route = await getRouteData(assignedRescuer, citizen);
    } else {
      route = await getRouteData(nearestRescuer, citizen);
    }

    setRouteData(route);
    setDistance(route.distance);
    setEta(route.duration);
  };

  useEffect(() => {
    if (mapRef.current && mapRef.current.resize()) {
      mapRef.current.resize();
    }
  }, [requesting]);

  useEffect(() => {
    if (rescuers == null) {
      setRouteData(null);
      setDistance(null);
      setEta(null);
      return;
    }

    if (rescuers.length == 0) {
      setRouteData(null);
      setDistance(null);
      setEta(null);
    }

    if (!nearestRescuer && !assignedRescuer) {
      setRouteData(null);
      setDistance(null);
      setEta(null);
    }

    if (nearestRescuer || assignedRescuer) {
      getRoute();
    }
  }, [nearestRescuer, assignedRescuer, citizen, rescuers]);

  useEffect(() => {
    if (rescuers && citizen) {
      const nearest = getNearestRescuer(citizen, rescuers);
      setNearestRescuer(nearest);
      onNearestRescuerUpdate(nearest);
    }
  }, [rescuers, citizen]);

  useImperativeHandle(ref, () => ({
    locateCitizen: () => {
      geoControlRef.current?.trigger();
    },
    goToNearestRescuer: () => {
      buttonsRef.current.goToOtherMarker();
    },
    hideRoute: () => {
      buttonsRef.current.hideRoute();
    },
    viewRoute: () => {
      buttonsRef.current.viewRoute();
    },
  }));

  return (
    <>
      <MapGL
        ref={mapRef}
        initialViewState={citizen}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        maxBounds={bounds}
        maxzoom={15}
        dragRotate={false}
        pitchWithRotate={false}
        onLoad={() => {
          geoControlRef.current?.trigger();
        }}
      >
        {/*FIXME: Geolocator Bug */}
        <GeolocateControl
          ref={geoControlRef}
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={coords && false}
          showAccuracyCircle={false}
          onGeolocate={({ coords }) => {
            handleGeolocation(coords);
          }}
        />

        <Controls
          mapRef={mapRef}
          otherMarker={assignedRescuer ? assignedRescuer : nearestRescuer}
          routeData={routeData}
          setRouteOpacity={setRouteOpacity}
          ref={buttonsRef}
        />

        {locating && <LocatingIndicator locating={locating} type="citizen" />}

        {!locating && (
          <>
            <Markers
              myMarker={citizen}
              otherMarkers={rescuers}
              nearestOtherMarker={nearestRescuer}
              assignedRescuer={assignedRescuer}
              markerType={"citizen"}
            />

            {routeData && (
              <Route routeData={routeData} routeOpacity={routeOpacity} />
            )}

            {distance && eta && <DistanceEta distance={distance} eta={eta} />}
          </>
        )}
      </MapGL>
    </>
  );
});

export default CitizenMap;

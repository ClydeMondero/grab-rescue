import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GeolocateControl, Map as MapGL } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCitizenCookie, generateID } from "../services/cookieService";
import {
  addUserLocation,
  updateCitizenLocation,
  getNearestRescuer,
  getRescuerLocations,
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

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const { onLocatingChange } = props;

  const mapRef = useRef();
  const geoControlRef = useRef();
  const buttonsRef = useRef();

  const locating = useLocating(geoControlRef, onLocatingChange);

  const handleGeolocation = (coords) => {
    if (!mapRef.current) return;

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
      const citizenId = generateID();

      addUserLocation(coords.longitude, coords.latitude, "citizen", citizenId);
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
    <>
      <MapGL
        ref={mapRef}
        initialViewState={citizen}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        maxBounds={bounds}
        maxzoom={15}
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
          showUserLocation={false}
          onGeolocate={({ coords }) => {
            handleGeolocation(coords);
          }}
        />

        <Controls
          mapRef={mapRef}
          nearestRescuer={nearestRescuer}
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
              markerType={"citizen"}
            />

            <Route routeData={routeData} routeOpacity={routeOpacity} />

            <DistanceEta distance={distance} eta={eta} />
          </>
        )}
      </MapGL>
    </>
  );
});

export default CitizenMap;

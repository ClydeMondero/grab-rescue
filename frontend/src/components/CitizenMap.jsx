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
import { Loader } from "../components";
import { FaLocationPin } from "react-icons/fa6";

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

  const [watchState, setWatchState] = useState("OFF");

  const [locating, setLocating] = useState(true);
  const { onLocatingChange } = props;

  //TODO: locating message
  const [locatingMessage, setLocatingMessage] = useState("");

  const mapRef = useRef();
  const geoControlRef = useRef();
  const buttonsRef = useRef();

  const messages = [
    "We’re trying to locate you, please hold tight!",
    "Hang on! Finding your location...",
    "Getting your current position...",
    "Locating you, this may take a moment.",
    "Looking for your coordinates...",
    "Tip: Make sure your GPS is enabled for better accuracy.",
    "For the best results, keep Wi-Fi on and data enabled.",
    "Location taking longer than expected? Check your GPS settings.",
    "Tip: Some ad blockers may interfere with our location services. Try disabling them.",
  ];

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

  const handleWatchState = (watchState) => {
    switch (watchState) {
      case "OFF":
      case "ACTIVE_ERROR":
      case "WAITING_ACTIVE":
      case "BACKGROUND_ERROR":
        setLocating(true);

        break;
      case "ACTIVE_LOCK":
      case "BACKGROUND":
        setLocating(false);
        break;
      default:
        console.log("Unknown watch state:", watchState);
    }
  };

  useEffect(() => {
    handleWatchState(watchState);
  }, [watchState]);

  useEffect(() => {
    const checkWatchState = () => {
      if (geoControlRef.current && geoControlRef.current._watchState) {
        setWatchState(geoControlRef.current._watchState);
      }
    };

    const interval = setInterval(checkWatchState, 1000); // Check every second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [geoControlRef.current, watchState]);

  useEffect(() => {
    if (locating) {
      const changeMessage = () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setLocatingMessage(messages[randomIndex]);
      };

      // Set interval for changing message less frequently (every 10 seconds)
      const intervalId = setInterval(changeMessage, 10000);

      // Clean up the interval when the component unmounts or locating stops
      return () => clearInterval(intervalId);
    }
  }, [locating]);

  useEffect(() => {
    if (onLocatingChange) {
      onLocatingChange(locating);
    }
  }, [locating]);

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

        {locating && (
          <>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="flex-col items-center justify-center p-4 shadow-sm rounded-md bg-primary-medium">
                  <div className="flex items-center justify-center gap-4 ">
                    <span className="text-lg font-medium text-white">
                      Locating you
                    </span>
                    <Loader
                      isLoading={true}
                      color={"white"}
                      size={20}
                      className="mb-4"
                    />
                  </div>
                  <span className="text-white text-sm">{locatingMessage}</span>
                </div>
                <FaLocationPin className="text-3xl text-secondary" />
              </div>
            </div>
          </>
        )}

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

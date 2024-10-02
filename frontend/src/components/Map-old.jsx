import { useState, useRef, useEffect } from "react";
import {
  Map as MapGL,
  GeolocateControl,
  Marker,
  Popup,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import citizenMarker from "../assets/citizen-marker.png";
import rescuerMarker from "../assets/rescuer-marker.png";
import rescuerActive from "../assets/rescuer-active.svg";
import routeIcon from "../assets/route.svg";
import hideRoute from "../assets/hide-route.svg";
import zoomOutIcon from "../assets/zoom-out.svg";
import {
  addCitizenLocation,
  getRescuerLocations,
  updateCitizenLocation,
  getNearestRescuer,
  getRouteData,
} from "../services/locationService";
import { getCitizenCookie } from "../services/cookieService";
import { formatDistance, formatDuration } from "../utils/DistanceUtility";

const Map = () => {
  //set initial viewport to BSU-BUSTOS
  const [citizen, setCitizen] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });
  const geoControlRef = useRef();
  const [rescuers, setRescuers] = useState([]);
  const [nearestRescuer, setNearestRescuer] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const mapRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dashArray, setDashArray] = useState([0, 4, 3]);
  const [routeToggle, setRouteToggle] = useState(true);
  const [routeToggleIcon, setRouteToggleIcon] = useState(routeIcon);
  const [routeOpacity, setRouteOpacity] = useState({
    background: 0.2,
    line: 1,
  });
  const [distance, setDistance] = useState();
  const [eta, setEta] = useState();

  const getRoute = async () => {
    const route = await getRouteData(nearestRescuer, citizen);

    setRouteData(route);
    setDistance(route.distance);
    setEta(route.duration);
  };

  //ant line animate route
  const animateRoute = () => {
    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5],
    ];

    let step = 0;

    function animateDashArray(timestamp) {
      const newStep = parseInt((timestamp / 100) % dashArraySequence.length);

      if (newStep !== step) {
        setDashArray(dashArraySequence[step]);

        step = newStep;
      }

      requestAnimationFrame(animateDashArray);
    }

    animateDashArray(0);
  };

  const goToNearestRescuer = () => {
    if (nearestRescuer) {
      mapRef.current.flyTo({
        center: [nearestRescuer.longitude, nearestRescuer.latitude],
        zoom: 15,
      });
    }
  };

  //hide route layer
  const hideRouteToRescuer = () => {
    if (mapRef) {
      routeToggle ? setRouteToggle(false) : setRouteToggle(true);

      routeToggle
        ? setRouteOpacity({ background: 0.2, line: 1 })
        : setRouteOpacity({ background: 0, line: 0 });

      routeToggle
        ? setRouteToggleIcon(hideRoute)
        : setRouteToggleIcon(routeIcon);
    }
  };

  //fit map bounds
  const fitBounds = () => {
    if (mapRef.current && routeData) {
      const routeCoordinates = routeData.geometry.coordinates;

      const longitudes = routeCoordinates.map((coord) => coord[0]);
      const latitudes = routeCoordinates.map((coord) => coord[1]);

      const bounds = [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ];

      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  };

  useEffect(() => {
    //get rescuer locations on load
    getRescuerLocations(setRescuers);
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      //TODO: enable route animation
      //animateRoute();
    }
  }, [mapLoaded]);

  //show route to the nearest rescuer
  useEffect(() => {
    if (nearestRescuer != null) {
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
          const cookie = getCitizenCookie();

          {
            /* check if citizen has already have a cookie, if not add location else update location */
          }
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

          {
            /* get nearest rescuer */
          }
          setNearestRescuer(getNearestRescuer(citizen, rescuers));

          setCitizen({
            longitude: coords.longitude,
            latitude: coords.latitude,
            zoom: 15,
          });
        }}
      />

      {/* go to nearest rescuer */}
      <div className="ctrl-group">
        <button onClick={goToNearestRescuer} className="ctrl-icon">
          <img
            src={rescuerActive}
            width={20}
            height={20}
            style={{ display: "block", margin: "auto" }}
          />
        </button>
        {/*zoom out route */}
        <button className="ctrl-icon" onClick={fitBounds}>
          <img
            src={zoomOutIcon}
            width={18}
            height={18}
            style={{ display: "block", margin: "auto" }}
          />
        </button>
        {/*hide route*/}
        <button className="ctrl-icon" onClick={hideRouteToRescuer}>
          {/*add route icon*/}
          <img
            src={routeToggleIcon}
            width={18}
            height={18}
            style={{ display: "block", margin: "auto" }}
          />
        </button>
      </div>

      <Popup
        longitude={citizen.longitude}
        latitude={citizen.latitude}
        offset={10}
        closeButton={false}
      >
        You are here!
      </Popup>

      {/* Citizen marker */}
      <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
        <div className="citizen-marker">
          <img src={citizenMarker} width={25} height={25} />
        </div>
      </Marker>

      {/* Rescuers marker */}
      {rescuers.map(
        (rescuer) =>
          rescuer.status === "available" && (
            <Marker
              key={rescuer.id}
              longitude={rescuer.longitude}
              latitude={rescuer.latitude}
            >
              <div
                className={
                  nearestRescuer && rescuer.id === nearestRescuer.id
                    ? "nearest-rescuer-marker"
                    : ""
                }
              >
                <img src={rescuerMarker} width={30} height={30} />
              </div>
            </Marker>
          )
      )}

      {/* show line Layer for the route */}
      {routeData &&
        routeData.geometry.coordinates &&
        routeData.geometry.coordinates.length > 0 && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeData.geometry.coordinates,
              },
              properties: {},
            }}
          >
            <Layer
              id="route-background"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#3B82F6", // Customize the color of the ant line
                "line-width": 6, // Adjust the width of the line
                "line-opacity": routeOpacity.background,
              }}
            />

            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#3B82F6", // Customize the color of the ant line
                "line-width": 6, // Adjust the width of the line
                "line-dasharray": dashArray,
                "line-opacity": routeOpacity.line,
              }}
            />
          </Source>
        )}
      {distance && eta && (
        <div className="distance-details">
          {distance && <p>{formatDistance(distance)}</p>}
          {eta && <p>{formatDuration(eta)}</p>}
        </div>
      )}
    </MapGL>
  );
};

export default Map;

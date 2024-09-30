import { useState, useRef, useEffect } from "react";
import { Map as MapGL, GeolocateControl, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import citizenMarker from "../assets/citizen-marker.png";
import rescuerMarker from "../assets/rescuer-marker.png";
import {
  addCitizenLocation,
  getRescuerLocations,
  updateCitizenLocation,
  getNearestRescuer,
} from "../services/locationService";
import { getCitizenCookie } from "../services/cookieService";

const Map = () => {
  //set initial viewport to BSU-BUSTOS
  const [citizen, setCitizen] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });
  const geoControlRef = useRef();
  const [rescuers, setRescuers] = useState([]);
  const [nearestRescuer, setNearestRescuer] = useState({});

  useEffect(() => {
    //get rescuer locations on load
    getRescuerLocations(setRescuers);
  }, []);

  //TODO: add lines and distance between rescuer and citizen

  return (
    <MapGL
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
          const cookie = getCitizenCookie();

          {
            /* check if citizen has already have a cookie, if not add location else update location */
          }
          if (cookie) {
            updateCitizenLocation(
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
                  rescuer.id === nearestRescuer.id
                    ? "nearest-rescuer-marker"
                    : ""
                }
              >
                <img src={rescuerMarker} width={30} height={30} />
              </div>
            </Marker>
          )
      )}
    </MapGL>
  );
};

export default Map;

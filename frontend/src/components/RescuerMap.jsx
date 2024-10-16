import { useState, useRef, useEffect } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocating } from "../hooks";
import { LocatingIndicator } from "../components";
import { RescuerMarker } from "../components";

const RescuerMap = () => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  const mapRef = useRef();
  const geoControlRef = useRef();

  const locating = useLocating(geoControlRef);

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  //TODO: save rescuer location
  const handleGeolocation = (coords) => {
    if (!mapRef.current) return;

    // const cookie = getCitizenCookie();

    // if (cookie) {
    //   updateCitizenLocation(
    //     cookie,
    //     citizen.longitude,
    //     citizen.latitude,
    //     coords.longitude,
    //     coords.latitude
    //   );
    // } else {
    //   const citizenId = generateID();

    //   addCitizenLocation(coords.longitude, coords.latitude, citizenId);
    // }

    // const nearest = getNearestRescuer(citizen, rescuers);
    // setNearestRescuer(nearest);
    setRescuer({
      longitude: coords.longitude,
      latitude: coords.latitude,
    });
  };

  return (
    <MapGL
      ref={mapRef}
      initialViewState={rescuer}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      maxBounds={bounds}
      maxZoom={18}
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

      {locating && <LocatingIndicator locating={locating} type="rescuer" />}

      {!locating && (
        <Marker longitude={rescuer.longitude} latitude={rescuer.latitude}>
          <RescuerMarker view="top-down" />
        </Marker>
      )}
    </MapGL>
  );
};

export default RescuerMap;

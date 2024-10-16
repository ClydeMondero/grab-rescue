import { useState, useRef, useEffect } from "react";
import { GeolocateControl, Map as MapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ambulanceModel from "../assets/ambulance/scene.gltf";
import { useLoader } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const Model = () => {
  const gltf = useLoader(GLTFLoader, ambulanceModel);
  const model = gltf.scene;

  model.rotation.set(Math.PI / 2, Math.PI, 0);
  model.scale.set(0.5, 0.5, 0.5);

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.color.setHex(0x99ff99);
    }
  });

  return <primitive object={model} />;
};

const RescuerMap = () => {
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 18,
  });

  const mapRef = useRef();
  const geoControlRef = useRef();

  const bounds = [
    [120.8585, 14.8867],
    [121.0972, 15.0197],
  ];

  //TODO: add locating indicator

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

  https: return (
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

      <Marker longitude={rescuer.longitude} latitude={rescuer.latitude}>
        <Canvas
          style={{ width: "150px", height: "150px", background: "transparent" }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 100]} // Fixed camera position
            fov={100} // Field of view
          />

          {/* Adding lights */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 10]} intensity={1} />

          {/* Displaying the model with rotation */}
          <Model />
        </Canvas>
      </Marker>
    </MapGL>
  );
};

export default RescuerMap;

import { Map as MapGL } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  return (
    <MapGL
      initialViewState={{
        longitude: 120.9107,
        latitude: 14.9536,
        zoom: 17,
      }}
      mapStyle={"mapbox://styles/mapbox/streets-v12"}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    />
  );
};

export default Map;

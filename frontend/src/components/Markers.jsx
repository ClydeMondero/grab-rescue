import { Marker, Popup } from "react-map-gl";
import citizenMarker from "../assets/citizen-marker.png";
import rescuerMarker from "../assets/rescuer-marker.png";

const Markers = ({ citizen, rescuers, nearestRescuer }) => (
  <>
    <Popup
      longitude={citizen.longitude}
      latitude={citizen.latitude}
      offset={10}
      closeButton={false}
    >
      You are here!
    </Popup>

    <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
      <img src={citizenMarker} width={25} height={25} />
    </Marker>

    {rescuers.map(
      (rescuer) =>
        rescuer.status === "available" && (
          <Marker
            key={rescuer.id}
            longitude={rescuer.longitude}
            latitude={rescuer.latitude}
          >
            <img src={rescuerMarker} width={30} height={30} />
          </Marker>
        )
    )}
  </>
);

export default Markers;

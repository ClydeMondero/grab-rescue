import { Marker, Popup } from "react-map-gl";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";
import ambulance from "../assets/ambulance.png";
import { useEffect, useState } from "react";

const Markers = ({
  myMarker,
  otherMarkers,
  nearestOtherMarker,
  markerType,
}) => {
  const [noOnlineRescuers, setNoOnlineRescuers] = useState(false);

  useEffect(() => {
    console.log("Updated otherMarkers:", otherMarkers.length);
    console.log("Current markerType of myMarker:", markerType);
    const onlineRescuers = otherMarkers.filter(
      (marker) => marker.status === "online" && marker.role === "rescuer"
    );
    setNoOnlineRescuers(
      markerType === "citizen" && onlineRescuers.length === 0
    );
  }, [otherMarkers, markerType]);

  return (
    <>
      {myMarker && (
        <Marker longitude={myMarker.longitude} latitude={myMarker.latitude}>
          <div className="relative flex flex-col items-center justify-center">
            {markerType === "citizen" ? (
              <FaLocationPin className="text-3xl text-secondary red-pulse" />
            ) : (
              <img src={ambulance} className="h-20" />
            )}
            {markerType === "citizen" && (
              <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                You
              </p>
            )}
          </div>
        </Marker>
      )}

      {otherMarkers &&
        otherMarkers.map(
          (marker) =>
            marker.status === "online" && (
              <Marker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
              >
                <div className="flex flex-col items-center justify-center">
                  <BiSolidAmbulance
                    className={
                      marker.id === nearestOtherMarker?.id
                        ? "text-4xl text-primary green-pulse"
                        : "text-4xl text-primary"
                    }
                  />
                  {nearestOtherMarker?.id === marker.id && (
                    <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                      Nearest Rescuer
                    </p>
                  )}
                </div>
              </Marker>
            )
        )}

      {/* Display message if markerType is "citizen" and no rescuers are online */}
      {noOnlineRescuers && (
        <div className="absolute top-0 left-0 right-0 text-center text-lg text-red-600 font-semibold">
          No Online Rescuers
        </div>
      )}
    </>
  );
};

export default Markers;

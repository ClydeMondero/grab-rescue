import { Marker, Popup } from "react-map-gl";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";
import ambulance from "../assets/ambulance.png";
import { useState, useEffect } from "react";
import { RiPoliceCarFill } from "react-icons/ri";
import { PiFireTruckFill } from "react-icons/pi";

const Markers = ({
  myMarker,
  otherMarkers,
  nearestOtherMarker,
  assignedRescuer,
  markerType,
}) => {
  return (
    <>
      {myMarker && (
        <Marker longitude={myMarker.longitude} latitude={myMarker.latitude}>
          <div className="relative flex flex-col items-center justify-center">
            <FaLocationPin className="text-3xl text-secondary red-pulse" />
            {markerType === "citizen" && (
              <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                You
              </p>
            )}
          </div>
        </Marker>
      )}

      {/* Display only the assigned rescuer if a request has been accepted */}
      {assignedRescuer ? (
        <Marker
          key={assignedRescuer.id}
          longitude={assignedRescuer.longitude}
          latitude={assignedRescuer.latitude}
        >
          <div className="flex flex-col items-center justify-center">
            {assignedRescuer.rescuerType === "MDRRMO" ? (
              <BiSolidAmbulance className="text-4xl text-primary green-pulse" />
            ) : assignedRescuer.rescuerType === "BFP" ? (
              <PiFireTruckFill className="text-4xl text-warning orange-pulse" />
            ) : (
              <RiPoliceCarFill className="text-3xl text-highlight blue-pulse" />
            )}
            <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
              Assigned Rescuer
            </p>
          </div>
        </Marker>
      ) : (
        /* Display all online rescuers if no rescuer has accepted the request */
        otherMarkers &&
        otherMarkers.map(
          (marker) =>
            marker.status === "online" && (
              <Marker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
              >
                <div className="flex flex-col items-center justify-center">
                  {marker.rescuerType === "MDRRMO" ? (
                    <BiSolidAmbulance
                      className={
                        marker.id === nearestOtherMarker?.id
                          ? "text-4xl text-primary green-pulse"
                          : "text-4xl text-primary"
                      }
                    />
                  ) : marker.rescuerType === "BFP" ? (
                    <PiFireTruckFill
                      className={
                        marker.id === nearestOtherMarker?.id
                          ? "text-4xl text-warning orange-pulse"
                          : "text-4xl text-warning"
                      }
                    />
                  ) : (
                    <RiPoliceCarFill
                      className={
                        marker.id === nearestOtherMarker?.id
                          ? "text-3xl text-highlight blue-pulse"
                          : "text-3xl text-highlight"
                      }
                    />
                  )}
                  {nearestOtherMarker?.id === marker.id && (
                    <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                      Nearest Rescuer
                    </p>
                  )}
                </div>
              </Marker>
            )
        )
      )}
    </>
  );
};

export default Markers;

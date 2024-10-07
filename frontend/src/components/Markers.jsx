import { Marker, Popup } from "react-map-gl";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";

const Markers = ({ citizen, rescuers, nearestRescuer }) => {
  return (
    <>
      <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
        <div className="relative flex flex-col items-center justify-center ">
          <FaLocationPin className="text-3xl text-secondary red-pulse" />
          <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
            You
          </p>
        </div>
      </Marker>

      {rescuers.map(
        (rescuer) =>
          rescuer.status === "available" && (
            <Marker
              key={rescuer.id}
              longitude={rescuer.longitude}
              latitude={rescuer.latitude}
            >
              <div className="flex flex-col items-center justify-center">
                <BiSolidAmbulance
                  className={
                    rescuer.id === nearestRescuer?.id
                      ? "text-4xl text-primary green-pulse"
                      : "text-4xl text-primary"
                  }
                />
                {rescuer.id === nearestRescuer?.id && (
                  <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                    Nearest Rescuer
                  </p>
                )}
              </div>
            </Marker>
          )
      )}
    </>
  );
};

export default Markers;

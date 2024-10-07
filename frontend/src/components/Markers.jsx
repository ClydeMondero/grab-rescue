import { Marker, Popup } from "react-map-gl";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";

const Markers = ({ citizen, rescuers, nearestRescuer }) => {
  return (
    <>
      <Marker longitude={citizen.longitude} latitude={citizen.latitude}>
        <div className="relative flex flex-col items-center justify-center ">
          <FaLocationPin className="text-3xl text-[#FF5757] red-pulse" />
          <p className="bg-white px-2 py-1 rounded-full text-md font-semibold">
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
                      ? "text-4xl text-[#557C55] green-pulse"
                      : "text-4xl text-[#557C55]"
                  }
                />
                {rescuer.id === nearestRescuer?.id && (
                  <p className="bg-white px-2 py-1 rounded-full text-md font-semibold">
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

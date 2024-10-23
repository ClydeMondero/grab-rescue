import { useState, forwardRef, useImperativeHandle } from "react";
import { BiSolidAmbulance, BiSolidHide, BiSolidShow } from "react-icons/bi";
import { FaLocationPin } from "react-icons/fa6";
import { MdRoute } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Controls = forwardRef(
  ({ mapRef, otherMarker, routeData, setRouteOpacity }, ref) => {
    const [routeToggle, setRouteToggle] = useState(false);

    const location = useLocation();

    const goToOtherMarker = () => {
      if (otherMarker) {
        mapRef.current.flyTo({
          center: [otherMarker.longitude, otherMarker.latitude],
          zoom: 15,
        });
      }
    };

    //hide route layer
    const hideRoute = () => {
      if (mapRef) {
        routeToggle ? setRouteToggle(false) : setRouteToggle(true);

        routeToggle
          ? setRouteOpacity({ background: 0.2, line: 1 })
          : setRouteOpacity({ background: 0, line: 0 });
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

    useImperativeHandle(ref, () => ({
      goToOtherMarker: () => {
        goToOtherMarker();
      },
      hideRoute: () => {
        hideRoute();
      },
      viewRoute: () => {
        fitBounds();
      },
    }));
    return (
      <div className="ctrl-group">
        <button onClick={goToOtherMarker} className="ctrl-icon">
          {location.pathname == "/" ? (
            <BiSolidAmbulance className="text-xl text-primary " />
          ) : (
            <FaLocationPin className="text-xl text-secondary" />
          )}
        </button>
        {/*zoom out route */}
        <button className="ctrl-icon" onClick={fitBounds}>
          <MdRoute className="text-xl text-highlight" />
        </button>
        {/*hide route*/}
        <button className="ctrl-icon" onClick={hideRoute}>
          {/*add route icon*/}
          {routeToggle ? (
            <BiSolidShow className="text-xl text-background-dark" />
          ) : (
            <BiSolidHide className="text-xl text-background-dark" />
          )}
        </button>
      </div>
    );
  }
);

export default Controls;

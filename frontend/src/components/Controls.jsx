import hideRoute from "../assets/hide-route.svg";
import { useState, forwardRef, useImperativeHandle } from "react";
import { BiSolidAmbulance, BiSolidHide, BiSolidShow } from "react-icons/bi";
import { MdRoute } from "react-icons/md";

const Controls = forwardRef(
  ({ mapRef, nearestRescuer, routeData, setRouteOpacity }, ref) => {
    const [routeToggle, setRouteToggle] = useState(false);

    const goToNearestRescuer = () => {
      if (nearestRescuer) {
        mapRef.current.flyTo({
          center: [nearestRescuer.longitude, nearestRescuer.latitude],
          zoom: 15,
        });
      }
    };

    //hide route layer
    const hideRouteToRescuer = () => {
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
      goToNearestRescuer: () => {
        goToNearestRescuer();
      },
      hideRoute: () => {
        hideRouteToRescuer();
      },
      viewRoute: () => {
        fitBounds();
      },
    }));
    return (
      <div className="ctrl-group">
        <button onClick={goToNearestRescuer} className="ctrl-icon">
          <BiSolidAmbulance className="text-xl text-primary " />
        </button>
        {/*zoom out route */}
        <button className="ctrl-icon" onClick={fitBounds}>
          <MdRoute className="text-xl text-highlight" />
        </button>
        {/*hide route*/}
        <button className="ctrl-icon" onClick={hideRouteToRescuer}>
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

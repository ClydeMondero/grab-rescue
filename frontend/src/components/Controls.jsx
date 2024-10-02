import rescuerActive from "../assets/rescuer-active.svg";
import routeIcon from "../assets/route.svg";
import hideRoute from "../assets/hide-route.svg";
import zoomOutIcon from "../assets/zoom-out.svg";
import { useState } from "react";

const Controls = ({ mapRef, nearestRescuer, routeData, setRouteOpacity }) => {
  const [routeToggle, setRouteToggle] = useState(false);
  const [routeToggleIcon, setRouteToggleIcon] = useState(routeIcon);

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

      routeToggle
        ? setRouteToggleIcon(hideRoute)
        : setRouteToggleIcon(routeIcon);
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
  return (
    <div className="ctrl-group">
      <button onClick={goToNearestRescuer} className="ctrl-icon">
        <img
          src={rescuerActive}
          width={20}
          height={20}
          style={{ display: "block", margin: "auto" }}
        />
      </button>
      {/*zoom out route */}
      <button className="ctrl-icon" onClick={fitBounds}>
        <img
          src={zoomOutIcon}
          width={18}
          height={18}
          style={{ display: "block", margin: "auto" }}
        />
      </button>
      {/*hide route*/}
      <button className="ctrl-icon" onClick={hideRouteToRescuer}>
        {/*add route icon*/}
        <img
          src={routeToggleIcon}
          width={18}
          height={18}
          style={{ display: "block", margin: "auto" }}
        />
      </button>
    </div>
  );
};

export default Controls;

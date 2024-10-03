import { formatDistance, formatDuration } from "../utils/DistanceUtility";

const DistanceEta = ({ distance, eta }) => {
  return (
    distance &&
    eta && (
      <div className="distance-eta">
        {distance && <p>Distance: {formatDistance(distance)}</p>}
        {eta && <p>ETA: {formatDuration(eta)}</p>}
      </div>
    )
  );
};

export default DistanceEta;

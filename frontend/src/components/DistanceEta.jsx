import { formatDistance, formatDuration } from "../utils/DistanceUtility";

const DistanceEta = ({ distance, eta }) => {
  return (
    distance &&
    eta && (
      <div className="distance-eta text-white bg-primary">
        {<p>{formatDuration(eta) + " • " + formatDistance(distance)}</p>}
      </div>
    )
  );
};

export default DistanceEta;

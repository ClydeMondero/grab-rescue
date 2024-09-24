import { getDistance } from "../utils/distanceCalculator";

const MIN_DISTANCE_THRESHOLD = 50; //in meters

export const updateLocationIfMoved = (
  currentLat,
  currentLon,
  lastLat,
  lastLon
) => {
  const distance = getDistance(currentLat, currentLon, lastLat, lastLon);

  if (distance >= MIN_DISTANCE_THRESHOLD) {
    alert("Location updated:");

    //TODO: update location in database and update marker

    return true;
  }

  return false;
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; //Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; //return distance in km
};

export const formatDistance = (distance) =>
  (distance / 1000).toFixed(2) + " km"; // Convert meters to kilometers

export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  return `${minutes} min`;
};

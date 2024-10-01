import { getDistance } from "../utils/distanceCalculator";
import {
  addLocationToFirestore,
  getLocationsFromFirestore,
  updateLocationInFirestore,
} from "../services/firestoreService";
import { setCitizenCookie } from "../services/cookieService";
import axios from "axios";

const MIN_DISTANCE_THRESHOLD = 50; //in meters

export const hasUserMoved = (currentLat, currentLon, lastLat, lastLon) => {
  const distance = getDistance(currentLat, currentLon, lastLat, lastLon);

  if (distance >= MIN_DISTANCE_THRESHOLD) {
    console.log("Location updated", currentLat, currentLon + " " + Date.now());

    return true;
  }

  return false;
};

export const getRouteData = async (rescuer, citizen) => {
  const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${
    rescuer.longitude
  },${rescuer.latitude};${citizen.longitude},${
    citizen.latitude
  }?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;

  try {
    const response = await axios.get(directionsUrl);
    const route = response.data.routes[0].geometry;

    return route;
  } catch (error) {
    console.log("Error fetching the route:", error);
  }
};

//add user location to firestore and set cookie
export const addCitizenLocation = async (longitude, latitude) => {
  //add user location to firestore
  const { id } = await addLocationToFirestore(longitude, latitude, "citizen");

  //adds citizen id to cookies
  setCitizenCookie(id);

  console.log("Location added");
};

//get nearest rescuer
export const getNearestRescuer = (citizen, rescuers) => {
  const distances = rescuers.map((rescuer) => {
    return getDistance(
      citizen.latitude,
      citizen.longitude,
      rescuer.latitude,
      rescuer.longitude
    );
  });

  const minDistance = Math.min(...distances);
  const nearestRescuer = rescuers[distances.indexOf(minDistance)];

  return nearestRescuer;
};

// update location if moved
export const updateCitizenLocation = (
  prevLon,
  prevLat,
  longitude,
  latitude
) => {
  const moved = hasUserMoved(prevLon, prevLat, longitude, latitude);

  //TODO:test if update location if moved in firestore
  if (moved) {
    console.log("Location updated", moved);
    updateLocationInFirestore(id, longitude, latitude);
  } else {
    console.log("Location not updated", moved);
  }
};

//get locations from firestore
export const getRescuerLocations = async (setRescuers) => {
  const locations = await getLocationsFromFirestore("rescuer");

  setRescuers(locations);
};

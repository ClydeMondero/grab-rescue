import { getDistance } from "../utils/DistanceUtility";
import {
  addLocationToFirestore,
  getLocationsFromFirestore,
  updateLocationInFirestore,
} from "../services/firestoreService";
import { setCitizenCookie } from "../services/cookieService";
import axios from "axios";

const MIN_DISTANCE_THRESHOLD = 50; //in meters

//TODO: check if user moved by 50 meters
export const hasUserMoved = (currentLat, currentLon, lastLat, lastLon) => {
  const distance = getDistance(currentLat, currentLon, lastLat, lastLon);

  if (distance >= MIN_DISTANCE_THRESHOLD) {
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
    const route = response.data.routes[0];

    return route;
  } catch (error) {
    console.log("Error fetching the route:", error);
  }
};

//add user location to firestore and set cookie
export const addUserLocation = async (
  longitude,
  latitude,
  role,
  userId = null
) => {
  const address = await getAddress(longitude, latitude);

  //add user location to firestore
  const { id } = await addLocationToFirestore(
    longitude,
    latitude,
    address,
    role,
    userId
  );

  //adds citizen id to cookies
  if (role === "citizen") {
    setCitizenCookie(id);
  }
};

//FIXME: not accurate address
export const getAddress = async (longitude, latitude) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
    import.meta.env.VITE_MAPBOX_TOKEN
  }`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name; // This is the human-readable address
    }
    return "No address found";
  } catch (error) {
    console.log("Error getting the address:", error);
  }
};

//FIXME: wrong nearest rescuer
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
export const updateUserLocation = async (
  locationId,
  prevLon,
  prevLat,
  longitude,
  latitude
) => {
  const moved = hasUserMoved(prevLon, prevLat, longitude, latitude);

  const address = await getAddress(longitude, latitude);

  if (moved) {
    updateLocationInFirestore(locationId, longitude, latitude, address);
  }
};

//get locations from firestore
export const getRescuerLocations = async (setRescuers) => {
  const locations = await getLocationsFromFirestore("rescuer");

  setRescuers(locations);
};

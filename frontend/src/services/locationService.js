import { getDistance } from "../utils/distanceCalculator";
import {
  addLocationToFirestore,
  getLocationsFromFirestore,
} from "../services/firestoreService";
import { setCitizenCookie } from "../services/cookieService";

const MIN_DISTANCE_THRESHOLD = 50; //in meters

export const hasUserMoved = (currentLat, currentLon, lastLat, lastLon) => {
  const distance = getDistance(currentLat, currentLon, lastLat, lastLon);

  if (distance >= MIN_DISTANCE_THRESHOLD) {
    console.log("Location updated", currentLat, currentLon + " " + Date.now());

    return true;
  }

  return false;
};

//add user location to firestore and set cookie
export const addCitizenLocation = async (longitude, latitude) => {
  //add user location to firestore
  const { id } = await addLocationToFirestore(longitude, latitude, "citizen");

  //adds citizen id to cookies
  setCitizenCookie(id);

  console.log("Location added");
};

//TODO update location if moved
export const updateCitizenLocation = () => {
  navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;

      if (viewport.latitude && viewport.longitude) {
        hasUserMoved(
          viewport.longitude,
          viewport.latitude,
          longitude,
          latitude
        );
      }

      setViewport({
        longitude,
        latitude,
        zoom: 15,
      });
    },
    (error) => {
      console.log("Error getting location:", error.message);
    },
    { enableHighAccuracy: true, timeout: 60000, maximumAge: 3000 }
  );
};

//get locations from firestore
export const getRescuerLocations = async (setMarkers) => {
  const locations = await getLocationsFromFirestore("rescuer");

  setMarkers(locations);
};

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
export const addLocationToFirestore = async (
  longitude,
  latitude,
  role,
  timestamp = new Date().toISOString(),
  status = "available" //available, assigned, in-transit, unavailable
) => {
  const location = {
    longitude,
    latitude,
    role,
    timestamp,
    status,
  };

  try {
    const docRef = await addDoc(collection(store, "locations"), location);

    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// update location in firestore
export const updateLocationInFirestore = async (
  id,
  longitude,
  latitude,
  timestamp = new Date().toISOString(),
  status = "available" //available, assigned, in-transit, unavailable
) => {
  const location = {
    longitude,
    latitude,
    timestamp,
    status,
  };

  try {
    await updateDoc(doc(store, "locations", id), location);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

//get locations from firestore based on role that are active
export const getLocationsFromFirestore = async (role) => {
  const querySnapshot = await getDocs(collection(store, "locations"));

  const locations = [];

  querySnapshot.forEach((doc) => {
    if (doc.data().role === role) {
      locations.push({ id: doc.id, ...doc.data() });
    }
  });
  return locations;
};

//check if user exists
export const checkUser = async (id) => {
  const querySnapshot = await getDocs(collection(store, "users"));
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users.find((user) => user.id === id);
};

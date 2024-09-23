import { collection, addDoc, getDocs } from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
//TODO: add location id base on the user id
//TODO: use setDoc instead of addDoc
export const addLocation = async (
  longitude,
  latitude,
  role = "rescuer",
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
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

//get locations from firestore based on role that are active
export const getLocations = async (role) => {
  const querySnapshot = await getDocs(collection(store, "locations"));

  const locations = [];

  querySnapshot.forEach((doc) => {
    locations.push({ id: doc.id, ...doc.data() });
  });
  return locations;
};

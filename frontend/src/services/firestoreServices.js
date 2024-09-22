import { collection, addDoc, getDocs } from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
//TODO: add location id base on the user id
//TODO: use setDoc instead of addDoc
export const addLocation = async (
  longitude,
  latitude,
  role = "rescuer",
  timestamp = new Date().toISOString()
) => {
  const location = {
    longitude,
    latitude,
    role,
    timestamp,
  };

  try {
    const docRef = await addDoc(collection(store, "locations"), location);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

//TODO: get locations from firestore based on role
export const getLocations = async (role) => {
  const querySnapshot = await getDocs(collection(store, "locations"));

  const locations = [];

  querySnapshot.forEach((doc) => {
    locations.push(doc.data());
  });
  return locations;
};

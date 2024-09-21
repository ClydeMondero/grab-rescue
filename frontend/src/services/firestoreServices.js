import { collection, addDoc } from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
//TODO: add location id base on the user id
//TODO: use setDoc instead of addDoc
export const addLocation = async (
  longitude,
  latitude,
  role = "rescuer",
  timestamp = Date.now()
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

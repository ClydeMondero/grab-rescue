import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
export const addLocationToFirestore = async (
  longitude,
  latitude,
  address,
  role,
  userId,
  timestamp = new Date().toISOString()
) => {
  const location = {
    longitude,
    latitude,
    address,
    role,
    userId,
    timestamp,
  };

  try {
    const docRef = await addDoc(collection(store, "locations"), location);
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};

// update location in firestore
export const updateLocationInFirestore = async (
  id,
  longitude,
  latitude,
  address,
  timestamp = new Date().toISOString(),
  status = "available" //pending, available, assigned, in-transit, unavailable
) => {
  const location = {
    longitude,
    latitude,
    timestamp,
    status,
    address,
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

//get requests from firestore
export const getRequestsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(store, "requests"));
    const requests = [];

    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

//get request from firestore
export const getRequestFromFirestore = async (id) => {
  try {
    const docRef = doc(store, "requests", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

//add request to firestore
export const addRequestToFirestore = async (
  citizenId,
  location,
  timestamp = new Date().toISOString(),
  status = "pending"
) => {
  const request = {
    citizenId,
    location,
    timestamp,
    status,
  };
  try {
    const docRef = await addDoc(collection(store, "requests"), request);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

//TODO: Use updateRequestInFirestore to send follow up details
// update request in firestore with follow-up details
export const updateRequestInFirestore = async (
  requestId,
  citizenName,
  phone,
  incidentPicture
) => {
  const updateData = {
    citizenName,
    phone,
  };

  try {
    if (incidentPicture) {
      const pictureURL = await uploadImageToFirebaseStorage(incidentPicture);
      if (pictureURL) {
        updateData.incidentPicture = pictureURL;
      }
    }

    await updateDoc(doc(store, "requests", requestId), updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

// Function to upload image to Firebase Storage
export const uploadImageToFirebaseStorage = async (file) => {
  const storage = getStorage(store);
  const storageRef = ref(storage, `images/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    return null;
  }
};

//TODO: update request status
// update request in firestore when rescuer accepts
export const acceptRescueRequestInFirestore = async (
  rescuerId,
  requestId,
  status = "assigned"
) => {
  const updateData = {
    rescuerId,
    status,
    acceptedTimestamp: new Date().toISOString(),
  };
  try {
    await updateDoc(doc(store, "requests", requestId), updateData);
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error: error.message };
  }
};

// get location from firestore
export const getLocationFromFirestore = async (id) => {
  try {
    const docRef = doc(store, "locations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

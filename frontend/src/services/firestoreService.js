import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { store } from "../../firebaseConfig";

//add location to firestore
export const addLocationToFirestore = async (
  longitude,
  latitude,
  address,
  role,
  userId,
  timestamp = new Date().toISOString(),
  status = "online" //online, assigned, in-transit, offline
) => {
  const location = {
    longitude,
    latitude,
    address,
    role,
    userId,
    status,
    timestamp,
  };

  try {
    const docRef = await addDoc(collection(store, "locations"), location);
    return { id: docRef.id };
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};

//update location status
export const updateLocationStatus = async (id, status) => {
  const q = query(collection(store, "locations"), where("userId", "==", id));

  const querySnapshot = await getDocs(q);

  const location = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))[0];

  if (location) {
    const locationRef = doc(store, "locations", location.id);
    try {
      await updateDoc(locationRef, { status });
    } catch (error) {
      console.error(`Error updating location status to ${status}: `, error);
    }
  }
};

//get userId from location document in firestore
export const getIDFromLocation = async (id) => {
  const locationRef = doc(store, "locations", id);
  const docSnap = await getDoc(locationRef);

  if (docSnap.exists()) {
    return docSnap.data().userId;
  } else {
    return null;
  }
};

// update location in firestore
export const updateLocationInFirestore = async (
  id,
  longitude,
  latitude,
  address,
  timestamp = new Date().toISOString(),
  status = "online" //online, assigned, in-transit, offline
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

export const getLocationsFromFirestore = (role, setLocations) => {
  const q = query(collection(store, "locations"));

  // Set up the real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const locations = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().role === role) {
        locations.push({ id: doc.id, ...doc.data() });
      }
    });

    setLocations(locations); // Update the locations in real-time
  });

  return unsubscribe; // To stop listening when needed
};

export const getOnlineLocationsFromFirestore = (role, setLocations) => {
  const q = query(
    collection(store, "locations"),
    where("status", "==", "online")
  );

  // Set up the real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const locations = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().role === role) {
        locations.push({ id: doc.id, ...doc.data() });
      }
    });

    setLocations(locations); // Update the locations in real-time
  });

  return unsubscribe; // To stop listening when needed
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
export const getRequestsFromFirestore = (setRequests) => {
  try {
    const q = query(collection(store, "requests")); // Modify to target the correct collection

    // Set up a Firestore listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requests); // Update requests state in real-time
    });

    return unsubscribe; // Return unsubscribe function to stop listening if needed
  } catch (error) {
    console.error("Error fetching requests: ", error);
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
//TODO: Send request to nearest rescuer
export const addRequestToFirestore = async (
  citizenId,
  location,
  timestamp = new Date().toISOString(),
  status = "pending" //pending, assigned, in-progress, completed
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

// update request in firestore with follow-up details
export const updateRequestInFirestore = async (
  requestId,
  {
    phone,
    citizenName,
    citizenRelation,
    incidentPicture,
    incidentDescription,
  } = {}
) => {
  const updateData = { phone };

  if (citizenName) {
    updateData.citizenName = citizenName;
  }

  if (citizenRelation) {
    updateData.citizenRelation = citizenRelation;
  }

  if (incidentDescription) {
    updateData.incidentDescription = incidentDescription;
  }

  // if (incidentPicture) {
  //   const pictureURL = await uploadImageToFirebaseStorage(incidentPicture);
  //   if (pictureURL) {
  //     updateData.incidentPicture = pictureURL;
  //   }
  // }

  try {
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
//TODO: add ETA and Distance to request
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

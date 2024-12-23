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
  deleteDoc,
} from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { store, storage, messaging } from "../../firebaseConfig";

//add location to firestore
export const addLocationToFirestore = async (
  longitude,
  latitude,
  address,
  role,
  userId,
  rescuerType = "",
  timestamp = new Date().toISOString(),
  status = "online" //online, assigned, in-transit, offline
) => {
  const location = {
    longitude,
    latitude,
    address,
    role,
    userId,
    rescuerType,
    timestamp,
    status,
  };

  try {
    // Delete existing locations with the same userId
    const q = query(
      collection(store, "locations"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Add new location
    const docRef = await addDoc(collection(store, "locations"), location);
    return { id: docRef.id };
  } catch (error) {
    console.log("Error adding document: ", error);
  }
};

// get FCM token
export const setMessagingToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_MESSAGING_VAPID_KEY,
    });
    if (token) {
      return token;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
    return null;
  }
};

export const addMessagingTokenToLocation = async (userId, fcmToken) => {
  try {
    const locationRef = doc(store, "locations", userId);
    await updateDoc(locationRef, { fcmToken });
  } catch (error) {
    console.error("Error updating location document with FCM token:", error);
  }
};

//update location status
export const updateLocationStatus = async (id, status) => {
  const q = query(collection(store, "locations"), where("userId", "==", id));

  const querySnapshot = await getDocs(q);

  const locations = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  // Delete all locations except the first one
  const deletePromises = locations
    .slice(1)
    .map((location) => deleteDoc(doc(store, "locations", location.id)));

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Error deleting duplicate locations: `, error);
  }

  // Update the first location with the new status
  try {
    const locationRef = doc(store, "locations", locations[0].id);
    await updateDoc(locationRef, { status });
  } catch (error) {
    console.error(`Error updating location status to ${status}: `, error);
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

export const clearLocationsCollection = async () => {
  try {
    const querySnapshot = await getDocs(collection(store, "locations"));
    const deletePromises = [];

    querySnapshot.forEach((document) => {
      const documentRef = doc(store, "locations", document.id);
      deletePromises.push(deleteDoc(documentRef));
    });

    await Promise.all(deletePromises);
    console.log(
      "All documents in the 'locations' collection have been deleted."
    );
  } catch (error) {
    console.error("Error clearing 'locations' collection: ", error);
  }
};

//get location reference id by finding the same userId property in a location document
export const getLocationIDFromFirestore = async (userId) => {
  const q = query(
    collection(store, "locations"),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  const location = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))[0];

  if (location) {
    return location.id;
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

export const getLocationFromFirestoreById = async (id) => {
  try {
    const locationRef = doc(store, "locations", id);
    const locationSnap = await getDoc(locationRef);

    if (locationSnap.exists()) {
      return { id: locationSnap.id, ...locationSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting location by ID: ", error);
    return null;
  }
};

// Function to get active rescuer IDs from the `requests` collection
const getActiveRescuerIDs = async () => {
  const activeStatuses = ["assigned", "in transit", "en-route"];
  const q = query(
    collection(store, "requests"),
    where("status", "in", activeStatuses)
  );

  const activeRescuers = new Set();

  // Fetch documents that match active statuses
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.rescuerId) {
      activeRescuers.add(data.rescuerId);
    }
  });

  return Array.from(activeRescuers); // Return array of active rescuer IDs
};

// Function to get filtered online rescuers from Firestore
export const getFilteredOnlineRescuers = async (
  role,
  rescueTypes,
  setRescuers
) => {
  // If rescueTypes is empty, return no rescuer locations
  if (rescueTypes.length === 0) {
    setRescuers([]);
    return;
  }

  // Get the list of active rescuer IDs
  const activeRescuerIDs = await getActiveRescuerIDs();

  const q = query(
    collection(store, "locations"),
    where("status", "==", "online"),
    where("role", "==", role),
    where("rescuerType", "==", rescueTypes) // Filter by rescuerType array
  );

  // Set up the real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const uniqueLocations = new Map();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only add rescuers who are not in active assignments
      if (!activeRescuerIDs.includes(data.userId)) {
        uniqueLocations.set(data.userId, { id: doc.id, ...data });
      }
    });

    setRescuers(Array.from(uniqueLocations.values())); // Update rescuers in real-time
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

export const getHistoryRequestsFromFirestore = (id, role, setRequests) => {
  try {
    const q = query(
      collection(store, "requests"),
      where(role === "citizen" ? "citizenId" : "rescuerId", "==", id),
      where("status", "==", "rescued")
    );

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

//get requests from firestore
export const getFilteredRequestsFromFirestore = (setRequests, rescuerType) => {
  try {
    const q = query(
      collection(store, "requests"),
      where("rescueTypes", "==", rescuerType) // Filter requests by rescuerType
    );

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
export const getRequestFromFirestore = (id, callback) => {
  try {
    const docRef = doc(store, "requests", id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });

    return unsubscribe; // To stop listening when needed
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

//add request to firestore
export const addRequestToFirestore = async (
  citizenId,
  citizenName,
  phone,
  location,
  rescueTypes,
  timestamp = new Date().toISOString(),
  status = "pending" //pending, assigned, in-transit, en route, rescued
) => {
  const request = {
    citizenId,
    citizenName,
    phone,
    location,
    rescueTypes,
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
  { citizenRelation, incidentPicture, incidentDescription } = {}
) => {
  const updateData = {};

  if (citizenRelation) {
    updateData.citizenRelation = citizenRelation;
  }

  if (incidentDescription) {
    updateData.incidentDescription = incidentDescription;
  }

  if (incidentPicture) {
    const pictureURL = await uploadImageToFirebaseStorage(incidentPicture);
    if (pictureURL) {
      updateData.incidentPicture = pictureURL;
    }
  }

  try {
    await updateDoc(doc(store, "requests", requestId), updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

export const addRescuerRemarksToFirestore = async (requestId, remarks) => {
  const updateData = {
    rescuerRemarks: remarks,
  };

  try {
    await updateDoc(doc(store, "requests", requestId), updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

//complete request in firestore
export const completeRequestInFirestore = async (requestId, address) => {
  const updateData = {
    rescuedTimestamp: new Date().toISOString(),
    rescuedAddress: address,
  };

  try {
    await updateDoc(doc(store, "requests", requestId), updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

// Function to upload image to Firebase Storage
export const uploadImageToFirebaseStorage = async (file) => {
  const storageRef = ref(storage, `incidentPictures/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    return null;
  }
};

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

export const updateRequestStatusInFirestore = async (requestId, status) => {
  const updateData = { status };

  try {
    await updateDoc(doc(store, "requests", requestId), updateData);
  } catch (error) {
    console.error("Error updating document: ", error);
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

// get location from firestore in real-time
export const getLocationFromFirestoreInRealTime = async (id, callback) => {
  try {
    const docRef = doc(store, "locations", id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });

    return unsubscribe; // To stop listening when needed
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

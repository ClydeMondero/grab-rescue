import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Map } from "../components";
import {
  addLocationToFirestore,
  getLocations,
} from "../services/firestoreService";
import { setCitizenCookie } from "../services/cookieService";

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
  });
  const [locations, setLocations] = useState([]);

  //go to user page if already logged in
  const verifyToken = async () => {
    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      const role = data.user.account_type;

      navigate("/" + role.toLowerCase(), { replace: true });
    }
  };

  //TODO: move location functions to Map component
  //TODO:check if user location is already set in firebase, if not add location else update location
  //TODO: use state instead of using the navigator

  // set user location to firestore
  const setUserLocation = () => {
    //get user location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (latitude && longitude) {
          setLocation({
            longitude,
            latitude,
          });

          //add location to firestore
          const { id } = await addLocationToFirestore(
            location.longitude,
            location.latitude,
            "citizen"
          );

          //adds citizen id to cookies
          setCitizenCookie(id);

          console.log("Location added");
        } else {
          console.log("No location data available");
        }
      },
      (error) => {
        console.log("Error getting location:", error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  //get locations from firestore
  const getRescuerLocations = async () => {
    const locations = await getLocations("rescuer");

    setLocations(locations);
  };

  useEffect(() => {
    verifyToken();
    getRescuerLocations();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow w-full flex justify-between">
        <div className="flex items-center p-4 gap-4">
          <img src={logo} alt="Grab Rescue" className="h-8 w-auto" />
          <p className="text-2xl font-bold">Grab Rescue</p>
        </div>
        <div className="flex flex-row justify-end p-4 gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/login?role=Rescuer")}
          >
            Login as Rescuer
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            onClick={() => navigate("/login?role=Admin")}
          >
            Login as Admin
          </button>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <p className="text-2xl font-bold mt-5">
            Need help? We got you covered!
          </p>
        </div>
        <div className="w-full h-4/6 mt-10 bg-gray-200">
          <Map locations={locations} />
        </div>
        <button
          onClick={setUserLocation}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-10"
        >
          Request for Help
        </button>
      </div>
    </div>
  );
};

export default Home;

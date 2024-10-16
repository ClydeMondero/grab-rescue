import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CitizenMap as Map } from "../components";
import { FaChevronDown, FaExclamationTriangle } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidHide, BiSolidAmbulance } from "react-icons/bi";
import { MdRoute } from "react-icons/md";
import RequestModal from "../components/RequestModal";
import MultiStepForm from "./MultiStepForm";
import {
  addRequestToFirestore,
  getLocationFromFirestore,
} from "../services/firestoreService";
import { getCitizenCookie } from "../services/cookieService";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const mapRef = useRef(null);
  const [requesting, setRequesting] = useState(false);
  const [locating, setLocating] = useState(true);

  // Verify token function
  const verifyToken = async () => {
    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      const role = data.user.account_type;
      navigate("/" + role.toLowerCase(), { replace: true });
    }
  };

  const handleModalConfirm = async () => {
    if (mapRef.current) {
      const id = getCitizenCookie();
      const location = await getLocationFromFirestore(id);
      addRequestToFirestore(id, location);
    }

    setModalOpen(false);
    setRequesting(true);
    setFormVisible(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false); // Just close the modal, don't show the form
  };

  const handleLocatingChange = (newLocatingState) => {
    setLocating(newLocatingState); // Update only when locating changes
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col">
      {/* Desktop Navbar */}
      <div className="hidden lg:h-[10%] bg-accent text-white shadow-lg px-4 py-2 lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-12 text-primary" />
        </div>
        <ul className="space-x-4 flex items-center justify-center">
          <li>
            <p
              className="text-lg font-semibold cursor-pointer text-text-primary"
              onClick={() => navigate("/about")}
            >
              About
            </p>
          </li>
          <li
            onClick={() => navigate("/login?role=Rescuer")}
            className="cursor-pointer text-text-primary border-primary border-[2px] px-4 py-2 rounded-md hover:opacity-80"
          >
            <p className="text-primary text-md font-semibold">
              Login as Rescuer
            </p>
          </li>
          <li
            onClick={() => navigate("/login?role=Admin")}
            className="cursor-pointer border-[2px] border-primary px-4 py-2 rounded-md hover:opacity-80"
          >
            <p className="text-primary text-md font-semibold">Login as Admin</p>
          </li>
          <li
            onClick={() => navigate("/register")}
            className="bg-primary text-white border-[2px] border-primary px-4 py-2 cursor-pointer rounded-md hover:opacity-80"
          >
            <p className="text-md font-semibold">Be a Rescuer</p>
          </li>
        </ul>
      </div>

      {/* Map and Form Section */}
      <div
        className={`w-full flex-1 relative md:h-[90%] md:bg-slate-200 ${
          formVisible ? "grid grid-cols-1 md:grid-cols-2" : ""
        }`}
      >
        {/* Mobile Menu */}
        <div className="absolute top-4 right-4 m-2 p-2 z-10 rounded-full bg-white shadow-lg md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-md cursor-pointer text-gray-700 rounded-full p-2 hover:bg-gray-200"
          >
            <FaChevronDown className="text-primary-medium" />
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-14 right-0 w-56 bg-background rounded-md shadow-lg py-2 flex items-center justify-center">
              <ul className="space-y-2 flex flex-col items-center w-full">
                <li className="py-2 border-b w-full justify-center">
                  <a
                    href="/login?role=Rescuer"
                    className="flex items-center justify-center w-full text-lg font-semibold "
                  >
                    Login as Rescuer
                  </a>
                </li>
                <li className="py-2 border-b w-full justify-center">
                  <a
                    href="/login?role=Admin"
                    className="flex items-center justify-center w-full text-lg font-semibold "
                  >
                    Login as Admin
                  </a>
                </li>
                <li className="py-2 border-b w-full">
                  <a
                    href="/register"
                    className="flex items-center justify-center w-full text-lg font-semibold "
                  >
                    Be a Rescuer
                  </a>
                </li>
                <li className="py-2">
                  <a
                    href="/about"
                    className="flex items-center w-full text-lg font-semibold hover:underline"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Map Component */}
        <Map ref={mapRef} onLocatingChange={handleLocatingChange} />

        {/* MultiStepForm Component (visible after modal closes) */}
        {formVisible && (
          <div className="p-4 bg-white shadow-md flex flex-col justify-center items-center md:h-full md:p-6">
            <MultiStepForm />
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      <div
        className={`${
          requesting ? "hidden" : ""
        } h-[20%] w-full bg-background-light px-2 pb-2 flex flex-col justify-between gap-2 md:h-[10%]`}
      >
        {!requesting &&
          (!locating ? (
            <button
              className="flex-1 bg-secondary hover:opacity-80 text-white font-bold p-2 rounded"
              onClick={() => setModalOpen(true)} // Open modal on click
            >
              Request for Help
            </button>
          ) : (
            <button
              className="flex-1 bg-background-medium  text-white font-bold p-2 rounded"
              disabled={true}
            >
              Tracking your Location
            </button>
          ))}

        <div className="flex items-center gap-4 md:hidden">
          <div className="bg-white flex items-center justify-around gap-4 rounded-lg px-2 py-4 font-medium text-sm text-center flex-1">
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  mapRef.current.locateCitizen();
                }}
                className="bg-background-light rounded-full p-3 flex items-center justify-center"
              >
                <FaLocationPin className="text-2xl text-text-primary" />
              </button>
              <p className="text-text-primary">My Location</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  mapRef.current.goToNearestRescuer();
                }}
                className="bg-background-light rounded-full p-3 flex items-center justify-center"
              >
                <BiSolidAmbulance className="text-text-primary text-2xl" />
              </button>
              <p className="text-text-primary">Nearest Rescuer</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  mapRef.current.viewRoute();
                }}
                className="bg-background-light rounded-full p-3 flex items-center justify-center"
              >
                <MdRoute className="text-2xl text-text-primary" />
              </button>
              <p className="text-text-primary">View Route</p>
            </div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  mapRef.current.hideRoute();
                }}
                className="bg-background-light rounded-full p-3 flex items-center justify-center"
              >
                <BiSolidHide className="text-text-primary text-2xl" />
              </button>
              <p className="text-text-primary">Hide Route</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <RequestModal
          onConfirm={handleModalConfirm} // Handle modal confirmation to show the form
          onCancel={handleModalCancel} // Handle modal cancellation to simply close the modal
        />
      )}
    </div>
  );
};

export default Home;

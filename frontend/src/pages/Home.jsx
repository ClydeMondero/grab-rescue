import { useState, useEffect, useRef, useContext } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CitizenMap as Map, Loader, Toast, RequestModal } from "../components";
import { FaChevronDown, FaPhone } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidHide, BiSolidAmbulance } from "react-icons/bi";
import { MdDragHandle } from "react-icons/md";
import { MdRoute } from "react-icons/md";
import { MultiStepForm } from "../pages";
import {
  addRequestToFirestore,
  getLocationFromFirestore,
  getRequestFromFirestore,
  getLocationsFromFirestore,
  clearLocationsCollection,
} from "../services/firestoreService";
import {
  getCitizenCookie,
  getRequestCookie,
  setRequestCookie,
  deleteCookie, // Import deleteCookie
} from "../services/cookieService";
import { StatusContext } from "../contexts/StatusContext";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [locating, setLocating] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [request, setRequest] = useState(null);
  const [rescuer, setRescuer] = useState(null);
  const [nearestRescuer, setNearestRescuer] = useState(null);
  const [onMobile, setOnMobile] = useState(false);
  const [allRescuers, setAllRescuers] = useState([]);
  const [onlineRescuers, setOnlineRescuers] = useState([]);
  const [assignedRescuer, setAssignedRescuer] = useState(null);

  const { getId } = useContext(StatusContext);
  const mapRef = useRef(null);

  // Verify token function
  const verifyToken = async () => {
    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      const role = data.user.account_type;
      navigate("/" + role.toLowerCase(), { replace: true });
    }
  };

  const getRescuer = async () => {
    if (!request || !request.rescuerId) return null;

    try {
      const response = await axios.get(`/rescuers/get/${request.rescuerId}`);
      if (response.data) {
        return response.data;
      } else {
        console.error("Rescuer not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching rescuer: ", error);
      return null;
    }
  };

  const checkRequest = () => {
    const requestId = getRequestCookie();

    if (requestId) {
      handleRequesting();
    } else {
      return;
    }

    const unsubscribe = getRequestFromFirestore(requestId, (onGoingRequest) => {
      setRequest(onGoingRequest);

      // Check if the request status is 'rescued'
      if (onGoingRequest && onGoingRequest.status === "rescued") {
        setRequest(null);
        setRequesting(false); // Clear requesting state
        deleteCookie("request_token"); // Delete the request_token cookie
        setAssignedRescuer(null);
      }
    });

    return () => {
      unsubscribe();
    };
  };

  const handleNearestRescuerUpdate = (rescuer) => {
    setNearestRescuer(rescuer);
  };

  const handlePhone = () => {
    if (onMobile) {
      window.location.href = `tel:${request.phone}`;
    } else {
      navigator.clipboard
        .writeText(request.phone)
        .then(() => {
          toast.info("Phone copied to clipboard");
        })
        .catch((err) => {
          toast.warning("Phone didn't get copied");
        });
    }
  };

  useEffect(() => {
    if (!nearestRescuer) return;
    console.log("nearestRescuer", nearestRescuer.fcmToken);
  }, [nearestRescuer]);

  const handleModalConfirm = async () => {
    if (mapRef.current) {
      const citizenId = getCitizenCookie();

      const location = await getLocationFromFirestore(citizenId);

      const { id } = await addRequestToFirestore(citizenId, location);
      setRequestCookie(id);
      checkRequest();

      // Send notification to nearest rescuer
      if (nearestRescuer && nearestRescuer.fcmToken) {
        const notificationPayload = {
          token: nearestRescuer.fcmToken,
          title: "Emergency Request!",
          body: "You are the nearest rescuer to a citizen in need. Please respond!",
          citizenId: citizenId,
        };

        try {
          await axios.post("/messages/send", notificationPayload);

          toast.success("Notification sent to nearest rescuer");
        } catch (error) {
          console.error("Failed to send notification:", error);
          toast.error("Failed to send notification");
        }
      }
    }

    handleRequesting();
  };

  const handleRequesting = () => {
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
    getLocationsFromFirestore("rescuer", setAllRescuers);
  }, []);

  useEffect(() => {
    if (!allRescuers) return;
    const onlineRescuersFiltered = allRescuers.filter(
      (rescuer) => rescuer.status === "online" && rescuer.role === "rescuer"
    );
    setOnlineRescuers(onlineRescuersFiltered);
  }, [allRescuers]);

  useEffect(() => {
    if (!request) return;
    const assigned = allRescuers.filter(
      (rescuer) => rescuer.userId === request.rescuerId
    );
    setAssignedRescuer(assigned[0]);
  }, [request]);

  useEffect(() => {
    getId();
    verifyToken();
    checkRequest();

    const md = new MobileDetect(window.navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isMobile = !!md.mobile() && isSmallScreen;

    setOnMobile(isMobile);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.resize) {
      mapRef.current.resize();
    }
  }, [formVisible]);

  useEffect(() => {
    const getRescuerDetails = async () => {
      if (!request) return;

      const rescuer = await getRescuer();

      if (rescuer) {
        setRescuer(rescuer[0]);
      }
    };

    getRescuerDetails();
  }, [request]);

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
        </ul>
      </div>

      {/* Map and Form Section */}
      <div
        className={`h-full w-full relative flex flex-col md:h-[90%] bg-background-light ${
          formVisible ? "justify-around" : ""
        }`}
      >
        {/* Mobile Menu */}
        <div className="absolute top-4 right-4 m-2 p-2 z-50 rounded-full bg-white shadow-lg md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-md cursor-pointer text-gray-700 rounded-full p-2 hover:bg-gray-200"
          >
            <FaChevronDown className="text-primary-medium" />
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-14 right-0 w-56 bg-background text-primary-medium rounded-md shadow-lg py-2 flex items-center justify-center">
              <ul className="space-y-2 flex flex-col items-center w-full">
                <li className="py-2 border-b w-full justify-center">
                  <button
                    onClick={() => navigate("/login?role=Rescuer")}
                    className="flex items-center justify-center w-full text-lg font-semibold "
                  >
                    Login as Rescuer
                  </button>
                </li>
                <li className="py-2 border-b w-full justify-center">
                  <button
                    onClick={() => navigate("/login?role=Admin")}
                    className="flex items-center justify-center w-full text-lg font-semibold "
                  >
                    Login as Admin
                  </button>
                </li>
                <li className="py-2">
                  <button
                    onClick={() => navigate("/about")}
                    className="flex items-center w-full text-lg font-semibold hover:underline"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Map Component */}
        <Map
          ref={mapRef}
          onLocatingChange={handleLocatingChange}
          onNearestRescuerUpdate={handleNearestRescuerUpdate}
          assignedRescuer={assignedRescuer}
        />

        {requesting && (
          <div
            className={`bg-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out`}
          >
            {request && request.status == "pending" ? (
              <p>Waiting for rescuer acceptance...</p>
            ) : rescuer ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-xs text-primary-medium">
                    Assigned Rescuer
                  </p>
                  <p className="text-primary-dark font-semibold text-xl">
                    {`${rescuer.first_name} ${rescuer.middle_name || ""} ${
                      rescuer.last_name
                    }`.trim()}
                  </p>
                  <p className="text-background-dark text-sm font-semibold">
                    {rescuer.municipality}
                  </p>
                </div>
                <button
                  onClick={handlePhone}
                  className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white text-2xl cursor-pointer"
                >
                  <FaPhone />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Loader isLoading={true} color={"#557C55"} size={25} />
              </div>
            )}
          </div>
        )}

        {/* Sliding Pane */}
        {requesting && (
          <div
            className={`border-x-background-medium border-t-2 p-2 w-full flex flex-col items-center transition-all duration-300 ease-in-out rounded-t-2xl ${
              formVisible ? "h-[100%] bg-white" : "h-[10%] bg-primary-medium "
            } `}
          >
            <MdDragHandle
              onClick={() => setFormVisible(!formVisible)}
              className="text-background-medium h-10 w-10"
            />
            <p
              className={`text-lg font-bold ${
                formVisible ? "text-primary-medium" : "text-white"
              }`}
            >
              Provide Information
            </p>

            {formVisible && (
              <MultiStepForm request={request} setRequest={setRequest} />
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div
        className={`w-full ${
          requesting ? "h-[15%]" : "h-[25%]"
        }flex flex-col gap-2 bg-background-light p-2 justify-center md:h-[10%] ${
          requesting ? "md:hidden" : ""
        }`}
      >
        {/* Request Button */}
        {!requesting &&
          (!locating ? (
            <button
              className={`w-full flex-1 font-bold p-4 rounded-lg ${
                onlineRescuers.length === 0
                  ? "bg-background-medium cursor-not-allowed text-text-primary" // Disabled color
                  : "bg-secondary hover:opacity-80 text-white" // Enabled color
              }`}
              onClick={() => setModalOpen(true)}
              disabled={onlineRescuers.length === 0}
            >
              {onlineRescuers.length === 0
                ? "No Online Rescuers"
                : "Request for Help"}
            </button>
          ) : (
            <button
              className="w-full flex-1 bg-background-medium text-white font-bold p-4 rounded-lg"
              disabled={true}
            >
              Tracking your Location
            </button>
          ))}

        {/* Mobile Map Buttons (only show on mobile screens) */}
        <div className="flex-1 bg-white flex items-center justify-around gap-4 rounded-lg px-2 py-4 font-medium text-sm text-center md:hidden">
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

      {modalOpen && (
        <RequestModal
          onConfirm={handleModalConfirm} // Handle modal confirmation to show the form
          onCancel={handleModalCancel} // Handle modal cancellation to simply close the modal
        />
      )}
      <Toast />
    </div>
  );
};

export default Home;

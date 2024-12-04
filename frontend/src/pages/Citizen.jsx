import { useState, useEffect, useRef, useContext } from "react";
import logo from "../assets/logo.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Nav,
  CitizenMap as Map,
  Loader,
  Toast,
  RequestModal,
} from "../components";
import { FaChevronDown, FaPhone, FaUserCircle } from "react-icons/fa";
import { FaLocationPin, FaPersonRifle } from "react-icons/fa6";
import { BiSolidHide, BiSolidAmbulance } from "react-icons/bi";
import { MdDragHandle } from "react-icons/md";
import { MdRoute, MdCheck } from "react-icons/md";
import { CitizenProfile, MultiStepForm } from ".";
import {
  addRequestToFirestore,
  getLocationFromFirestore,
  getRequestFromFirestore,
  getLocationsFromFirestore,
  clearLocationsCollection,
  getLocationFromFirestoreInRealTime,
  getFilteredOnlineRescuers,
} from "../services/firestoreService";
import {
  getCitizenCookie,
  getRequestCookie,
  setRequestCookie,
  deleteCookie, // Import deleteCookie
} from "../services/cookieService";
import { StatusContext } from "../contexts/StatusContext";
import { RequestContext } from "../contexts/RequestContext";
import MobileDetect from "mobile-detect";
import { toast } from "react-toastify";
import { hotlines } from "../constants/Hotlines";
import { HotlineModal } from ".";
import { IoPerson } from "react-icons/io5";
import { PiFireTruckFill } from "react-icons/pi";
import { RiPoliceCarFill } from "react-icons/ri";

const Citizen = ({ user }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [locating, setLocating] = useState(true);
  const { requesting, setRequesting } = useContext(RequestContext);
  const [request, setRequest] = useState(null);
  const [rescuer, setRescuer] = useState(null);
  const [nearestRescuer, setNearestRescuer] = useState(null);
  const [onMobile, setOnMobile] = useState(false);
  const [allRescuers, setAllRescuers] = useState([]);
  const [onlineRescuers, setOnlineRescuers] = useState([]);
  const [assignedRescuer, setAssignedRescuer] = useState(null);
  const [hotlineModalOpen, setHotlineModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [rescueTypes, setRescueType] = useState(["MDRRMO"]);

  const { getId } = useContext(StatusContext);
  const mapRef = useRef(null);

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

      if (onGoingRequest.status === "rescued") {
        handleCompleteRequest();
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

  const handleModalConfirm = async () => {
    if (mapRef.current) {
      const citizenId = getCitizenCookie();

      const location = await getLocationFromFirestore(citizenId);

      const citizenName = `${user.first_name} ${user.middle_name} ${user.last_name}`;

      const { id } = await addRequestToFirestore(
        citizenId,
        citizenName,
        user.contact_number,
        location,
        rescueTypes
      );

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

  const handleCompleteRequest = () => {
    deleteCookie("request_token");
    setRequest(null);
    setRequesting(false);
    setAssignedRescuer(null);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
    const fetchAndSubscribe = async () => {
      const unsubscribe = await getFilteredOnlineRescuers(
        "rescuer",
        rescueTypes,
        setOnlineRescuers
      );
      return unsubscribe;
    };

    const unsubscribeFunction = fetchAndSubscribe();

    return () => {
      unsubscribeFunction.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, [allRescuers, rescueTypes]);

  useEffect(() => {
    if (!request) return;

    if (!request.rescuerId) return;

    const assigned = allRescuers.filter(
      (rescuer) => rescuer.userId === request.rescuerId
    );

    if (assigned) {
      getLocationFromFirestoreInRealTime(assigned[0].id, setAssignedRescuer);
    }
  }, [request]);

  useEffect(() => {
    getId();
    checkRequest();

    const md = new MobileDetect(window.navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    const isMobile = !!md.mobile() && isSmallScreen;

    setOnMobile(isMobile);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.resize) {
      setTimeout(() => mapRef.current.resize(), 500);
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
      {/* Map and Form Section */}
      <div
        className={`h-full w-full relative flex flex-col md:h-[90%] bg-background-light ${
          formVisible ? "justify-around" : ""
        } ${profileOpen ? "hidden" : ""}`}
      >
        {/* Filters - only show if not requesting and locating */}
        {!requesting && !locating && (
          <details className="absolute top-4 left-4 m-2 p-6 z-50 rounded-lg bg-white shadow-lg outline-none w-max">
            <summary className="flex items-center cursor-pointer text-secondary font-bold">
              Rescue Type
              <FaChevronDown className="ml-2" />
            </summary>
            <div className="flex flex-col space-y-2 mt-2">
              <label className="text-md flex items-center cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  value="MDRRMO"
                  checked={rescueTypes.includes("MDRRMO")}
                  onChange={(e) =>
                    setRescueType((prev) =>
                      e.target.checked
                        ? [...prev, e.target.value]
                        : prev.filter((item) => item !== e.target.value)
                    )
                  }
                  className="mr-2 scale-125 rounded-md border border-gray-300 accent-background-medium"
                />
                <BiSolidAmbulance className="mr-1 text-xl text-primary" />
                Accidents
              </label>
              <label className="text-md flex items-center cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  value="BFP"
                  checked={rescueTypes.includes("BFP")}
                  onChange={(e) =>
                    setRescueType((prev) =>
                      e.target.checked
                        ? [...prev, e.target.value]
                        : prev.filter((item) => item !== e.target.value)
                    )
                  }
                  className="mr-2 scale-125 rounded-md border border-gray-300 accent-background-medium"
                />
                <PiFireTruckFill className="mr-1 text-xl text-warning" />
                Fire
              </label>
              <label className="text-md flex items-center cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  value="PNP"
                  checked={rescueTypes.includes("PNP")}
                  onChange={(e) =>
                    setRescueType((prev) =>
                      e.target.checked
                        ? [...prev, e.target.value]
                        : prev.filter((item) => item !== e.target.value)
                    )
                  }
                  className="mr-2 scale-125 rounded-md border border-gray-300 accent-background-medium"
                />
                <RiPoliceCarFill className="mr-1 text-xl text-highlight" />
                Crime
              </label>
            </div>
          </details>
        )}

        {/* Mobile Menu */}
        <div className="absolute top-4 right-4 m-2 p-2 z-50 rounded-full bg-white shadow-lg hover:bg-gray-200">
          <button
            onClick={() => setProfileOpen(true)}
            className="text-md cursor-pointer text-gray-700 rounded-full p-2 "
          >
            <IoPerson className="text-primary-medium text-xl" />
          </button>
        </div>

        {/* Map Component */}
        <Map
          ref={mapRef}
          rescuers={onlineRescuers}
          onLocatingChange={handleLocatingChange}
          onNearestRescuerUpdate={handleNearestRescuerUpdate}
          assignedRescuer={assignedRescuer}
          requesting={requesting}
        />

        {requesting && (
          <div
            className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out`}
          >
            {request && request.status == "pending" ? (
              <p className="animate-pulse">
                {
                  [
                    "Please stay at your location.",
                    "Waiting for rescuer acceptance...",
                  ].sort(() => 0.5 - Math.random())[0]
                }
              </p>
            ) : rescuer ? (
              <div className="flex items-center w-full">
                <div className="flex flex-col w-full">
                  <p className="text-xs text-primary-medium">
                    Assigned Rescuer
                  </p>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-primary-dark font-semibold text-xl">
                        {`${rescuer.first_name} ${rescuer.middle_name || ""} ${
                          rescuer.last_name
                        }`.trim()}
                      </p>
                      <p className="text-background-dark text-sm font-semibold">
                        {rescuer.municipality}, {rescuer.barangay}
                      </p>
                      <div
                        className={`text-xs w-max font-semibold text-highlight p-3 mt-2 rounded-full border border-highlight ${
                          request?.status === "rescued"
                            ? "border-green-500"
                            : ""
                        }`}
                      >
                        {request
                          ? request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)
                          : ""}
                      </div>
                    </div>
                    <button
                      onClick={handlePhone}
                      className="p-4 text-lg h-max bg-primary rounded-full text-white shadow hover:bg-primary-dark transition"
                    >
                      <FaPhone />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Loader isLoading={true} color={"#557C55"} size={25} />
              </div>
            )}
          </div>
        )}

        {/* Sliding Pane */}
        {requesting && request?.status != "rescued" && (
          <div
            className={`border-x-background-medium border-t-2 p-2 w-full flex flex-col items-center transition-all duration-300 ease-in-out rounded-t-2xl ${
              formVisible ? "h-[100%] bg-white" : "h-[10%] bg-primary-medium "
            } `}
          >
            <MdDragHandle
              onClick={() => {
                setFormVisible(!formVisible);
              }}
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
        } flex flex-col gap-2 bg-background-light p-2 justify-center  relative ${
          profileOpen ? "hidden" : ""
        }`}
      >
        {/* Hotline Button */}
        {!requesting && (locating || onlineRescuers.length === 0) && (
          <div className="absolute -top-20 right-8 z-40">
            <button
              onClick={() => setHotlineModalOpen(true)}
              className="bg-primary hover:bg-primary-medium text-white font-semibold p-4 rounded-full transition-colors duration-200 ease-in-out"
            >
              <FaPhone className="text-3xl" />
            </button>
          </div>
        )}

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

        {/* Render HotlineModal */}
        {hotlineModalOpen && (
          <HotlineModal onClose={() => setHotlineModalOpen(false)} />
        )}

        {/* Mobile Map Buttons (only show on mobile screens) */}
        <div className="flex-1 bg-white flex items-center justify-around gap-4 rounded-lg px-2 py-4 font-medium text-sm text-center ">
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
            <p className="text-text-primary">
              {assignedRescuer ? "Assigned Rescuer" : "Nearest Rescuer"}
            </p>
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

      {profileOpen && (
        <CitizenProfile
          user={user}
          setProfileOpen={setProfileOpen}
          requesting={requesting}
        />
      )}

      <Toast />
    </div>
  );
};

export default Citizen;

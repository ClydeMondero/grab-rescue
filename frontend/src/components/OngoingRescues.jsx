import { useState, useEffect } from "react";
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
} from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import { FaLocationPin } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import placeholder from "../assets/placeholder.png";
import logo from "../assets/logo.png";
import {
  getLocationFromFirestoreInRealTime,
  getLocationIDFromFirestore,
} from "../services/firestoreService";
import { BiSolidAmbulance } from "react-icons/bi";

const OngoingRescues = ({ requests, user }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRescue, setSelectedRescue] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [rescuerName, setRescuerName] = useState(null);
  const [rescuerNames, setRescuerNames] = useState([]);
  const [rescuerContactNumber, setRescuerContactNumber] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [rescuerArea, setRescuerArea] = useState(null);
  const [citizen, setCitizen] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });
  const [rescuer, setRescuer] = useState({
    longitude: 120.9107,
    latitude: 14.9536,
    zoom: 15,
  });

  const [bounds, setBounds] = useState([]);

  const ongoingRescues = requests
    .filter((request) => {
      if (filterStatus === "all") {
        return (
          request.status === "assigned" ||
          request.status === "in transit" ||
          request.status === "en route" ||
          request.status === "rescued"
        );
      }
      return request.status === filterStatus;
    })
    .sort((a, b) => {
      const statusOrder = {
        assigned: 0,
        "in transit": 1,
        "en route": 2,
        rescued: 3,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    })
    .map((request, index) => ({
      id: index + 1,
      location: request.location.address,
      rescuer: request.rescuerId,
      rescuerName: rescuerNames[request.rescuerId] || "Unknown",
      status: request.status,
      acceptedTimestamp: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(request.acceptedTimestamp)),
      originalRequest: request,
    }));

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalRows = ongoingRescues.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRescues = ongoingRescues.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleShowMap = async (request) => {
    console.log("request", request);

    const citizenId = request.originalRequest.citizenId;
    getLocationFromFirestoreInRealTime(citizenId, setCitizen);

    const rescuerId = request.originalRequest.rescuerId;

    const rescuerLocation = await getLocationIDFromFirestore(rescuerId);

    getLocationFromFirestoreInRealTime(rescuerLocation, setRescuer);

    const rescuerLongitude = rescuer.longitude;
    const rescuerLatitude = rescuer.latitude;
    const citizenLongitude = citizen.longitude;
    const citizenLatitude = citizen.latitude;

    const selectedLongitude = (rescuerLongitude + citizenLongitude) / 2;
    const selectedLatitude = (rescuerLatitude + citizenLatitude) / 2;

    setSelectedLocation({
      longitude: selectedLongitude,
      latitude: selectedLatitude,
      zoom: 12,
      padding: 50,
    });

    setShowMap(true);
  };

  useEffect(() => {
    console.log("citizen", citizen);
  }, [citizen]);

  useEffect(() => {
    console.log("rescuer", rescuer);
  }, [rescuer]);

  const handleCloseMap = () => {
    setShowMap(false);
    setSelectedLocation(null);
  };

  const handleRowClick = (request) => {
    setSelectedRescue(request.originalRequest);
    getRescuer(request.rescuer);
  };

  const getRescuer = async (rescuerId) => {
    try {
      const response = await axios.get(`/rescuers/get/${rescuerId}`);
      if (response.data) {
        return response.data;
      } else {
        console.error("Rescuer not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching rescuer: ", error);
      return null;
    }
  };

  const getRescuers = async () => {
    try {
      const response = await axios.get(`/rescuers/get/`);
      if (response.data) {
        return response.data;
      } else {
        console.error("Rescuer not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching rescuer: ", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRescuer = async () => {
      if (selectedRescue?.rescuerId) {
        const rescuer = await getRescuer(selectedRescue.rescuerId);
        if (rescuer) {
          const { first_name, middle_name, last_name } = rescuer[0];
          const fullName = `${first_name} ${middle_name} ${last_name}`;
          const contactNumber = `${rescuer[0].contact_number}`;
          const { barangay, municipality } = rescuer[0];

          setRescuerArea(barangay + ", " + municipality);
          setRescuerName(fullName);
          setRescuerContactNumber(contactNumber);
        }
      }
    };

    fetchRescuer();
  }, [selectedRescue]);

  useEffect(() => {
    const fetchAllRescuers = async () => {
      const rescuers = await getRescuers();
      if (rescuers) {
        const rescuersById = rescuers.reduce((acc, rescuer) => {
          const fullName =
            `${rescuer.first_name} ${rescuer.middle_name} ${rescuer.last_name}`.trim();
          acc[rescuer.id] = fullName;
          return acc;
        }, {});
        setRescuerNames(rescuersById);
      }
    };

    fetchAllRescuers();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Updated handleReportSelection to pass the correct report type
  const handleReportSelection = (reportName) => {
    const today = new Date();
    let selectedStartDate, selectedEndDate;

    // Set start and end dates based on report type
    if (reportName === "Daily Report") {
      selectedStartDate = formatDate(today);
      selectedEndDate = formatDate(today);
    } else if (reportName === "Weekly Report") {
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
      selectedStartDate = formatDate(sunday);
      selectedEndDate = formatDate(today);
    } else if (reportName === "Monthly Report") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      selectedStartDate = formatDate(startOfMonth);
      selectedEndDate = formatDate(endOfMonth);
    } else if (
      reportName === "Custom Report" &&
      customStartDate &&
      customEndDate
    ) {
      selectedStartDate = formatDate(customStartDate);
      selectedEndDate = formatDate(customEndDate);
    } else {
      console.error("Invalid report type or missing custom dates");
      return;
    }

    // Pass the correct report type to handleGeneratePDF
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    handleGeneratePDF(selectedStartDate, selectedEndDate, reportName); // Explicitly pass reportName as reportType
    setShowPrintModal(false);
  };

  const handleCloseDetails = () => {
    setSelectedRescue(null);
    setRescuerName(null);
  };

  const handleGeneratePDF = (startDate, endDate, reportType) => {
    const doc = new jsPDF("landscape");

    // Parse start and end dates as Date objects, including time boundaries for filtering
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const imageWidth = 40;
    const imageHeight = 8;

    doc.addImage(logo, "PNG", 10, 10, imageWidth, imageHeight);

    // Define titles and descriptions based on report type
    let reportTitle;
    let reportDescription;

    switch (reportType) {
      case "Daily Report":
        reportTitle = "Daily Rescue Operations Report";
        reportDescription =
          "A summary of rescue operations conducted throughout the day.";
        break;
      case "Weekly Report":
        reportTitle = "Weekly Rescue Operations Report";
        reportDescription =
          "A report summarizing the rescue operations conducted over the past week.";
        break;
      case "Monthly Report":
        reportTitle = "Monthly Rescue Operations Report";
        reportDescription =
          "A comprehensive report of all rescue operations conducted during the month.";
        break;
      case "Custom Report":
        reportTitle = "Custom Date Range Report";
        reportDescription = `Report for rescue operations conducted between ${startDate} and ${endDate}.`;
        break;
      default:
        console.error("Invalid report type");
        return;
    }

    // Filter rescues that fall within the date range
    const filteredRescues = ongoingRescues.filter((rescue) => {
      const requestTimestamp = new Date(
        rescue.originalRequest.acceptedTimestamp
      );
      return requestTimestamp >= start && requestTimestamp <= end;
    });

    doc.setFontSize(22);
    doc.setTextColor("#333333");
    doc.setFont("helvetica", "bold");
    doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor("#666666");
    doc.setFont("helvetica", "italic");
    doc.text(reportDescription, doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    // Table columns
    const tableColumn = [
      { title: "#", dataKey: "id" },
      { title: "Rescuer ID", dataKey: "rescuer" },
      { title: "Rescuer Name", dataKey: "rescuerName" },
      { title: "Citizen Name", dataKey: "citizenName" },
      { title: "Location", dataKey: "location" },
      { title: "Request Date & Time", dataKey: "requestTimestamp" },
      { title: "Accepted Date & Time", dataKey: "acceptedTimestamp" },
      { title: "Rescued Date & Time", dataKey: "rescuedTimestamp" },
      { title: "Status", dataKey: "status" },
    ];

    // Rows data
    const tableRows = filteredRescues.map((rescue, index) => ({
      id: index + 1,
      rescuer: rescue.rescuer,
      rescuerName: rescue.rescuerName || "",
      citizenName: rescue.originalRequest.citizenName || "",
      location: rescue.location,
      requestTimestamp: formatDateTime(rescue.originalRequest.timestamp),
      acceptedTimestamp: formatDateTime(rescue.acceptedTimestamp),
      rescuedTimestamp: formatDateTime(rescue.originalRequest.rescuedTimestamp),
      status: rescue.status.charAt(0).toUpperCase() + rescue.status.slice(1),
    }));

    // Customized table style
    doc.autoTable({
      head: [tableColumn.map((col) => col.title)],
      body: tableRows.map((row) => Object.values(row)),
      startY: 50,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        lineColor: "#CCCCCC",
        lineWidth: 0.25,
      },
      headStyles: {
        fillColor: "#557C55",
        textColor: "#FFFFFF",
        fontSize: 9,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: "#F8F8F8",
        textColor: "#333333",
        fontStyle: "semibold",
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Column width for #
        1: { cellWidth: 20 }, // Rescuer ID
        2: { cellWidth: 35 }, // Rescuer Name
        3: { cellWidth: 35 }, // Citizen Name
        4: { cellWidth: 50 }, // Location
        5: { cellWidth: 35 }, // Request Date & Time
        6: { cellWidth: 35 }, // Accepted Date & Time
        7: { cellWidth: 35 }, // Rescued Date & Time
        8: { cellWidth: 25 }, // Status
      },
      tableWidth: "auto",
      margin: { left: (doc.internal.pageSize.getWidth() - 280) / 2 },
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setTextColor("#333333");
    doc.text(
      `Generated by: ${user?.first_name} ${user?.last_name}`,
      10,
      footerY
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth - 70,
      footerY
    );

    const formattedStartDate = startDate.replace(/-/g, "");
    const formattedEndDate = endDate.replace(/-/g, "");
    doc.save(
      `${reportType
        .toLowerCase()
        .replace(/\s/g, "_")}_${formattedStartDate}_to_${formattedEndDate}.pdf`
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString)
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  return (
    <div className="flex flex-col p-4 lg:p-6 h-full">
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-gray-800 flex items-center">
                <AiFillPrinter className="mr-2 text-primary-dark" />
                Choose Report Period
              </h4>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <button
              onClick={() => handleReportSelection("Daily Report")}
              className="flex items-center w-full bg-primary-medium text-white py-3 rounded-lg mb-3 shadow-md hover:bg-primary-dark transition"
            >
              <FaCalendarDay className="mr-3 ml-2 text-lg" />
              <span className="text-lg font-semibold">Daily Report</span>
            </button>

            <button
              onClick={() => handleReportSelection("Weekly Report")}
              className="flex items-center w-full bg-primary-medium text-white py-3 rounded-lg mb-3 shadow-md hover:bg-primary-dark transition"
            >
              <FaCalendarWeek className="mr-3 ml-2 text-lg" />
              <span className="text-lg font-semibold">Weekly Report</span>
            </button>

            <button
              onClick={() => handleReportSelection("Monthly Report")}
              className="flex items-center w-full bg-primary-medium text-white py-3 rounded-lg mb-3 shadow-md hover:bg-primary-dark transition"
            >
              <FaCalendarAlt className="mr-3 ml-2 text-lg" />
              <span className="text-lg font-semibold">Monthly Report</span>
            </button>

            <div className="mb-4 mt-16">
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Custom Date Range:
              </label>
              <div className="flex space-x-3">
                <DatePicker
                  selected={customStartDate}
                  onChange={(date) => setCustomStartDate(date)}
                  placeholderText="Start Date"
                  className="border border-gray-300 py-2 px-3 rounded-lg w-full text-gray-700"
                />
                <DatePicker
                  selected={customEndDate}
                  onChange={(date) => setCustomEndDate(date)}
                  placeholderText="End Date"
                  className="border border-gray-300 py-2 px-3 rounded-lg w-full text-gray-700"
                />
              </div>
            </div>

            <button
              onClick={() => handleReportSelection("Custom Report")}
              className="w-full flex items-center justify-center bg-primary-medium text-white py-3 rounded-lg shadow-md hover:bg-primary-dark transition"
              disabled={!customStartDate || !customEndDate}
            >
              <FaFileAlt className="mr-3 text-lg" />
              <span className="text-lg font-semibold">
                Generate Custom Report
              </span>
            </button>

            <button
              onClick={() => setShowPrintModal(false)}
              className="w-full mt-4 flex items-center justify-center bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              <FaTimes className="mr-3 text-lg" />
              <span className="text-lg font-semibold">Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <FaAmbulance className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Rescue Operations
        </h4>
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="status-filter"
              className="mr-2 font-semibold text-primary-dark bg-white rounded-md"
            >
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-200 text-black rounded-lg p-3 max-w-full lg:max-w-[200px]"
            >
              <option value="all">All</option>
              <option value="assigned">Assigned</option>
              <option value="rescued">Rescued</option>
            </select>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className="w-max bg-gray-200 text-black p-3 rounded-lg hover:opacity-80 transition flex items-center"
          >
            <AiFillPrinter className="text-base mr-1" />
            Generate PDF
          </button>
        </div>

        <div className="hidden lg:block overflow-x-auto cursor-pointer">
          <table className="min-w-full bg-gray-200 border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#557C55] text-white">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium">#</th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Rescuer ID
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Rescuer Name
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Citizen Name
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Location
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Accepted Timestamp
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Map
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRescues.map((requests) => (
                <tr
                  key={requests.id}
                  className="border-b bg-white hover:bg-background-light"
                  onClick={() => handleRowClick(requests)}
                >
                  <td className="px-4 py-2 text-center text-sm text-info font-semibold">
                    {requests.id}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.rescuer}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.rescuerName}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.originalRequest.citizenName || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.location}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.acceptedTimestamp}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`text-xs p-3 rounded-lg ${
                        requests.status === "assigned"
                          ? "bg-highlight text-white"
                          : requests.status === "in transit"
                          ? "bg-yellow-500 text-white"
                          : requests.status === "en route"
                          ? "bg-orange-500 text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      {requests.status.charAt(0).toUpperCase() +
                        requests.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {requests.status !== "rescued" && (
                      <div className="flex justify-center">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleShowMap(requests);
                          }}
                          className="bg-secondary text-white px-4 py-1 rounded-full hover:bg-primary-medium transition flex items-center justify-center"
                        >
                          <FaMapMarkerAlt className="text-xl" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`${
              currentPage === 1
                ? "bg-background-light text-background-medium"
                : "bg-primary-medium text-text-white"
            } px-4 py-2 rounded-md`}
          >
            Prev
          </button>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={totalPages === 0 || currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`${
              totalPages === 0 || currentPage === totalPages
                ? "bg-background-light text-background-medium"
                : "bg-primary-medium text-white"
            } px-4 py-2 rounded-md`}
          >
            Next
          </button>
        </div>
      </div>

      {showMap && selectedLocation && !selectedRescue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Rescue Location</h4>
              <FaTimes
                onClick={handleCloseMap}
                className="text-xl text-background-medium cursor-pointer"
              />
            </div>

            <div style={{ height: "400px", width: "100%" }}>
              {citizen && rescuer && (
                <Map
                  initialViewState={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    zoom: selectedLocation.zoom,
                  }}
                  mapStyle={"mapbox://styles/mapbox/streets-v12"}
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                  maxzoom={15}
                  dragRotate={false}
                  pitchWithRotate={false}
                >
                  <Marker
                    latitude={citizen?.latitude}
                    longitude={citizen?.longitude}
                  >
                    <div className="relative flex flex-col items-center justify-center">
                      <FaLocationPin className="text-3xl text-secondary red-pulse" />
                      <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                        Citizen
                      </p>
                    </div>
                  </Marker>
                  <Marker
                    latitude={rescuer?.latitude}
                    longitude={rescuer?.longitude}
                  >
                    <div className="relative flex flex-col items-center justify-center">
                      <BiSolidAmbulance className="text-3xl text-primary green-pulse" />
                      <p className="bg-background px-2 py-1 rounded-full text-text-primary text-md font-semibold">
                        Rescuer
                      </p>
                    </div>
                  </Marker>
                </Map>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedRescue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl transition-transform transform">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
              <h2 className="text-xl font-bold text-gray-700">
                Rescue Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6">
              {/* Large Image Section */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Incident
                </h3>
                <div className="flex justify-center">
                  {selectedRescue.incidentPicture ? (
                    <img
                      src={selectedRescue.incidentPicture}
                      alt="Incident"
                      className="w-full max-w-lg h-64 object-cover rounded-md border border-gray-200"
                    />
                  ) : (
                    <img
                      src={placeholder}
                      className="w-full max-w-lg h-64 object-cover rounded-md border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="col-span-2 grid grid-cols-2 gap-6">
                {/* Rescuer Info */}
                <div className="space-y-2 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-semibold text-primary-medium">
                    Rescuer
                  </h3>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {rescuerName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> {rescuerContactNumber}
                  </p>
                  <p className="text-gray-600">
                    <strong>Assigned Area:</strong> {rescuerArea}
                  </p>
                </div>

                {/* Citizen Info */}
                <div className="space-y-2 border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-semibold text-secondary">
                    Citizen
                  </h3>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {selectedRescue.citizenName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> {selectedRescue.phone}
                  </p>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {selectedRescue.location.address}
                  </p>
                </div>

                {/* Rescue Status */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Status
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className={`px-4 py-2 font-semibold rounded-md shadow-sm ${
                        selectedRescue.status === "assigned"
                          ? "bg-blue-500 text-white"
                          : selectedRescue.status === "rescued"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {selectedRescue.status.charAt(0).toUpperCase() +
                        selectedRescue.status.slice(1)}
                    </button>
                    <p className="text-gray-600">
                      {(() => {
                        const requestDate = new Date(
                          selectedRescue.status === "rescued"
                            ? selectedRescue.rescuedTimestamp
                            : selectedRescue.acceptedTimestamp
                        );
                        const now = new Date();
                        const timeElapsed = now - requestDate;
                        const minutesElapsed = Math.floor(
                          timeElapsed / (1000 * 60)
                        );
                        let timeLabel = "";

                        if (minutesElapsed < 60) {
                          timeLabel = `${minutesElapsed} minutes ago`;
                        } else if (minutesElapsed < 1440) {
                          timeLabel = `${Math.floor(
                            minutesElapsed / 60
                          )} hours ago`;
                        } else {
                          timeLabel = `${Math.floor(
                            minutesElapsed / (60 * 24)
                          )} days ago`;
                        }

                        return (
                          <>
                            <span className="text-text-secondary">
                              {timeLabel}
                            </span>
                          </>
                        );
                      })()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Description
                  </h3>
                  <div
                    className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    style={{ height: "100px", overflow: "auto" }}
                  >
                    <p>{selectedRescue.incidentDescription || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingRescues;

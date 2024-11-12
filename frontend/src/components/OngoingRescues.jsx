import { useState, useEffect } from "react";
import { FaAmbulance, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      rescuer: request.rescuerId, // Store rescuer ID
      rescuerName: rescuerNames[request.rescuerId] || "Unknown", // Get rescuer name based on ID
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

  const handleShowMap = (request) => {
    console.log(request);
    setSelectedLocation({
      latitude: request.originalRequest.location.latitude,
      longitude: request.originalRequest.location.longitude,
    });
    setShowMap(true);
  };

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

  const getRescuers = async (rescuerId) => {
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
        // Concatenate first, middle, and last names to form the full name
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

  // Function to handle report timeframe selection and set dates
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleReportSelection = (reportName) => {
    const today = new Date();
    let selectedStartDate, selectedEndDate;

    if (reportName === "Daily Report") {
      selectedStartDate = formatDate(today);
      selectedEndDate = formatDate(today);
    } else if (reportName === "Weekly Report") {
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());
      selectedStartDate = formatDate(sunday);
      selectedEndDate = formatDate(today);
    } else if (reportName === "Monthly Report") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      selectedStartDate = formatDate(startOfMonth);
      selectedEndDate = formatDate(endOfMonth);
    } else {
      // Custom date range
      selectedStartDate = formatDate(customStartDate);
      selectedEndDate = formatDate(customEndDate);
    }

    // Set state to retain the values if needed elsewhere
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);

    // Generate PDF with the selected date range
    handleGeneratePDF(selectedStartDate, selectedEndDate);
    setShowPrintModal(false);
  };

  useEffect(() => {
    if (startDate && endDate) {
      console.log(startDate, endDate);
      console.log("Ongoing Rescues", ongoingRescues);
    }
  }, [startDate, endDate]);

  const handleCloseDetails = () => {
    setSelectedRescue(null);
    setRescuerName(null);
  };

  const handleGeneratePDF = (startDate, endDate) => {
    const doc = new jsPDF("landscape");

    // Convert startDate and endDate to cover the full day range in UTC
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0); // Start of the day in UTC
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999); // End of the day in UTC

    // Filter rescues within the date range based on originalRequest.timestamp
    const filteredRescues = ongoingRescues.filter((rescue) => {
      const requestTimestamp = new Date(rescue.originalRequest.timestamp);
      return requestTimestamp >= start && requestTimestamp <= end;
    });

    doc.setFontSize(18);
    doc.text(
      "Ongoing Rescues Report",
      doc.internal.pageSize.getWidth() / 2,
      10,
      {
        align: "center",
      }
    );

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

    const tableRows = filteredRescues.map((rescue, index) => ({
      id: index + 1,
      rescuer: rescue.rescuer,
      rescuerName: rescue.rescuerName || "Unknown",
      citizenName: rescue.originalRequest.citizenName || "N/A",
      location: rescue.location,
      requestTimestamp: formatDateTime(rescue.originalRequest.timestamp),
      acceptedTimestamp: formatDateTime(rescue.acceptedTimestamp),
      rescuedTimestamp: formatDateTime(rescue.originalRequest.rescuedTimestamp),
      status: rescue.status.charAt(0).toUpperCase() + rescue.status.slice(1),
    }));

    doc.autoTable({
      head: [tableColumn.map((col) => col.title)],
      body: tableRows.map((row) => Object.values(row)),
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        lineColor: "#557C55",
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: "#557C55",
        textColor: "#FFFFFF",
        fontSize: 10,
      },
    });

    // Add footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = pageHeight - 10;

    doc.setFontSize(10);
    doc.text(
      `Generated by: ${user?.first_name} ${user?.last_name}`,
      10,
      footerY
    );
    doc.text(
      `Generated date: ${new Date().toLocaleString()}`,
      pageWidth - 70,
      footerY
    );

    doc.save(`ongoing_rescue_operations_${startDate}_to_${endDate}.pdf`);
  };

  // Helper function for formatting timestamps in the PDF
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
      {/* Modal for Print Options */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h4 className="text-xl font-bold mb-4">Select Report Time frame</h4>
            <button
              onClick={() => handleReportSelection("Daily Report")}
              className="w-full bg-primary-medium text-white p-2 rounded-lg mb-2"
            >
              Daily
            </button>
            <button
              onClick={() => handleReportSelection("Weekly Report")}
              className="w-full bg-primary-medium text-white p-2 rounded-lg mb-2"
            >
              Weekly
            </button>
            <button
              onClick={() => handleReportSelection("Monthly Report")}
              className="w-full bg-primary-medium text-white p-2 rounded-lg mb-2"
            >
              Monthly
            </button>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                Custom Date Range
              </label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={customStartDate}
                  onChange={(date) => setCustomStartDate(date)}
                  placeholderText="Start Date"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
                <DatePicker
                  selected={customEndDate}
                  onChange={(date) => setCustomEndDate(date)}
                  placeholderText="End Date"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
            </div>
            <button
              onClick={() => handleReportSelection("Custom Report")}
              className="w-full bg-primary-medium text-white p-2 rounded-lg mb-2"
              disabled={!customStartDate || !customEndDate}
            >
              Generate Custom Report
            </button>
            <button
              onClick={() => setShowPrintModal(false)}
              className="w-full bg-gray-200 text-black p-2 rounded-lg hover:opacity-80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <FaAmbulance className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Ongoing Rescue Operations
        </h4>
      </div>

      {/* Rescue Data Table */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-center">
          {/* Filter Status */}
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

          {/* Print Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="w-max bg-gray-200 text-black p-3 rounded-lg hover:opacity-80 transition flex items-center"
          >
            <AiFillPrinter className="text-base mr-1" />
            Generate PDF
          </button>
        </div>

        {/* Table for larger screens */}
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
              {paginatedRescues.map((requests, index) => (
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
                    {requests.originalRequest.citizenName
                      ? requests.originalRequest.citizenName
                      : "N/A"}
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
                            event.stopPropagation(); // Prevent row click event
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
      {/* Pagination */}
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
              <h4 className="text-xl font-bold">Rescue Location Details</h4>
              <FaTimes
                onClick={handleCloseMap}
                className="text-xl text-background-medium cursor-pointer"
              />
            </div>

            <Map
              initialViewState={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                zoom: 15,
              }}
              mapStyle={"mapbox://styles/mapbox/streets-v12"}
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              maxzoom={15}
            ></Map>

            {/* Add a map component or iframe here to show map based on location */}
            <div style={{ height: "400px", width: "100%" }}>
              {/* Render the map here, potentially using selectedLocation’s coordinates */}
            </div>
          </div>
        </div>
      )}

      {/* Rescue Details Modal */}
      {selectedRescue && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out max-w-md md:max-w-xl w-full relative">
            <button
              onClick={handleCloseDetails}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-5 text-primary border-b pb-2 md:pb-3 border-gray-300">
              Rescue Details
            </h4>

            {/* Rescuer Details Section */}
            <div className="mb-4 md:mb-6">
              <h5 className="text-md md:text-lg font-semibold mb-3 md:mb-4 text-primary-dark">
                Rescuer Information
              </h5>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Rescuer ID:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {selectedRescue.rescuerId}
                  </span>
                </div>
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Rescuer Name:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {rescuerName}
                  </span>
                </div>
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Phone Number:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {rescuerContactNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-300 mb-4 md:mb-6"></div>

            {/* Citizen Details Section */}
            <div className="mb-4 md:mb-6">
              <h5 className="text-md md:text-lg font-semibold mb-3 md:mb-4 text-primary-dark">
                Citizen Information
              </h5>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Requester Name:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {selectedRescue.citizenName}
                  </span>
                </div>
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Phone Number:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {selectedRescue.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Request Location:
                  </strong>
                  <span className="text-gray-600 font-semibold text-sm md:text-base">
                    {selectedRescue.location.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-300 mb-4 md:mb-6"></div>

            {/* Status and Timing Section */}
            <div className="mb-4 md:mb-6">
              <h5 className="text-md md:text-lg font-semibold mb-3 md:mb-4 text-primary-dark">
                Rescue Status
              </h5>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    Status:
                  </strong>
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      selectedRescue.status === "assigned"
                        ? "text-blue-500"
                        : selectedRescue.status === "rescued"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {selectedRescue.status.charAt(0).toUpperCase() +
                      selectedRescue.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                    {selectedRescue.status === "rescued"
                      ? "Rescued Time:"
                      : "Accepted Time:"}
                  </strong>
                  <span className="text-gray-600 font-semibold  text-sm md:text-base">
                    {selectedRescue.status === "rescued" &&
                    selectedRescue.rescuedTimestamp
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(new Date(selectedRescue.rescuedTimestamp))
                      : new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(new Date(selectedRescue.acceptedTimestamp))}
                  </span>
                </div>

                {selectedRescue.status === "rescued" && (
                  <div className="flex items-center">
                    <strong className="w-28 md:w-36 text-gray-700 text-sm md:text-base">
                      Rescued Location:
                    </strong>
                    <span className="text-gray-600 text-sm md:text-base">
                      {selectedRescue.rescuedAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Incident Picture Section */}
            <div className="mb-4 md:mb-6">
              <span className="w-28 md:w-36 text-primary-medium font-bold text-sm md:text-base">
                Incident Picture:
              </span>
              <div className="flex justify-center">
                {selectedRescue.incidentPicture ? (
                  <img
                    src={selectedRescue.incidentPicture}
                    alt="Incident Picture"
                    className="w-full md:max-w-[34rem] h-40 object-contain"
                  />
                ) : (
                  <span className="text-gray-600 text-sm md:text-base">
                    No picture available
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <strong className="w-28 md:w-36 text-primary-medium text-sm md:text-base">
                Description:
              </strong>
              <span className="text-gray-600 font-semibold text-sm md:text-base">
                {selectedRescue.incidentDescription}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingRescues;

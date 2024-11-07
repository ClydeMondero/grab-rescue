import { useState, useEffect } from "react";
import { FaAmbulance, FaMapMarkerAlt } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OngoingRescues = ({ requests, user }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRescue, setSelectedRescue] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    console.log("Requests:", requests);
  }, [requests]);

  const ongoingRescues = requests
    .filter((request) => {
      if (filterStatus === "all")
        return request.status === "assigned" || request.status === "rescued";
      return request.status === filterStatus;
    })
    .map((request, index) => ({
      id: index + 1,
      location: request.location.address,
      rescuer: `${request.rescuerId}`,
      status: request.status,
      acceptedTimestamp: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(request.acceptedTimestamp)),
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

  const handleShowMap = (location) => {
    setSelectedLocation(location);
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setSelectedLocation(null);
  };

  const handleRowClick = (requests) => {
    setSelectedRescue(requests);
  };

  const handleCloseDetails = () => {
    setSelectedRescue(null);
  };

  const handlePrint = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text(
      "Ongoing Rescues Report",
      doc.internal.pageSize.getWidth() / 2,
      10,
      { align: "center" }
    );

    const tableColumn = [
      { title: "#", dataKey: "id" },
      { title: "Rescuer ID", dataKey: "rescuer" },
      { title: "Location", dataKey: "location" },
      { title: "Accepted Timestamp", dataKey: "acceptedTimestamp" },
      { title: "Status", dataKey: "status" },
    ];

    const tableRows = ongoingRescues.map((rescue) => ({
      id: rescue.id,
      rescuer: rescue.rescuer,
      location: rescue.location,
      acceptedTimestamp: rescue.acceptedTimestamp,
      status: rescue.status,
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

    doc.save("ongoing_rescue_operations.pdf");
  };

  return (
    <div className="flex flex-col p-4 lg:p-6 h-full">
      {/* Header */}
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <FaAmbulance className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Ongoing Rescue Operations
        </h4>
      </div>

      <p className="text-lg font-semibold text-[#557C55] self-start">
        Monitoring the status and progress of active rescue efforts.
      </p>

      {/* Rescue Data Table */}
      <div className="flex flex-col flex-1">
        {/* Print Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={handlePrint}
            className="bg-primary-medium text-white px-4 py-2 rounded-md hover:bg-[#6EA46E] transition flex items-center text-sm"
          >
            <AiFillPrinter className="text-base mr-1" />
            Generate PDF
          </button>
        </div>

        {/* Filter Status */}
        <div className="mb-4">
          <label
            htmlFor="status-filter"
            className="mr-2 font-semibold text-gray-700"
          >
            Filter by status:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned</option>
            <option value="rescued">Rescued</option>
          </select>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden grid gap-4 sm:grid-cols-2">
          {paginatedRescues.map((rescue, index) => (
            <div
              onClick={() => handleRowClick(rescue)}
              key={rescue.id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white "
            >
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Rescuer ID:
                </span>{" "}
                <span className="text-sm">{rescue.rescuer}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Location:
                </span>{" "}
                <span className="text-sm">{rescue.location}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Accepted Timestamp:
                </span>{" "}
                <span className="text-sm">{rescue.acceptedTimestamp}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Status:
                </span>{" "}
                <span
                  className={`text-sm font-bold ${
                    rescue.status === "assigned" ? "text-info" : "text-primary"
                  }`}
                >
                  {rescue.status.charAt(0).toUpperCase() +
                    rescue.status.slice(1)}
                </span>
              </div>

              {/* Conditionally Render Map Button */}
              {rescue.status === "assigned" && (
                <div className="flex justify-center">
                  <button
                    onClick={() => handleShowMap(rescue.location)}
                    className="bg-secondary text-white px-4 py-1 rounded-full hover:bg-primary-medium transition flex items-center justify-center"
                  >
                    <FaMapMarkerAlt className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Table for larger screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-gray-200 border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-[#557C55] text-white">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium">#</th>
                <th className="px-4 py-2 text-center text-xs font-medium">
                  Rescuer ID
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
                  onClick={() => handleRowClick(requests)}
                  className={index % 2 === 0 ? "bg-white " : "bg-gray-100"}
                >
                  <td className="px-4 py-2 text-center text-sm text-info font-semibold">
                    {requests.id}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.rescuer}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.location}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {requests.acceptedTimestamp}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`font-semibold ${
                        requests.status === "assigned"
                          ? "text-info"
                          : "text-primary"
                      }`}
                    >
                      {requests.status.charAt(0).toUpperCase() +
                        requests.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {requests.status === "assigned" && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleShowMap(requests.location)}
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

        {/* Pagination */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`${
                currentPage === 1
                  ? "bg-gray-300"
                  : "bg-primary-medium text-white"
              } px-4 py-2 rounded-md`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-primary-medium text-white"
              } px-4 py-2 rounded-md`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h4 className="text-xl font-bold mb-4">Map Location</h4>
            <div style={{ height: "400px", width: "100%" }}>
              <p>{selectedLocation}</p>
            </div>
            <button
              onClick={handleCloseMap}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* Rescue Details Modal */}
      {selectedRescue && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out max-w-2xl w-full">
            <h4 className="text-xl font-bold mb-5 text-primary-dark border-b pb-2 border-gray-300">
              Rescue Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Location:</strong>
                <span className="text-gray-600">{selectedRescue.location}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Rescuer ID:</strong>
                <span className="text-gray-600">{selectedRescue.rescuer}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Phone Number:</strong>
                <span className="text-gray-600">{selectedRescue.phone}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Name:</strong>
                <span className="text-gray-600">{selectedRescue.age}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Status:</strong>
                <span
                  className={`font-semibold text-sm ${
                    selectedRescue.status === "assigned"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span
                    className={`font-semibold text-sm ${
                      selectedRescue.status === "assigned"
                        ? "text-info"
                        : selectedRescue.status === "rescued"
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  >
                    {selectedRescue.status.charAt(0).toUpperCase() +
                      selectedRescue.status.slice(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">
                  {selectedRescue.status === "rescued"
                    ? "Rescued Time"
                    : "Accepted Time"}
                </strong>
                <span className="text-gray-600">
                  {selectedRescue.status === "rescued"
                    ? selectedRescue.acceptedTimestamp
                    : selectedRescue.acceptedTimestamp}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-5 py-2 bg-secondary text-white rounded-md hover:bg-red-700 shadow-sm transition-transform transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingRescues;

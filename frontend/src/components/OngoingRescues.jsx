import { useState } from "react";
import { FaAmbulance } from "react-icons/fa";

const OngoingRescues = ({ requests }) => {
  const ongoingRescues = requests
    .filter((request) => request.status === "assigned")
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
      estimatedArrivalTime: "TBD",
      estimatedDepartureTime: "TBD",
    }));

  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Paginate data
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

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const visiblePages =
    pageNumbers.length <= 5
      ? pageNumbers
      : pageNumbers.slice(
          Math.max(0, currentPage - 2),
          Math.min(totalPages, currentPage + 2)
        );

  const handleShowMap = (location) => {
    setShowMap(location);
  };

  return (
    <div className="flex-1 p-2 sm:p-3 lg:p-4 h-full  flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6 pb-2 sm:pb-4  border-b border-gray-200">
        <FaAmbulance className="text-xl sm:text-3xl text-[#557C55] mr-2 sm:mr-3" />
        <h4 className="text-lg sm:text-2xl font-semibold text-[#557C55]">
          Ongoing Rescue Operations
        </h4>
      </div>

      <p className="mb-4 text-sm sm:text-md text-gray-600">
        Monitoring the status and progress of active rescue efforts.
      </p>

      {/* Map Toggle */}
      {showMap && (
        <div className="mb-4 sm:mb-6">
          <h5 className="text-lg sm:text-2xl font-semibold mb-2 text-primary">
            <p className="text-secondary">Location Map:</p>
            {showMap}
          </h5>
          <div
            className="map-placeholder bg-[#eaeaea] rounded-lg"
            style={{ height: "200px" }}
          >
            <p className="text-center pt-4 text-sm sm:text-base">
              Map displaying location: {showMap}
            </p>
          </div>
          <button
            className="bg-[#FA7070] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md mt-2 hover:bg-[#ff4444] transition text-xs sm:text-sm"
            onClick={() => setShowMap(false)}
          >
            Hide Map
          </button>
        </div>
      )}

      {/* Rescue Data Table */}
      <div className=" rounded-lg p-2 sm:p-4 flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm rounded-lg border border-primary-medium">
            <thead className="bg-primary-medium">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium text-warning border border-gray-300">
                  #
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  RID
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  Location
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  Accepted Timestamp
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  Distance
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  ETA
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  Status
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-white border border-gray-300">
                  Map
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRescues.map((rescue, index) => (
                <tr
                  key={rescue.id}
                  className={`border-b text-center ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border border-gray-300`}
                >
                  <td className="px-2 sm:px-4 py-1 sm:py-2 text-secondary font-semibold border border-gray-300">
                    {rescue.id}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-primary-dark border border-gray-300">
                    {rescue.rescuer}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-primary-medium border border-gray-300">
                    {rescue.location}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-primary-dark border border-gray-300">
                    {rescue.acceptedTimestamp}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-primary-dark border border-gray-300">
                    {rescue.estimatedArrivalTime}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-primary-dark border border-gray-300">
                    {rescue.estimatedDepartureTime}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-1 sm:py-2 font-semibold ${
                      rescue.status === "In Progress"
                        ? "text-secondary"
                        : "text-info"
                    } border border-gray-300`}
                  >
                    {rescue.status}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300">
                    <button
                      className="bg-primary text-white px-2 sm:px-3 py-1 sm:py-1 rounded-md text-xs sm:text-sm hover:bg-info transition"
                      onClick={() => handleShowMap(rescue.location)}
                    >
                      Show Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col items-center justify-between p-2 bg-gray-100 sm:flex-row">
          {currentPage > 1 && (
            <button
              className="w-full mb-1 px-2 py-1 text-xs bg-[#557C55] text-white rounded-md hover:bg-[#4a6b4a] sm:w-auto sm:mb-0"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt; Previous
            </button>
          )}
          <div className="flex flex-wrap items-center justify-center space-x-1 mt-1 sm:mt-0">
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`px-2 py-1 text-xs border rounded-md ${
                  currentPage === pageNumber
                    ? "bg-secondary text-white"
                    : "bg-primary-medium text-white border-primary-medium"
                } hover:bg-primary`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          {currentPage < totalPages && (
            <button
              className="w-full mt-1 px-2 py-1 text-xs bg-primary-medium text-white rounded-md hover:bg-primary sm:w-auto sm:mt-0"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OngoingRescues;

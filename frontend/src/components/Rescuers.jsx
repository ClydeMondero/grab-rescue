import { useState } from "react";
import { MdAssignmentInd } from "react-icons/md";

const AssignRescuers = () => {
  const [rescuer] = useState([
    {
      id: 1,
      name: "John Doe",
      location: "San Rafael, Bulacan",
      status: "Available",
      barangay: "Barangay San Isidro",
      contactNumber: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      location: "Bustos, Bulacan",
      status: "Available",
      barangay: "Barangay Bignay",
      contactNumber: "234-567-8901",
    },
    {
      id: 4,
      name: "Sarah Connor",
      location: "Angat, Bulacan",
      status: "Available",
      barangay: "Barangay Cawayan",
      contactNumber: "345-678-9012",
    },
    {
      id: 5,
      name: "Tom Harris",
      location: "San Ildefonso, Bulacan",
      status: "Unavailable",
      barangay: "Barangay Poblacion",
      contactNumber: "456-789-0123",
    },
    {
      id: 6,
      name: "Linda Johnson",
      location: "Baliuag, Bulacan",
      status: "Available",
      barangay: "Barangay Tarangnan",
      contactNumber: "567-890-1234",
    },
    {
      id: 7,
      name: "Peter Brown",
      location: "Plaridel, Bulacan",
      status: "Available",
      barangay: "Barangay Banga 1st",
      contactNumber: "678-901-2345",
    },
    {
      id: 8,
      name: "Karen Davis",
      location: "Pulilan, Bulacan",
      status: "Available",
      barangay: "Barangay Dampol 2nd",
      contactNumber: "789-012-3456",
    },
    {
      id: 9,
      name: "David Lee",
      location: "Calumpit, Bulacan",
      status: "Available",
      barangay: "Barangay Meysulao",
      contactNumber: "890-123-4567",
    },
    {
      id: 10,
      name: "Emily Chen",
      location: "Hagonoy, Bulacan",
      status: "Available",
      barangay: "Barangay San Agustin",
      contactNumber: "901-234-5678",
    },
  ]);

  const [requests] = useState([
    {
      id: 1,
      location: "San Rafael, Bulacan",
      time: "08:30 AM",
      status: "Pending",
      type: "Medical Emergency",
    },
    {
      id: 2,
      location: "Bustos, Bulacan",
      time: "09:00 AM",
      status: "Pending",
      type: "Flooding",
    },
    {
      id: 3,
      location: "Baliuag, Bulacan",
      time: "09:30 AM",
      status: "In Progress",
      type: "Fire",
    },
    {
      id: 4,
      location: "San Ildefonso, Bulacan",
      time: "10:00 AM",
      status: "Pending",
      type: "Traffic Accident",
    },
    {
      id: 5,
      location: "Angat, Bulacan",
      time: "10:15 AM",
      status: "Completed",
      type: "Earthquake",
    },
    {
      id: 6,
      location: "Pandi, Bulacan",
      time: "10:30 AM",
      status: "Pending",
      type: "Fire",
    },
    {
      id: 7,
      location: "Bulakan, Bulacan",
      time: "10:45 AM",
      status: "In Progress",
      type: "Medical Emergency",
    },
    {
      id: 8,
      location: "Obando, Bulacan",
      time: "11:00 AM",
      status: "Pending",
      type: "Traffic Accident",
    },
    {
      id: 9,
      location: "Marilao, Bulacan",
      time: "11:15 AM",
      status: "Completed",
      type: "Flooding",
    },
    {
      id: 10,
      location: "Meycauayan, Bulacan",
      time: "11:30 AM",
      status: "In Progress",
      type: "Earthquake",
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Filter rescuers based on the selected location
  const filteredRescuers =
    selectedLocation === "All"
      ? rescuer
      : rescuer.filter((r) => r.location.includes(selectedLocation));

  // Paginate data
  const totalRows = filteredRescuers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRescuers = filteredRescuers.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Determine which page numbers to show
  const visiblePages =
    pageNumbers.length <= 5
      ? pageNumbers
      : pageNumbers.slice(
          Math.max(0, currentPage - 2),
          Math.min(totalPages, currentPage + 2)
        );

  return (
    <div className="flex flex-col h-100 w-full bg-gray-50">
      <header className="p-2 sm:p-3 lg:p-4 flex items-center">
        <MdAssignmentInd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-md sm:text-lg font-semibold text-[#557C55]">
          Assign Rescuers
        </h4>
      </header>

      <p className="px-2 mb-1 text-xs sm:text-sm text-gray-600">
        Filter and assign rescuers to the following requests:
      </p>

      <div className="flex-1 bg-white p-2 sm:p-3 flex flex-col">
        <div className="mb-1 px-2">
          <label
            htmlFor="locationFilter"
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            Filter by Location:
          </label>
          <select
            id="locationFilter"
            className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="San Rafael, Bulacan">San Rafael, Bulacan</option>
            <option value="Bustos, Bulacan">Bustos, Bulacan</option>
            <option value="Baliuag, Bulacan">Baliuag, Bulacan</option>
            <option value="Angat, Bulacan">Angat, Bulacan</option>
            <option value="San Ildefonso, Bulacan">
              San Ildefonso, Bulacan
            </option>
          </select>
        </div>

        <p className="px-2 mb-1 text-xs sm:text-sm font-semibold text-gray-700">
          List of available rescuers:
        </p>

        <div className="flex-1">
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
              <thead className="bg-[#557C55] text-white text-left">
                <tr>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">#</th>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">Name</th>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">Location</th>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">Barangay Name</th>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">
                    Contact Number
                  </th>
                  <th className="px-1 py-0.5 sm:px-4 sm:py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRescuers.map((rescue, index) => (
                  <tr
                    key={rescue.id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-1 py-0.5 sm:px-4 sm:py-2">{rescue.id}</td>
                    <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                      {rescue.name}
                    </td>
                    <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                      {rescue.location}
                    </td>
                    <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                      {rescue.barangay}
                    </td>
                    <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                      {rescue.contactNumber}
                    </td>
                    <td
                      className={`px-1 py-0.5 sm:px-4 sm:py-2 font-semibold ${
                        rescue.status === "Available"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {rescue.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-1 px-2 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } text-xs sm:text-sm`}
          >
            Previous
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-2 py-1 rounded-lg ${
                currentPage === page
                  ? "bg-[#557C55] text-white"
                  : "bg-gray-200 text-gray-800"
              } text-xs sm:text-sm`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 px-2 py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } text-xs sm:text-sm`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRescuers;

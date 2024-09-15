import { useState, useEffect } from "react";
import { MdAssignmentInd } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { createAuthHeader } from "../services/authServices";
import axios from "axios";

const AssignRescuers = () => {
  const [rescuers, setRescuers] = useState([]);
  const [filteredRescuers, setFilteredRescuers] = useState([]);
  const [paginatedRescuers, setPaginatedRescuers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("All");
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const rowsPerPage = 2;

  const barangaysData = {
    "San Rafael": [
      "Banca-Banca",
      "BMA – Balagtas",
      "Caingin",
      "Capihan",
      "Coral na Bato",
      "Cruz na Daan",
      "Dagat-Dagatan",
      "Diliman I",
      "Diliman II",
      "Lico",
      "Libis",
      "Maasim",
      "Mabalas-Balas",
      "Maguinao",
      "Maronquillo",
      "Paco",
      "Pansumaloc",
      "Pantubig",
      "Pasong Bangkal",
      "Pasong Callos",
      "Pasong Intsik",
      "Pinacpinacan",
      "Poblacion",
      "Pulo",
      "Pulong Bayabas",
      "Salapungan",
      "Sampaloc",
      "San Agustin",
      "San Roque",
      "Sapang Pahalang",
      "Talacsan",
      "Tambubong",
      "Tukod",
      "Ulingao",
    ],
    Bustos: [
      "Bonga Mayor",
      "Bonga Menor",
      "Buisan",
      "Camachilihan",
      "Cambaog",
      "Catacte",
      "Liciada",
      "Malamig",
      "Malawak",
      "Poblacion",
      "San Pedro",
      "Talampas",
      "Tanawan",
      "Tibagan",
    ],
  };

  useEffect(() => {
    // Filter rescuers based on search query and selected filters
    const filtered = rescuers.filter((rescue) => {
      const fullName =
        `${rescue.first_name} ${rescue.middle_initial} ${rescue.last_name}`.toLowerCase();
      const matchesName = fullName.includes(searchName.toLowerCase());
      const matchesMunicipality =
        selectedMunicipality === "All" ||
        rescue.municipality === selectedMunicipality;
      const matchesBarangay =
        selectedBarangay === "All" || rescue.barangay === selectedBarangay;
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Online" && rescue.is_online) ||
        (selectedStatus === "Offline" && !rescue.is_online);

      return (
        matchesName && matchesMunicipality && matchesBarangay && matchesStatus
      );
    });
    setFilteredRescuers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    searchName,
    selectedMunicipality,
    selectedBarangay,
    selectedStatus,
    rescuers,
  ]);

  useEffect(() => {
    // Update barangays based on selected municipality
    if (selectedMunicipality === "All") {
      setBarangays([]); // Clear barangays if "All" is selected
      setSelectedBarangay("All"); // Reset selected barangay
    } else {
      setBarangays(barangaysData[selectedMunicipality] || []);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const result = await axios.get("/rescuers/get", createAuthHeader());
        setRescuers(result.data);
        setFilteredRescuers(result.data); // Initialize filteredRescuers
        console.log(result); // Assuming you might filter rescuers here
      } catch (error) {
        console.error("Error fetching rescuers:", error);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    // Filter rescuers based on search query
    const filtered = rescuers.filter((rescue) =>
      `${rescue.first_name} ${rescue.middle_initial} ${rescue.last_name}`
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
    setFilteredRescuers(filtered);
    setCurrentPage(1);
  }, [searchName, rescuers]);

  useEffect(() => {
    const totalRows = filteredRescuers.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedRescuers(filteredRescuers.slice(startIndex, endIndex));
  }, [filteredRescuers, currentPage]);

  const handlePageChange = (newPage) => {
    const totalRows = filteredRescuers.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalRows = filteredRescuers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

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

  return (
    <div className="flex flex-col h-100 w-full bg-gray-50">
      <header className="p-2 sm:p-3 lg:p-4 flex items-center">
        <MdAssignmentInd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-md sm:text-lg font-semibold text-[#557C55]">
          Assign Rescuers
        </h4>
      </header>

      <p className="px-2 mb-1 text-xs sm:text-sm text-gray-600">
        Search and assign rescuers to the following requests:
      </p>
      {/* Search bar for rescuer names */}
      <div className="mb-2 px-2">
        <label
          htmlFor="searchName"
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          Search Rescuer by Name:
        </label>
        <input
          id="searchName"
          type="text"
          className="form-input w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
          placeholder="Enter rescuer's name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      {/* Dropdown for Municipality */}
      <div className="mb-2 px-2">
        <label
          htmlFor="municipalityFilter"
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          Filter by Municipality:
        </label>
        <select
          id="municipalityFilter"
          className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
        >
          <option value="All">All</option>
          <option value="San Rafael">San Rafael</option>
          <option value="Bustos">Bustos</option>
        </select>
      </div>

      {/* Dropdown for Barangay */}
      <div className="mb-2 px-2">
        <label
          htmlFor="barangayFilter"
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          Filter by Barangay:
        </label>
        <select
          id="barangayFilter"
          className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
        >
          <option value="All">All</option>
          {barangays.map((barangay) => (
            <option key={barangay} value={barangay}>
              {barangay}
            </option>
          ))}
        </select>
      </div>
      {/* Dropdown for Status */}
      <div className="mb-2 px-2">
        <label
          htmlFor="statusFilter"
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <table className="w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
        <thead className="bg-[#557C55] text-white text-left">
          <tr>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">#</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Name</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Municipality</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Barangay Name</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Contact Number</th>
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
                {rescue.first_name +
                  " " +
                  rescue.middle_initial +
                  " " +
                  rescue.last_name}
              </td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                {rescue.municipality}
              </td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">{rescue.barangay}</td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                {rescue.contact_number}
              </td>
              <td
                className={`px-1 py-0.5 sm:px-4 sm:py-2 ${
                  rescue.is_online ? "text-[#557C55]" : "text-[#FA7070]"
                }`}
              >
                {rescue.is_online ? (
                  <div className="flex items-center">
                    <FaCircle className="text-[#557C55] mr-2" />{" "}
                    {/* Green circle for online */}
                    <span>Online</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaCircle className="text-[#FA7070] mr-2" />{" "}
                    {/* Red circle for offline */}
                    <span>Offline</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded ${
                page === currentPage ? "bg-[#557C55] text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssignRescuers;

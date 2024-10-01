import { useState, useEffect } from "react";
import { MdAssignmentInd } from "react-icons/md";
import { FaCircle, FaPencilAlt, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { createAuthHeader } from "../services/authService";
import axios from "axios";
import { barangaysData } from "../constants/Barangays";


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
  const [selectedVerified, setSelectedVerified] = useState("All");
  

  const rowsPerPage = 10;

 

  useEffect(() => {
    const initializePage = async () => {
      try {
        const result = await axios.get("/rescuers/get", createAuthHeader());
        setRescuers(result.data);
        setFilteredRescuers(result.data);
      } catch (error) {
        console.error("Error fetching rescuers:", error);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    // Update barangays based on selected municipality
    if (selectedMunicipality === "All") {
      setBarangays([]);
      setSelectedBarangay("All");
    } else {
      setBarangays(barangaysData[selectedMunicipality] || []);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    // Filter rescuers based on search query and selected filters
    const filtered = rescuers.filter((rescue) => {
      const fullName = `${rescue.first_name} ${rescue.middle_initial} ${rescue.last_name}`.toLowerCase();
      const matchesName = fullName.includes(searchName.toLowerCase());
      const matchesMunicipality =
        selectedMunicipality === "All" || rescue.municipality === selectedMunicipality;
      const matchesBarangay =
        selectedBarangay === "All" || rescue.barangay === selectedBarangay;
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Online" && rescue.is_online) ||
        (selectedStatus === "Offline" && !rescue.is_online);
      const matchesVerified =
        selectedVerified === "All" ||
        (selectedVerified === "True" && rescue.verified) ||
        (selectedVerified === "False" && !rescue.verified);
      return matchesName && matchesMunicipality && matchesBarangay && matchesStatus && matchesVerified;
    });
    setFilteredRescuers(filtered);
    setCurrentPage(1);
  }, [searchName, selectedMunicipality, selectedBarangay, selectedStatus, selectedVerified, rescuers]);

  useEffect(() => {
    const totalRows = filteredRescuers.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedRescuers(filteredRescuers.slice(startIndex, endIndex));
  }, [filteredRescuers, currentPage]);

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(filteredRescuers.length / rowsPerPage);
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
    <div className="flex flex-col h-full w-full bg-gray-50">
      <header className="p-2 sm:p-3 lg:p-4 flex items-center">
        <MdAssignmentInd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-md sm:text-lg font-semibold text-[#557C55]">
          Rescuers
        </h4>
      </header>

      <p className="px-2 mb-1 text-xs sm:text-sm text-gray-600">
        Search and assign rescuers to the following requests:
      </p>

      {/* Search bar and filters */}
      <div className="mb-2 px-2">
        <label htmlFor="searchName" className="block text-xs sm:text-sm font-medium text-gray-700">
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

      {/* Dropdowns for filters */}
      <FilterDropdown label="Filter by Municipality:" options={["All", "San Rafael", "Bustos"]} selected={selectedMunicipality} setSelected={setSelectedMunicipality} />
      <FilterDropdown label="Filter by Barangay:" options={["All", ...barangays]} selected={selectedBarangay} setSelected={setSelectedBarangay} />
      <FilterDropdown label="Filter by Status:" options={["All", "Online", "Offline"]} selected={selectedStatus} setSelected={setSelectedStatus} />
      <FilterDropdown label="Filter by Verified:" options={["All", "True", "False"]} selected={selectedVerified} setSelected={setSelectedVerified} />

      {/* Rescuers Table */}
      <table className="w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
        <thead className="bg-[#557C55] text-white text-left">
          <tr>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">#</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Name</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Municipality</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Barangay Name</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Contact Number</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Status</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Verified Email</th>
            <th className="px-1 py-0.5 sm:px-4 sm:py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRescuers.map((rescue, index) => (
            <tr
              key={rescue.id}
              className={`border-b text-black ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                {`${rescue.first_name} ${rescue.middle_initial} ${rescue.last_name}`}
              </td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">{rescue.municipality}</td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">{rescue.barangay}</td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">{rescue.contact_number}</td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">
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
              <td className="px-1 py-0.5 sm:px-4 sm:py-2">
                {rescue.verified ? (
                  <div className="flex items-center space-x-1">
                  <FaCheckCircle className="text-green-500" />
                  <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                  <FaTimesCircle className="text-red-500" />
                  <span>Not Verified</span>
                  </div>
                )}
              </td>
              <td className="px-1 py-0.5 sm:px-4 sm:py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(rescue.id)}
                  className="text-blue-500 hover:text-blue-700">
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => handleDelete(rescue.id)}
                  className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div>
          <span className="text-xs sm:text-sm">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows} entries
          </span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 rounded-md text-xs sm:text-sm">Previous</button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 rounded-md text-xs sm:text-sm ${currentPage === page ? 'bg-[#557C55] text-white' : 'bg-gray-200'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded-md text-xs sm:text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

// FilterDropdown Component
const FilterDropdown = ({ label, options, selected, setSelected }) => (
  <div className="mb-2 px-2">
    <label className="block text-xs sm:text-sm font-medium text-gray-700">{label}</label>
    <select
      className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default AssignRescuers;

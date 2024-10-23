import { useState, useEffect } from "react";
import { MdAssignmentInd } from "react-icons/md";
import { FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import { createAuthHeader } from "../services/authService";
import axios from "axios";
import { barangaysData } from "../constants/Barangays";
import jsPDF from "jspdf";

const AssignRescuers = (props) => {
  const { user } = props;
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
    if (selectedMunicipality === "All") {
      setBarangays([]);
      setSelectedBarangay("All");
    } else {
      setBarangays(barangaysData[selectedMunicipality] || []);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
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
      const matchesVerified =
        selectedVerified === "All" ||
        (selectedVerified === "True" && rescue.verified) ||
        (selectedVerified === "False" && !rescue.verified);
      return (
        matchesName &&
        matchesMunicipality &&
        matchesBarangay &&
        matchesStatus &&
        matchesVerified
      );
    });
    setFilteredRescuers(filtered);
    setCurrentPage(1);
  }, [
    searchName,
    selectedMunicipality,
    selectedBarangay,
    selectedStatus,
    selectedVerified,
    rescuers,
  ]);

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

  // Function to handle PDF generation
  const handlePrint = () => {
    const doc = new jsPDF("landscape");

    // Title
    doc.setFontSize(18);
    doc.text("Rescuers List", 14, 10);

    // Table column definition
    const tableColumn = [
      { title: "#", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Municipality", dataKey: "municipality" },
      { title: "Barangay Name", dataKey: "barangay" },
      { title: "Contact Number", dataKey: "contact_number" },
      { title: "Status", dataKey: "status" },
      { title: "Verified Email", dataKey: "verified" },
    ];

    const tableRows = [];

    // Populate table rows
    paginatedRescuers.forEach((rescue, index) => {
      const rescueData = {
        id: (currentPage - 1) * rowsPerPage + index + 1,
        name: `${rescue.first_name} ${rescue.middle_initial || ""} ${
          rescue.last_name
        }`,
        municipality: rescue.municipality,
        barangay: rescue.barangay,
        contact_number: rescue.contact_number,
        status: rescue.is_online ? "Online" : "Offline",
        verified: rescue.verified ? "Verified" : "Not Verified",
      };
      tableRows.push(rescueData);
    });

    // Table styling to match GenerateReports
    doc.autoTable(tableColumn, tableRows, {
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: "linebreak",
        halign: "left",
        valign: "middle",
        lineColor: "#557C55",
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: "#557C55",
        textColor: "#FFFFFF",
        fontSize: 10,
      },
      bodyStyles: {
        textColor: "#000000",
        fontSize: 10,
      },
    });

    // Add footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = pageHeight - 10; // Position 10 units from the bottom

    doc.setFontSize(10);
    // "Generated by" on the left side
    doc.text(
      `Generated by: ${user?.first_name} ${user?.last_name}`,
      10,
      footerY
    );
    // "Generated date" on the right side
    doc.text(
      `Generated date: ${new Date().toLocaleString()}`,
      pageWidth - 70, // Adjust based on the text width to align right
      footerY
    );

    // Save the PDF
    doc.save("rescuers_list.pdf");
  };


  // Function to handle deleting a rescuer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/rescuers/${id}`, createAuthHeader());
      setRescuers(rescuers.filter((rescue) => rescue.id !== id));
    } catch (error) {
      console.error("Error deleting rescuer:", error);
    }
  };

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
        <label
          htmlFor="searchName"
          className="block text-xs sm:text-sm font-medium text-gray-700"
        >
          <span style={{ color: "#557C55" }}>Search Rescuer by Name:</span>
        </label>
        <input
          id="searchName"
          type="text"
          className="form-input w-full border border-[#557C55] text-black rounded-lg p-2 mt-1 bg-gray-50 text-xs sm:text-sm"
          placeholder="Enter rescuer's name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      {/* Dropdowns for filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FilterDropdown
          label={
            <span style={{ color: "#557C55" }}>Filter by Municipality:</span>
          }
          options={["All", "San Rafael", "Bustos"]}
          selected={selectedMunicipality}
          setSelected={setSelectedMunicipality}
          labelStyle="text-[#557C55]"
          borderStyle="border-[#557C55]"
        />
        <FilterDropdown
          label={<span style={{ color: "#557C55" }}>Filter by Barangay:</span>}
          options={["All", ...barangays]}
          selected={selectedBarangay}
          setSelected={setSelectedBarangay}
          labelStyle="text-[#557C55]"
          borderStyle="border-[#557C55]"
        />
        <FilterDropdown
          label={<span style={{ color: "#557C55" }}>Filter by Status:</span>}
          options={["All", "Online", "Offline"]}
          selected={selectedStatus}
          setSelected={setSelectedStatus}
          labelStyle="text-[#557C55]"
          borderStyle="border-[#557C55]"
        />
        <FilterDropdown
          label={<span style={{ color: "#557C55" }}>Filter by Verified:</span>}
          options={["All", "True", "False"]}
          selected={selectedVerified}
          setSelected={setSelectedVerified}
          labelStyle="text-[#557C55]"
          borderStyle="border-[#557C55]"
        />
      </div>

      {/* Rescuers table */}
      <div className="flex-grow overflow-x-auto">
        <button
          onClick={handlePrint}
          className="bg-primary-medium text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs hover:bg-[#6EA46E] transition mt-2 sm:mt-0 flex items-center"
        >
          <AiOutlinePrinter className="text-sm" />
          Generate
        </button>
        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-[#557C55] text-white">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Municipality
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Barangay Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Contact Number
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Verified Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRescuers.map((rescue, index) => (
              <tr key={rescue.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-xs text-secondary">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-4 py-2 text-xs">
                  {`${rescue.first_name} ${rescue.middle_initial} ${rescue.last_name}`}
                </td>
                <td className="px-4 py-2 text-xs">{rescue.municipality}</td>
                <td className="px-4 py-2 text-xs">{rescue.barangay}</td>
                <td className="px-4 py-2 text-xs">{rescue.contact_number}</td>
                <td className="px-4 py-2 text-xs">
                  {rescue.is_online ? (
                    <span className="flex items-center text-primary">
                      <FaCheckCircle className="mr-1" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center text-secondary">
                      <FaTimesCircle className="mr-1" />
                      Offline
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  {rescue.verified ? (
                    <span className="text-primary">Verified</span>
                  ) : (
                    <span className="text-secondary">Not Verified</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">
                  <button
                    onClick={() => handleDelete(rescue.id)}
                    className="text-secondary hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-2 px-2">
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md"
          >
            Previous
          </button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border border-gray-300 text-gray-600 rounded-md ${
                currentPage === page ? "bg-gray-300" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Dropdown Filter Component
const FilterDropdown = ({
  label,
  options,
  selected,
  setSelected,
  labelStyle,
  borderStyle,
}) => {
  return (
    <div>
      <label className={`block text-xs sm:text-sm font-medium ${labelStyle}`}>
        {label}
      </label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className={`form-select w-full border ${borderStyle} text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AssignRescuers;

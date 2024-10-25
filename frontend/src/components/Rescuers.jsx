import { useState, useEffect } from "react";
import { MdAssignmentInd } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
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
        if (Array.isArray(result.data)) {
          setRescuers(result.data);
          setFilteredRescuers(result.data);
        } else {
          console.error("Unexpected response format:", result.data);
        }
      } catch (error) {
        console.error("Error fetching rescuers:", error);
      }
    };

    initializePage();
  }, []);

  const handleMunicipalityChange = (e) => {
    const municipality = e.target.value;
    setSelectedMunicipality(municipality);

    if (municipality === "All") {
      setBarangays([]);
      setSelectedBarangay("All");
    } else {
      const barangaysList = barangaysData[municipality] || [];
      setBarangays(barangaysList);
      setSelectedBarangay("All");
    }
  };

  useEffect(() => {
    const filtered = (rescuers || []).filter((rescue) => {
      const fullName = `${rescue.first_name} ${rescue.middle_initial || ""} ${
        rescue.last_name
      }`.toLowerCase();
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
    const totalRows = filteredRescuers.length || 0;
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

  const handlePrint = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Rescuers List", 14, 10);

    const tableColumn = [
      { title: "#", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Municipality", dataKey: "municipality" },
      { title: "Barangay Name", dataKey: "barangay" },
      { title: "Contact Number", dataKey: "contact_number" },
      { title: "Status", dataKey: "status" },
      { title: "Verified Email", dataKey: "verified" },
    ];

    const tableRows = paginatedRescuers.map((rescue, index) => ({
      id: (currentPage - 1) * rowsPerPage + index + 1,
      name: `${rescue.first_name} ${rescue.middle_initial || ""} ${
        rescue.last_name
      }`,
      municipality: rescue.municipality,
      barangay: rescue.barangay,
      contact_number: rescue.contact_number,
      status: rescue.is_online ? "Online" : "Offline",
      verified: rescue.verified ? "Verified" : "Not Verified",
    }));

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

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = pageHeight - 10;

    doc.setFontSize(10);
    doc.text("Generated by Rescuers Management System", 14, footerY);
    const date = new Date().toLocaleString();
    doc.text(date, pageWidth - 14 - doc.getTextWidth(date), footerY);

    doc.save("rescuers_list.pdf");
  };

  return (
    <div>
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <MdAssignmentInd className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-md sm:text-xl lg:text-2xl font-semibold text-[#557C55]">
          Rescuers
        </h4>
      </div>

      {/* Search, Filter, and Print Controls */}
      <div className="mb-4 flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-2 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-primary rounded px-2 py-1 w-full md:w-1/3"
          />
          <select
            value={selectedMunicipality}
            onChange={handleMunicipalityChange}
            className="border border-primary rounded px-2 py-1 w-full md:w-1/3 text-primary-medium"
          >
            <option value="All">All Municipalities</option>
            {Object.keys(barangaysData).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="border border-primary rounded px-2 py-1 w-full md:w-1/3 text-primary-medium"
          >
            <option value="All">All Barangays</option>
            {barangays.map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-primary rounded px-2 py-1 w-full md:w-1/3 text-primary-medium"
          >
            <option value="All">All Status</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <select
            value={selectedVerified}
            onChange={(e) => setSelectedVerified(e.target.value)}
            className="border border-primary rounded px-2 py-1 w-full md:w-1/3 text-primary-medium"
          >
            <option value="All">All Verification Status</option>
            <option value="True">Verified</option>
            <option value="False">Not Verified</option>
          </select>
        </div>
        <button
          onClick={handlePrint}
          className="bg-[#557C55] text-white rounded px-3 py-1 flex items-center justify-center mt-2 md:mt-0"
        >
          <AiOutlinePrinter className="mr-1" />
          Generate PDF
        </button>
      </div>

      {/* Rescuers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
          <thead className=" text-white">
            <tr className="bg-[#557C55] text-left">
              <th className="px-4 py-2 text-center text-xs font-medium">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Name
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Municipality
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Barangay
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Contact Number
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Status
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Verified
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRescuers.map((rescue, index) => (
              <tr key={rescue.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-xs text-center text-secondary">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-4 py-2 text-xs text-center">{`${
                  rescue.first_name
                } ${rescue.middle_initial || ""} ${rescue.last_name}`}</td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.municipality}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.barangay}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.contact_number}
                </td>
                <td
                  className={`px-4 py-2 text-xs text-center ${
                    rescue.is_online ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rescue.is_online ? "Online" : "Offline"}
                </td>
                <td
                  className={`px-4 py-2 text-xs text-center ${
                    rescue.verified ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rescue.verified ? "Verified" : "Not Verified"}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(rescue.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-primary-medium px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-primary">{`${currentPage} of ${Math.ceil(
          filteredRescuers.length / rowsPerPage
        )}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredRescuers.length / rowsPerPage)
          }
          className="bg-primary-medium px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssignRescuers;

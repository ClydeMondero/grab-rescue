import { useState, useEffect } from "react";
import { MdAssignmentInd } from "react-icons/md";
import { FaCircle, FaSearch } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import { createAuthHeader } from "../services/authService";
import axios from "axios";
import { barangaysData } from "../constants/Barangays";
import jsPDF from "jspdf";
import { useNotifications } from "./NotificationContext";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRescuerId, setSelectedRescuerId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("All");
  const { addNotification } = useNotifications();
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
      const fullName = `${rescue.first_name} ${rescue.middle_name || ""} ${
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
      const matchesAction =
        currentStatus === "All" ||
        (currentStatus === "Active" && rescue.status === "Active") ||
        (currentStatus === "Inactive" && rescue.status === "Inactive");

      return (
        matchesName &&
        matchesMunicipality &&
        matchesBarangay &&
        matchesStatus &&
        matchesVerified &&
        matchesAction
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
    currentStatus,
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

  const handleToggleModalOpen = (id, status) => {
    setSelectedRescuerId(id);
    setCurrentStatus(status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const response = await axios.put(
        `/users/updateStatus/${id}`,
        { status: newStatus },
        createAuthHeader()
      );
      addNotification(
        `Status changed to ${newStatus} successfully for user with ID: ${id}`
      );
      console.log("Response from server:", response.data);
      setRescuers((prevRescuers) =>
        prevRescuers.map((rescuer) =>
          rescuer.id === id ? { ...rescuer, status: newStatus } : rescuer
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      addNotification(`Failed to change status for user with ID: ${id}`);
      setIsModalOpen(false);
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Rescuers List Report", doc.internal.pageSize.getWidth() / 2, 10, {
      align: "center",
    });

    const tableColumn = [
      { title: "#", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Municipality", dataKey: "municipality" },
      { title: "Barangay Name", dataKey: "barangay" },
      { title: "Contact Number", dataKey: "contact_number" },
      { title: "Email", dataKey: "email" },
      { title: "Online/Offline", dataKey: "status_mode" },
      { title: "Verified Email", dataKey: "verified" },
      { title: "Status", dataKey: "status" },
    ];

    const tableRows = paginatedRescuers.map((rescue, index) => ({
      id: rescue.id,
      name: `${rescue.first_name} ${rescue.middle_name || ""} ${
        rescue.last_name
      }`,
      municipality: rescue.municipality,
      barangay: rescue.barangay,
      contact_number: rescue.contact_number,
      email: rescue.email,
      status_mode: rescue.is_online ? "Online" : "Offline",
      verified: rescue.verified ? "Verified" : "Not Verified",
      status: rescue.status ? "Active" : "Inactive",
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
    doc.text(
      `Generated by: ${user?.first_name} ${user?.last_name}`,
      10,
      footerY
    );
    const date = new Date().toLocaleString();
    doc.text(date, pageWidth - 14 - doc.getTextWidth(date), footerY);

    doc.save("rescuers_list.pdf");
  };

  return (
    <div className="h-full">
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <MdAssignmentInd className="text-3xl sm:text-2xl lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold">
          Rescuers
        </h4>
      </div>

      {/* Search, Filter, and Print Controls */}
      <div className="mb-4 flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row gap-2 mb-2 md:mb-0">
          <div className="relative w-full md:w-[30rem]">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="rounded-full border border-primary-medium px-3 py-1 w-full text-sm"
            />
            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-medium" />
          </div>
          <select
            value={selectedMunicipality}
            onChange={handleMunicipalityChange}
            className="rounded-md bg-primary-medium text-white px-2 py-1 text-sm max-w-full md:max-w-[9rem]"
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
            className="rounded-md bg-primary-medium text-white px-2 py-1 text-sm max-w-full md:max-w-[8rem]"
          >
            <option value="All">All Barangays</option>
            {barangays.map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
          <select
            value={selectedVerified}
            onChange={(e) => setSelectedVerified(e.target.value)}
            className="rounded-md bg-primary-medium text-white  px-2 py-1 text-sm max-w-full md:max-w-[11rem]"
          >
            <option value="All">All Verification Status</option>
            <option value="True">Verified</option>
            <option value="False">Not Verified</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md bg-primary-medium text-white  px-2 py-1 text-sm max-w-full md:max-w-[8rem]"
          >
            <option value="All">Online/Offline</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            className="rounded-md bg-primary-medium text-white  px-2 py-1 text-sm max-w-full md:max-w-[5rem]"
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
      <div className="overflow-x-auto max-h-[calc(100vh-28rem)]">
        <table className="min-w-full bg-gray-200 border border-gray-200 rounded-md overflow-hidden h-full">
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
                Email
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Online/Offline
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Verified
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRescuers.map((rescue, index) => (
              <tr
                key={rescue.id}
                className={`  border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-2 text-xs text-center text-secondary">
                  {rescue.id}
                </td>
                <td className="px-4 py-2 text-xs text-center">{`${
                  rescue.first_name
                } ${rescue.middle_name || ""} ${rescue.last_name}`}</td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.municipality}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.barangay}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.contact_number}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  {rescue.email}
                </td>
                <td
                  className={`px-4 py-2 text-xs text-center ${
                    rescue.is_online ? "text-primary" : "text-secondary"
                  }`}
                >
                  {rescue.is_online ? (
                    <span className="flex items-center justify-center rounded-full font-semibold py-2 text-green-500">
                      <FaCircle className="text-green-500 mr-1" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center justify-center rounded-full font-semibold py-2 text-red-400">
                      <FaCircle className="text-red-500 mr-1" />
                      Offline
                    </span>
                  )}
                </td>
                <td
                  className={`px-4 py-2 text-center ${
                    rescue.verified ? "text-primary-medium" : "text-secondary"
                  } text-xs md:text-sm`}
                >
                  {rescue.verified ? (
                    <span className="flex items-center justify-center rounded-full font-semibold py-2 text-blue-400">
                      <FaCircle className="text-white mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center justify-center rounded-full font-semibold py-2 text-orange-400">
                      <FaCircle className="text-white mr-1" />
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs text-center">
                  <button
                    onClick={() =>
                      handleToggleModalOpen(rescue.id, rescue.status)
                    }
                    className={`rounded-full px-4 py-1 ${
                      rescue.status === "Active"
                        ? "bg-green-500"
                        : "bg-slate-500"
                    } text-white`}
                  >
                    {rescue.status === "Active" ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-[#557C55]">
              Confirm Status Change
            </h2>
            <p>
              Are you sure you want to mark this rescuer as{" "}
              {currentStatus === "Active" ? "Inactive" : "Active"}?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  handleToggleStatus(selectedRescuerId, currentStatus)
                }
                className=" text-primary px-4 py-2 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className=" text-secondary px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-60">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-primary-medium px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-primary-medium">{`${currentPage} of ${Math.ceil(
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

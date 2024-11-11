import { useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Optional, for table formatting
import axios from "axios";

// TODO: change page name
// TODO: make report pdf design similar to all reports
const GenerateReports = (props) => {
  const { user } = props;
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [actionFilters, setActionFilters] = useState({
    "Logged In": true,
    "Logged Out": true,
    "User changed password successfully": true,
    "Email change verified and updated": true,
    "User changed email": true,
    "Rescuer created": true,
    "User updated": true,
    "User status update": true,
    "Requested password reset": true,
    "Password reset successful": true,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectAll, setSelectAll] = useState(true);

  // New state for sorting
  const [sortOption, setSortOption] = useState(""); // Default sorting option

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    resetFilters();

    const today = new Date();
    if (report.name === "Daily Report") {
      setStartDate(today.toISOString().split("T")[0]); // Set to today
      setEndDate(today.toISOString().split("T")[0]); // Set to today
    } else if (report.name === "Weekly Report") {
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay()); // Set to Sunday of the current week
      setStartDate(sunday.toISOString().split("T")[0]); // Start from Sunday
      setEndDate(today.toISOString().split("T")[0]); // End on today
    } else if (report.name === "Monthly Report") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(startOfMonth.toISOString().split("T")[0]); // First day of the month
      setEndDate(endOfMonth.toISOString().split("T")[0]); // Last day of the month
    } else {
      setStartDate(""); // For Custom Report, it will be set by the user
      setEndDate(""); // For Custom Report, it will be set by the user
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    resetFilters();
  };

  const resetFilters = () => {
    setAccountType(""); // Reset to default
    setActionFilters({
      "Logged In": true,
      "Logged Out": true,
      "User changed password successfully": true,
      "Email change verified and updated": true,
      "User changed email": true,
      "Rescuer created": true,
      "User updated": true,
      "User status update": true,
      "Requested password reset": true,
      "Password reset successful": true,
    });
    setStartDate("");
    setEndDate("");
    setSelectAll(true); // Reset "Select All" state
    setSortOption(""); // Reset sort option
  };

  const applyFilters = async () => {
    const selectedActions = Object.entries(actionFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([filter]) => filter);

    const queryParams = new URLSearchParams({
      action: selectedActions.join(","),
      account_type: accountType || "",
      start_date: startDate || "",
      end_date:
        new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
          .toISOString()
          .split("T")[0] || "",
      sort_order: sortOption || "",
    }).toString();

    try {
      const response = await axios.get(`/logs/get?${queryParams}`);
      const logs = response.data.logs;
      console.log("Logs:", logs);
      return logs; // Return logs for PDF generation
    } catch (error) {
      console.error("Error fetching logs:", error);
      return []; // Return empty array if error occurs
    }
  };

  const generatePDF = (logs) => {
    const doc = new jsPDF("landscape");

    // Set the title of the report
    doc.setFontSize(18);
    doc.text("Action Log Reports", doc.internal.pageSize.getWidth() / 2, 10, {
      align: "center",
    });

    // Check if there are logs to display
    if (logs.length > 0) {
      const columns = ["Log ID", "Action", "Date", "User ID", "User Name"];
      const rows = logs.map((log) => [
        log.id,
        log.action,
        new Date(log.date_time).toLocaleString(), // Format date
        log.user_id,
        `${log.first_name} ${log.middle_name ? log.middle_name.trim() : ""} ${
          log.last_name
        }`,
      ]);

      // Generate the table with updated styles
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 40,
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
    } else {
      doc.text("No logs found for the selected filters.", 10, 40);
    }

    // Add footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = pageHeight - 10;

    doc.setFontSize(10);
    // "Generated by" on the left side
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

    // Save the PDF
    doc.save(`${selectedReport?.name || "report"}.pdf`);
  };

  const handleCheckboxChange = (filter) => {
    setActionFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  const handleSelectAllChange = () => {
    setSelectAll((prev) => !prev);
    const updatedFilters = Object.keys(actionFilters).reduce((acc, filter) => {
      // Disable "Rescuer Created" if account type is rescuer
      if (filter === "Rescuer created" && accountType === "Rescuer") {
        acc[filter] = false;
      } else {
        acc[filter] = !selectAll;
      }
      return acc;
    }, {});
    setActionFilters(updatedFilters);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleGenerateReport = async () => {
    const logs = await applyFilters();
    const selectedActions = Object.entries(actionFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([filter]) => filter);
    generatePDF(logs);
    closeModal();
  };

  const reports = [
    { id: 1, name: "Daily Report", description: "Summary of daily activities" },
    {
      id: 2,
      name: "Weekly Report",
      description: "Summary of weekly activities",
    },
    {
      id: 3,
      name: "Monthly Report",
      description: "Summary of monthly activities",
    },
    {
      id: 4,
      name: "Custom Report",
      description: "Customizable report with date filters",
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 h-full  flex flex-col">
      <div className="flex items-center mb-2 sm:mb-4 border-b border-gray-200 pb-3">
        <FaFileAlt className="text-3xl sm:text-md lg:text-3xl text-primary-dark mr-2 fill-current" />
        <h4 className="text-xl sm:text-md lg:text-3xl text-primary-dark font-bold dark:text-primary">
          Generate Log Action Reports
        </h4>
      </div>

      <div className="bg-white rounded-md p-2 sm:p-4 flex flex-col space-y-2 sm:space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex justify-between items-start sm:items-center p-6 border rounded-md bg-white hover:bg-[#F0F0F0] transition"
          >
            <div className="flex-1">
              <h5 className="text-md sm:text-xl font-semibold text-[#557C55]">
                {report.name}
              </h5>
              <p className="text-sm sm:text-gray-700">{report.description}</p>
            </div>
            <button
              className="bg-[#557C55] text-white px-6 py-2 sm:px-5 sm:py-3 rounded-lg text-xs sm:text-sm hover:bg-[#6EA46E] transition mt-2 sm:mt-0 flex items-center"
              onClick={() => openModal(report)}
            >
              <AiOutlinePrinter className="text-base sm:text-lg mr-2" />
              Generate
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto p-6">
            {" "}
            <Dialog.Title className="text-lg font-semibold text-primary-medium">
              Generate {selectedReport?.name} Report
            </Dialog.Title>
            <Dialog.Description className="text-sm text-primary-mediummt-2 mb-4">
              Select the filters for the report.
            </Dialog.Description>
            {/* Account Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-medium mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={handleAccountTypeChange}
                className="block w-full border border-primary-medium rounded-md p-2"
              >
                <option value="All">All</option>
                <option value="Admin">Admin</option>
                <option value="Rescuer">Rescuer</option>
              </select>
            </div>
            {/* Action Filters */}
            <div className="mb-4">
              <p className="text-sm font-medium text-primary-medium mb-1">
                Actions
              </p>
              <div className="flex flex-col">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  <span className="ml-2">Select All</span>
                </label>
                {Object.keys(actionFilters).map((filter) => (
                  <label key={filter} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={actionFilters[filter]}
                      onChange={() => handleCheckboxChange(filter)}
                      disabled={
                        filter === "Rescuer created" &&
                        accountType === "Rescuer"
                      }
                    />
                    <span className="ml-2">{filter}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Sort Option */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-medium mb-1">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={handleSortOptionChange}
                className="block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Default</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            {/* Date Filters */}
            {selectedReport?.name === "Custom Report" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
                <label className="block text-sm font-medium text-primary-medium mb-1 mt-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            )}
            {/* Generate Button */}
            <div className="flex justify-between">
              <button
                className="bg-[#557C55] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6EA46E] transition"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
              <button
                className=" text-secondary px-4 py-2 rounded-md text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default GenerateReports;

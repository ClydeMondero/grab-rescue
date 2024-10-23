import { useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Optional, for table formatting

const GenerateReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    AccountType: "All",
    "Logged In": false,
    "Logged Out": false,
    "Logged In / Logged Out": false,
    "User changed password successfully": false,
    "Email change verified and updated": false,
    "User changed email": false,
    "User logged in": false,
    "Rescuer created": false, // This will be conditionally rendered
    "User updated": false,
    "Requested password reset": false,
    "Password reset successful": false,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setSelectedFilters({
      AccountType: "All", // Reset to default
      "Logged In": false,
      "Logged Out": false,
      "Logged In / Logged Out": false,
      "User changed password successfully": false,
      "Email change verified and updated": false,
      "User changed email": false,
      "User logged in": false,
      "Rescuer created": false, // Reset to default
      "User updated": false,
      "Requested password reset": false,
      "Password reset successful": false,
    });
    setStartDate("");
    setEndDate("");
  };

  const applyFilters = () => {
    // Generate the PDF report based on the selected report
    generatePDF();
    closeModal();
  };

  const generatePDF = () => {
    const doc = new jsPDF(); // Create a new jsPDF instance

    // Set the title for the report
    doc.setFontSize(18);
    doc.text(selectedReport?.name || "Report", 10, 10);

    // Add some filtered data as content to the PDF (this is just an example)
    doc.setFontSize(12);
    Object.entries(selectedFilters).forEach(([filter, isSelected], index) => {
      if (filter === "AccountType") {
        doc.text(`Account Type: ${isSelected}`, 10, 20 + index * 10);
      } else if (isSelected) {
        doc.text(`Filter: ${filter}`, 10, 20 + index * 10);
      }
    });

    if (startDate)
      doc.text(
        `Start Date: ${startDate}`,
        10,
        20 + Object.keys(selectedFilters).length * 10
      );
    if (endDate)
      doc.text(
        `End Date: ${endDate}`,
        10,
        30 + Object.keys(selectedFilters).length * 10
      );

    // Save the generated PDF
    doc.save(`${selectedReport?.name || "report"}.pdf`);
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

  const handleCheckboxChange = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleAccountTypeChange = (event) => {
    setSelectedFilters((prev) => ({
      ...prev,
      AccountType: event.target.value,
    }));
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-4 sm:mb-6 pb-2 sm:pb-4 p-2 sm:p-4 rounded-lg">
        <FaFileAlt className="text-2xl sm:text-3xl text-[#557C55] mr-2 sm:mr-3" />
        <h4 className="text-sm sm:text-2xl font-semibold text-[#557C55]">
          Generate Reports
        </h4>
      </div>

      <p className="mb-4 sm:mb-6 text-md sm:text-md text-gray-600">
        Select a report type to generate:
      </p>

      <div className="bg-white rounded-md p-2 sm:p-4 flex flex-col space-y-2 sm:space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-2 border rounded-md bg-white hover:bg-[#F0F0F0] transition"
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

      {/* Modal */}
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-md p-6 sm:p-8 w-full max-w-lg">
            <Dialog.Title className="text-lg sm:text-2xl font-semibold text-[#557C55] mb-4">
              Filter {selectedReport?.name}
            </Dialog.Title>

            {/* Select for Account Type */}
            <div className="mb-4">
              <label className="block text-sm sm:text-md text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={selectedFilters.AccountType}
                onChange={handleAccountTypeChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="All">All</option>
                <option value="Rescuer">Rescuer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Checkboxes for Filters */}
            <div className="mb-4">
              <p className="block text-sm sm:text-md text-gray-700 mb-2">
                Select Filters:
              </p>
              {Object.keys(selectedFilters)
                .filter((filter) => filter !== "AccountType") // Exclude AccountType from checkboxes
                .map((filter) => {
                  // Conditionally render the checkbox for "Rescuer created"
                  if (
                    filter === "Rescuer created" &&
                    selectedFilters.AccountType === "Rescuer"
                  ) {
                    return null; // Skip rendering this checkbox
                  }
                  return (
                    <div key={filter} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={filter}
                        checked={selectedFilters[filter]}
                        onChange={() => handleCheckboxChange(filter)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={filter}
                        className="text-sm sm:text-md text-gray-700"
                      >
                        {filter}
                      </label>
                    </div>
                  );
                })}
            </div>

            {selectedReport?.name === "Custom Report" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm sm:text-md text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm sm:text-md text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end">
              <button
                onClick={applyFilters}
                className="bg-[#557C55] text-white px-6 py-2 rounded-lg hover:bg-[#6EA46E] transition"
              >
                Generate Report
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default GenerateReports;

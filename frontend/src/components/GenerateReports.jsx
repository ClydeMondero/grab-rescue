import { useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const GenerateReports = () => {
  const [reports] = useState([
    {
      id: 1,
      name: "Daily Report",
      description: "Summary of all activities for the day.",
    },
    {
      id: 2,
      name: "Weekly Report",
      description: "Summary of activities for the week.",
    },
    {
      id: 3,
      name: "Monthly Report",
      description: "Detailed analysis of all incidents for the month.",
    },
    {
      id: 4,
      name: "Custom Report",
      description: "Customize your report by filtering specific data.",
    },
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setFilterOption("");
    setStartDate("");
    setEndDate("");
  };

  const applyFilters = () => {
    let filtersApplied = `Filters applied for ${selectedReport.name}: ${filterOption}`;

    if (selectedReport?.name === "Custom Report") {
      filtersApplied += `, Start Date: ${startDate}, End Date: ${endDate}`;
    }

    alert(filtersApplied);
    closeModal();
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

            <div className="mb-4">
              <label className="block text-sm sm:text-md text-gray-700">
                Select Filter
              </label>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Choose a filter</option>
                <option value="Rescuer">Rescuer</option>
                <option value="logged-in">Logged In</option>
                <option value="logged-out">Logged Out</option>
              </select>
            </div>

            {/* Show start and end date fields for Custom Report */}
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
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="bg-[#557C55] text-white px-4 py-2 rounded-lg hover:bg-[#6EA46E] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default GenerateReports;

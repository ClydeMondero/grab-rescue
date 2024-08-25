import { useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai"; 
import { FaFileAlt } from "react-icons/fa";

const GenerateReports = () => {
  const [reports] = useState([
    { id: 1, name: 'Daily Report', description: 'Summary of all activities for the day.' },
    { id: 2, name: 'Weekly Report', description: 'Summary of activities for the week.' },
    { id: 3, name: 'Monthly Report', description: 'Detailed analysis of all incidents for the month.' },
  ]);

  const generateReport = (report) => {
    alert(`${report.name} generated and downloaded!`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-4 sm:mb-6 pb-2 sm:pb-4 p-2 sm:p-4 rounded-lg">
        <FaFileAlt className="text-2xl sm:text-3xl text-[#557C55] mr-2 sm:mr-3" />
        <h4 className="text-sm sm:text-2xl font-semibold text-[#557C55]">Generate Reports</h4>
      </div>

      <p className="mb-4 sm:mb-6 text-md sm:text-md text-gray-600">Select a report type to generate:</p>

      <div className="bg-white rounded-md p-2 sm:p-4 flex flex-col space-y-2 sm:space-y-4">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-2 border rounded-md bg-white hover:bg-[#F0F0F0] transition"
          >
            <div className="flex-1">
              <h5 className="text-md sm:text-xl font-semibold text-[#557C55]">{report.name}</h5>
              <p className="text-sm sm:text-gray-700">{report.description}</p>
            </div>
            <button 
              className="bg-[#557C55] text-white px-6 py-2 sm:px-5 sm:py-3 rounded-lg text-xs sm:text-sm hover:bg-[#6EA46E] transition mt-2 sm:mt-0 flex items-center"
              onClick={() => generateReport(report)}
            >
              <AiOutlinePrinter className="text-base sm:text-lg mr-2" />
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateReports;

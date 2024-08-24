import { useState } from "react";
import { AiOutlineFileText } from "react-icons/ai"; // Import an appropriate icon

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
    <div className="flex-1 p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-6 border-b pb-4 p-4 rounded-lg">
        <AiOutlineFileText className="text-3xl text-[#557C55] mr-3" />
        <h4 className="text-2xl font-semibold text-[#557C55]">Generate Reports</h4>
      </div>

      <p className="mb-6 text-md text-gray-600">Select a report type to generate:</p>

      <div className="bg-white rounded-md p-6 flex flex-col space-y-4">
        {reports.map((report) => (
          <div 
            key={report.id} 
            className="flex justify-between items-center p-4 border rounded-md  bg-[#F9F9F9] hover:bg-[#F0F0F0] transition"
          >
            <div>
              <h5 className="text-xl font-semibold text-[#557C55]">{report.name}</h5>
              <p className="text-gray-700">{report.description}</p>
            </div>
            <button 
              className="bg-[#557C55] text-white px-5 py-3 rounded-lg text-sm hover:bg-[#6EA46E] transition"
              onClick={() => generateReport(report)}
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateReports;

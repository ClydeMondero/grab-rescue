const GenerateReports = () => {
  const reports = [
    { id: 1, name: 'Daily Report', description: 'Summary of all activities for the day.' },
    { id: 2, name: 'Weekly Report', description: 'Summary of activities for the week.' },
    { id: 3, name: 'Monthly Report', description: 'Detailed analysis of all incidents for the month.' },
  ];

  const generateReport = (report) => {
    alert(`${report.name} generated and downloaded!`);
  };

  return (
    <div className="pl-72 p-6 h-screen">
      <h4 className="bi bi-printer-fill text-4xl font-bold mb-6 text-[#557C55]">Generate Reports</h4>
      <div className="p-6 rounded-lg bg-white">
        <p className="text-xl mb-4">Select a report type to generate:</p>
        <ul className="space-y-4">
          {reports.map((report) => (
            <li 
              key={report.id} 
              className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-[#F9F9F9] hover:bg-[#F0F0F0] transition"
            >
              <div>
                <h5 className="text-xl font-semibold text-[#557C55]">{report.name}</h5>
                <p className="text-gray-700">{report.description}</p>
              </div>
              <button 
                className="bg-[#557C55] text-white px-4 py-2 rounded-lg hover:bg-[#6EA46E] transition"
                onClick={() => generateReport(report)}
              >
                Generate
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenerateReports;

import { useState } from "react";
import { FaAmbulance } from "react-icons/fa";

const OngoingRescues = () => {
  const [ongoingRescues] = useState([
    { id: 1, location: 'San Rafael, Bulacan', rescuer: 'John Doe', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '10:00 AM', estimatedDepartureTime: '11:30 AM' },
    { id: 2, location: 'Bustos, Bulacan', rescuer: 'Jane Smith', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '10:30 AM', estimatedDepartureTime: '12:00 PM' },
    { id: 3, location: 'San Ildefonso, Bulacan', rescuer: 'Mike Johnson', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '11:00 AM', estimatedDepartureTime: '01:00 PM' },
    { id: 4, location: 'Angat, Bulacan', rescuer: 'Sarah Brown', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '11:30 AM', estimatedDepartureTime: '02:30 PM' },
    { id: 5, location: 'Pandi, Bulacan', rescuer: 'David Lee', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '12:00 PM', estimatedDepartureTime: '03:00 PM' },
    { id: 6, location: 'Bulakan, Bulacan', rescuer: 'Emily Chen', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '12:30 PM', estimatedDepartureTime: '04:30 PM' },
    { id: 7, location: 'Obando, Bulacan', rescuer: 'Michael Kim', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '01:00 PM', estimatedDepartureTime: '05:00 PM' },
    { id: 8, location: 'Marilao, Bulacan', rescuer: 'Karen Davis', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '01:30 PM', estimatedDepartureTime: '06:30 PM' },
    { id: 9, location: 'Cawayan, Bulacan', rescuer: 'Linda Johnson', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '02:00 PM', estimatedDepartureTime: '07:00 PM' },
    { id: 10, location: 'Poblacion, Bulacan', rescuer: 'David Lee', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '02:30 PM', estimatedDepartureTime: '08:30 PM' },
  ]);

  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Paginate data
  const totalRows = ongoingRescues.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRescues = ongoingRescues.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Determine which page numbers to show
  const visiblePages = pageNumbers.length <= 5
    ? pageNumbers
    : pageNumbers.slice(
        Math.max(0, currentPage - 2),
        Math.min(totalPages, currentPage + 2)
      );

  const handleShowMap = (location) => {
    setShowMap(location);
  };

  return (
    <div className="flex-1 p-2 sm:p-3 lg:p-4 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-4 sm:mb-6 pb-2 sm:pb-4">
        <FaAmbulance className="text-xl sm:text-3xl text-[#557C55] mr-2 sm:mr-3" />
        <h4 className="text-md sm:text-2xl font-semibold text-[#557C55]">Ongoing Rescues</h4>
      </div>

      <p className="mb-4 text-sm sm:text-md text-gray-600">Track the status of ongoing rescue operations:</p>

      <div className="bg-white rounded-lg p-2 sm:p-4 flex flex-col flex-1">
        {showMap && (
          <div className="mb-4 sm:mb-6">
            <h5 className="text-lg sm:text-2xl font-semibold mb-2">Map for {showMap}</h5>
            <div className="map-placeholder bg-[#eaeaea] rounded-lg" style={{ height: '200px' }}>
              {/* Replace with your map component */}
              <p className="text-center pt-4 text-sm sm:text-base">Map showing location: {showMap}</p>
            </div>
            <button 
              className="bg-[#FA7070] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md mt-2 hover:bg-[#ff4444] transition text-xs sm:text-sm"
              onClick={() => setShowMap(false)}
            >
              Hide Map
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm rounded-lg border border-gray-200">
            <thead className="bg-[#557C55] text-white text-left">
              <tr>
                <th className="px-2 sm:px-4 py-1 sm:py-3">#</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Location</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Rescuer</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Date</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Arrival</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Departed</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Status</th>
                <th className="px-2 sm:px-4 py-1 sm:py-3">Map</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRescues.map((rescue, index) => (
                <tr 
                  key={rescue.id} 
                  className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F0F0]'}`}
                >
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.id}</td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.location}</td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.rescuer}</td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.date}</td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.estimatedArrivalTime}</td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">{rescue.estimatedDepartureTime}</td>
                  <td className={`px-2 sm:px-4 py-1 sm:py-2 ${rescue.status === 'In Progress' ? 'text-[#4158A6]' : 'text-black'}`}>
                    {rescue.status}
                  </td>
                  <td className="px-2 sm:px-4 py-1 sm:py-2">
                    <button
                      className="bg-[#6EA46E] text-white px-2 sm:px-3 py-1 sm:py-1 rounded-md text-xs sm:text-sm hover:bg-[#557C55] transition"
                      onClick={() => handleShowMap(rescue.location)}
                    >
                      Show Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col items-center justify-between p-2 bg-gray-100 sm:flex-row">
          {/* Conditionally render the Previous button */}
          {currentPage > 1 && (
            <button 
              className="w-full mb-1 px-2 py-1 text-xs bg-[#557C55] text-white rounded-md hover:bg-[#4a6b4a] sm:w-auto sm:mb-0"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt; Previous
            </button>
          )}
          <div className="flex flex-wrap items-center justify-center space-x-1 mt-1 sm:mt-0">
            {visiblePages.map((pageNumber) => (
              <button 
                key={pageNumber}
                className={`px-2 py-1 text-xs border rounded-md ${currentPage === pageNumber ? 'bg-[#557C55] text-white' : 'bg-white text-[#557C55] border-[#557C55]'} hover:bg-[#4a6b4a]`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          {/* Conditionally render the Next button */}
          {currentPage < totalPages && (
            <button 
              className="w-full mt-1 px-2 py-1 text-xs bg-[#557C55] text-white rounded-md hover:bg-[#4a6b4a] sm:w-auto sm:mt-0"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next &gt;
            </button>
           )}
           </div>
         </div>
       </div>
     );
   };
   
   export default OngoingRescues;
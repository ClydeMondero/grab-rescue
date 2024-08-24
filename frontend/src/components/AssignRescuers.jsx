import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

const AssignRescuers = () => {
  const [rescuers] = useState([
    { id: 1, name: 'John Doe', location: 'San Rafael, Bulacan', status: 'Available', barangay: 'Barangay San Isidro', contactNumber: '123-456-7890' },
    { id: 2, name: 'Jane Smith', location: 'Bustos, Bulacan', status: 'Available', barangay: 'Barangay Bignay', contactNumber: '234-567-8901' },
    { id: 4, name: 'Sarah Connor', location: 'Angat, Bulacan', status: 'Available', barangay: 'Barangay Cawayan', contactNumber: '345-678-9012' },
    { id: 5, name: 'Tom Harris', location: 'San Ildefonso, Bulacan', status: 'Unavailable', barangay: 'Barangay Poblacion', contactNumber: '456-789-0123' },
  ]);

  const [requests] = useState([
    { id: 1, location: 'San Rafael, Bulacan', time: '08:30 AM', status: 'Pending', type: 'Medical Emergency' },
    { id: 2, location: 'Bustos, Bulacan', time: '09:00 AM', status: 'Pending', type: 'Flooding' },
    { id: 3, location: 'Baliuag, Bulacan', time: '09:30 AM', status: 'In Progress', type: 'Fire' },
    { id: 4, location: 'San Ildefonso, Bulacan', time: '10:00 AM', status: 'Pending', type: 'Traffic Accident' },
    { id: 5, location: 'Angat, Bulacan', time: '10:15 AM', status: 'Completed', type: 'Earthquake' },
  ]);

  const [selectedLocation, setSelectedLocation] = useState('All');

  // Filter requests based on the selected location
  const filteredRequests = selectedLocation === 'All' 
    ? requests 
    : requests.filter(request => request.location.includes(selectedLocation));

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <header className="p-2 sm:p-3 lg:p-4 flex items-center border-b border-[#E2E2E2]">
        <AiOutlineUser className="text-lg sm:text-xl text-[#557C55] mr-1 sm:mr-2" />
        <h4 className="text-md sm:text-lg font-semibold text-[#557C55]">Assign Rescuers</h4>
      </header>

      <p className="px-2 mb-1 text-xs sm:text-sm text-gray-600">Filter and assign rescuers to the following requests:</p>

      <div className="flex-1 bg-white rounded-lg p-2 sm:p-3 flex flex-col">
        <div className="mb-1 px-2">
          <label htmlFor="locationFilter" className="block text-xs sm:text-sm font-medium text-gray-700">Filter by Location:</label>
          <select 
            id="locationFilter"
            className="form-select w-full border border-[#557C55] text-black rounded-lg p-1 mt-1 bg-gray-50 text-xs sm:text-sm"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="San Rafael, Bulacan">San Rafael, Bulacan</option>
            <option value="Bustos, Bulacan">Bustos, Bulacan</option>
            <option value="Baliuag, Bulacan">Baliuag, Bulacan</option>
            <option value="Angat, Bulacan">Angat, Bulacan</option>
            <option value="San Ildefonso, Bulacan">San Ildefonso, Bulacan</option>
          </select>
        </div>

        <p className="px-2 mb-1 text-xs sm:text-sm font-semibold text-gray-700">List of available rescuers:</p>
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs sm:text-sm">
            <thead className="bg-[#557C55] text-white text-left">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Barangay Name</th>
                <th className="px-4 py-2">Contact Number</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rescuers.map((rescuer, index) => (
                <tr 
                  key={rescuer.id} 
                  className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2">{rescuer.id}</td>
                  <td className="px-4 py-2">{rescuer.name}</td>
                  <td className="px-4 py-2">{rescuer.location}</td>
                  <td className="px-4 py-2">{rescuer.barangay}</td>
                  <td className="px-4 py-2">{rescuer.contactNumber}</td>
                  <td 
                    className={`px-2 py-1 ${rescuer.status === 'Available' ? 'text-green-600' : rescuer.status === 'Unavailable' ? 'text-red-600' : 'text-black'}`}
                  >
                    {rescuer.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignRescuers;

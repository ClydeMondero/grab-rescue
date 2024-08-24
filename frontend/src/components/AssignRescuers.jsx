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
    <div className="flex-1 p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-6 border-b border-[#E2E2E2] pb-4">
        <AiOutlineUser className="text-3xl text-[#557C55] mr-3" />
        <h4 className="text-2xl font-semibold text-[#557C55]">Assign Rescuers</h4>
      </div>

      <p className="mb-6 text-md text-gray-600">Filter and assign rescuers to the following requests:</p>

      <div className="bg-white rounded-lg p-6 flex flex-col flex-1">
        <div className="mb-6">
          <label htmlFor="locationFilter" className="block text-lg font-medium text-gray-700">Filter by Location:</label>
          <select 
            id="locationFilter"
            className="form-select w-full border border-[#557C55] text-black rounded-lg p-3 mt-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#557C55]"
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

        <p className="mb-6 text-lg font-semibold text-gray-700">List of available rescuers:</p>
        <div className="flex-1 overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-[#557C55] text-white text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Barangay Name</th>
                <th className="px-4 py-3">Contact Number</th>
                <th className="px-4 py-3">Status</th>
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
                    className={`px-4 py-2 ${rescuer.status === 'Available' ? 'text-green-600' : rescuer.status === 'Unavailable' ? 'text-red-600' : 'text-black'}`}
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

import { useState } from "react";

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
    <div className="pl-72 p-6 h-screen">
      <h4 className="bi bi-people-fill text-4xl font-bold mb-6 text-[#557C55]">Assign Rescuers</h4>
      <div className="p-6 rounded-lg bg-white">
        <div className="mb-4">
          <label htmlFor="locationFilter" className="form-label text-xl">Filter by Location:</label>
          <select 
            id="locationFilter"
            className="form-select w-full border-2 border-[#557C55] text-black rounded-lg p-3 mt-1"
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
        <p className="mb-4 text-xl">List of available rescuers:</p>
        <table className="table-auto w-full rounded-lg overflow-x-auto">
          <thead className="bg-[#557C55] text-white">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Barangay Name</th>
              <th className="px-6 py-3">Contact Number</th>
              <th className="px-6 py-3">Status</th>             
            </tr>
          </thead>
          <tbody>
            {rescuers.map((rescuer, index) => (
              <tr 
                key={rescuer.id} 
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F0F0]'}`}
              >
                <td className="px-6 py-3">{rescuer.id}</td>
                <td className="px-6 py-3">{rescuer.name}</td>
                <td className="px-6 py-3">{rescuer.location}</td>
                <td className="px-6 py-3">{rescuer.barangay}</td>
                <td className="px-6 py-3">{rescuer.contactNumber}</td>
                <td 
                  className={`px-6 py-3 ${rescuer.status === 'Available' ? 'text-[#00712D]' : rescuer.status === 'Unavailable' ? 'text-[#FF1700]' : 'text-black'}`}
                >
                  {rescuer.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignRescuers;

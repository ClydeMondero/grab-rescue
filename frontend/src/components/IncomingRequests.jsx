import { useState } from "react";

const IncomingRequests = () => {
  const [requests] = useState([
    { id: 1, location: 'San Rafael, Bulacan', time: '08:30 AM', status: 'Pending', type: 'Car Accident' },
    { id: 2, location: 'Bustos, Bulacan', time: '09:00 AM', status: 'Pending', type: 'Car Accident' },
    { id: 3, location: 'San Ildefonso, Bulacan', time: '10:00 AM', status: 'Pending', type: 'Traffic Accident' },
  ]);

  return (
    <div className="pl-72 p-6 h-screen">
      <h4 className="bi bi-phone-vibrate text-4xl font-bold mb-6 text-[#557C55]">Incoming Requests</h4>
      <div className="p-6 rounded-lg bg-white">
        <p className="mb-4 text-xl">List of new emergency requests:</p>
        <table className="table-auto w-full rounded-lg overflow-x-auto">
          <thead className="bg-[#557C55] text-white">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr 
                key={request.id} 
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F0F0]'}`}
              >
                <td className="px-6 py-3">{request.id}</td>
                <td className="px-6 py-3">{request.location}</td>
                <td className="px-6 py-3">{request.time}</td>
                <td className="px-6 py-3">{request.type}</td>
                <td className={`px-6 py-3 ${request.status === 'Pending' ? 'text-[#FABC3F]' : request.status === 'In Progress' ? 'text-[#FFA500]' : request.status === 'Completed' ? 'text-[#00FF00]' : 'text-black'}`}>
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingRequests;

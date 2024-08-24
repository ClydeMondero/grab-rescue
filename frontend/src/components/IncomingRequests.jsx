import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

const IncomingRequests = () => {
  const [requests] = useState([
    { id: 1, location: 'San Rafael, Bulacan', time: '08:30 AM', status: 'Pending', type: 'Car Accident' },
    { id: 2, location: 'Bustos, Bulacan', time: '09:00 AM', status: 'Pending', type: 'Car Accident' },
    { id: 3, location: 'San Ildefonso, Bulacan', time: '10:00 AM', status: 'Pending', type: 'Traffic Accident' },
  ]);

  return (
    <div className="flex flex-col p-4 lg:p-6 h-full bg-gray-50">
      <div className="flex items-center mb-4">
        <AiOutlineUser className="text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-xl lg:text-2xl font-semibold text-[#557C55]">Incoming Requests</h4>
      </div>

      <p className="mb-4 text-sm lg:text-md text-gray-700">Here are the latest emergency requests:</p>

      <div className="flex flex-col gap-4 overflow-hidden">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="text-md lg:text-lg font-semibold text-[#557C55]">{request.type}</div>
              <div className="text-xs lg:text-sm text-gray-600 lg:ml-4">{request.location}</div>
            </div>
            <div className="mt-2 lg:mt-0 lg:text-right">
              <div className="text-xs lg:text-sm text-gray-500">{request.time}</div>
              <div className={`mt-1 text-xs lg:text-sm font-semibold ${request.status === 'Pending' ? 'text-yellow-500' : request.status === 'In Progress' ? 'text-orange-500' : 'text-green-500'}`}>
                {request.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomingRequests;

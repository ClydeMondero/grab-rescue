import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai"; 

const OngoingRescues = () => {
  const [ongoingRescues] = useState([
    { id: 1, location: 'San Rafael, Bulacan', rescuer: 'John Doe', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '10:00 AM', estimatedDepartureTime: '11:30 AM' },
    { id: 2, location: 'Bustos, Bulacan', rescuer: 'Jane Smith', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '10:30 AM', estimatedDepartureTime: '12:00 PM' },
    { id: 3, location: 'San Ildefonso, Bulacan', rescuer: 'Mike Johnson', status: 'In Progress', date: '2024-08-23', estimatedArrivalTime: '11:00 AM', estimatedDepartureTime: '01:00 PM' },
  ]);

  const [showMap, setShowMap] = useState(false);

  const handleShowMap = (location) => {
    setShowMap(location);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 h-full bg-gray-50 flex flex-col">
      <div className="flex items-center mb-6 border-b border-[#E2E2E2] pb-4">
        <AiOutlineUser className="text-3xl text-[#557C55] mr-3" />
        <h4 className="text-2xl font-semibold text-[#557C55]">Ongoing Rescues</h4>
      </div>

      <p className="mb-6 text-md text-gray-600">Track the status of ongoing rescue operations:</p>

      <div className="bg-white rounded-lg p-6 flex flex-col flex-1">
        {showMap && (
          <div className="mb-6">
            <h5 className="text-2xl font-semibold mb-2">Map for {showMap}</h5>
            <div className="map-placeholder bg-[#eaeaea] rounded-lg" style={{ height: '400px' }}>
              {/* Replace with your map component */}
              <p className="text-center pt-10">Map showing location: {showMap}</p>
            </div>
            <button 
              className="bg-[#FA7070] text-white px-4 py-2 rounded-md mt-2 hover:bg-[#ff4444] transition"
              onClick={() => setShowMap(false)}
            >
              Hide Map
            </button>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm rounded-lg border border-gray-200">
            <thead className="bg-[#557C55] text-white">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Rescuer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Arrival</th>
                <th className="px-4 py-3">Departed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Map</th>
              </tr>
            </thead>
            <tbody>
              {ongoingRescues.map((rescue, index) => (
                <tr 
                  key={rescue.id} 
                  className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F0F0]'}`}
                >
                  <td className="px-4 py-2">{rescue.id}</td>
                  <td className="px-4 py-2">{rescue.location}</td>
                  <td className="px-4 py-2">{rescue.rescuer}</td>
                  <td className="px-4 py-2">{rescue.date}</td>
                  <td className="px-4 py-2">{rescue.estimatedArrivalTime}</td>
                  <td className="px-4 py-2">{rescue.estimatedDepartureTime}</td>
                  <td className={`px-4 py-2 ${rescue.status === 'In Progress' ? 'text-[#4158A6]' : 'text-black'}`}>
                    {rescue.status}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#6EA46E] text-white px-3 py-1 rounded-md text-xs hover:bg-[#557C55] transition"
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
      </div>
    </div>
  );
};

export default OngoingRescues;

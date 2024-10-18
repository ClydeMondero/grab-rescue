import { MdMail } from "react-icons/md";

const IncomingRequests = ({ requests }) => {
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-6 h-full bg-gray-50">
      <div className="flex items-center mb-3 sm:mb-4">
        <MdMail className="text-xl sm:text-2xl lg:text-3xl text-[#557C55] mr-2" />
        <h4 className="text-md sm:text-xl lg:text-2xl font-semibold text-[#557C55]">
          Incoming Requests
        </h4>
      </div>

      <p className="mb-3 sm:mb-4 text-xs sm:text-sm lg:text-md text-gray-700">
        Here are the latest emergency requests:
      </p>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-3 sm:gap-4 max-h-[calc(100vh-200px)]">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="text-sm sm:text-md lg:text-lg font-semibold text-[#557C55]">
                    {request.location.address}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 sm:ml-4">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(request.timestamp))}
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <div
                    className={`mt-1 text-xs sm:text-sm font-semibold ${
                      request.status === "pending"
                        ? "text-yellow-500"
                        : request.status === "in progress"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {request.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No pending requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingRequests;

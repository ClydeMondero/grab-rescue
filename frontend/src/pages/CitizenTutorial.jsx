import { Nav } from "../components";
import { useNavigate } from "react-router-dom";

const CitizenTutorial = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav navigate={navigate} />

      <div className="flex flex-col items-center justify-start gap-4 h-full p-6 md:p-12 md:h-auto text-center text-black">
        <div className="mb-8">
          <h1 className="text-4xl text-text-primary font-bold mb-4">
            Citizen Tutorial
          </h1>
          <p className="max-w-md text-sm">
            Follow this step-by-step guide to get started.
          </p>
        </div>

        {/* Tutorial : Location */}
        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6 ">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Citizen Location
          </summary>
          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Step 1</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  Make sure your location/GPS is turned on and available.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-OnLocation.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Step 2</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By default, your location will be set to your current
                  location.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-location.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* Tutorial : Location Tracking */}
        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Location and Routes Tracking
          </summary>
          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">My Location</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By clicking the "My Location" button, you can view your
                  current location.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-location.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Nearest Rescuer</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By clicking the "Nearest Rescuer" button, nearest rescuer is
                  displayed.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-nearestrescuer.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">View Route</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By clicking the "View Route" button, route is displayed.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-viewroute.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Hide Route</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By clicking the "Hide Route" button, route is hidden.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-hideroute.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* Tutorial : Request for Help */}
        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Requesting Help
          </summary>
          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Request for Help</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  By clicking the "Request for Help" button, you can request for
                  help.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-location.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Before Sending Request
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  ake sure to read the notes, privacy policy and terms and
                  conditions.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-notesbeforesendingrequest.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Waiting for Rescuer Acceptance
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You will be notified when the rescuer accepts your request.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-waitingrescueracceptance.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="waiting for rescuer"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* Tutorial : Provide Information */}
        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Providing Information
          </summary>
          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Phone Number (Required)
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  Filling in your phone number for the rescuer to contact you.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-waitingrescueracceptance.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Your Name (Optional)</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  Citizen name who is requesting for help is optional. But it is
                  recommended to fill in.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-name.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Relation to Victim (Optional)
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can fill in your relation to the victim. It helps the
                  rescuer to understand the situation better.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-relation.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Proof of Incident (Optional)
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can upload a proof of the incident. It also helps the
                  rescuer to understand the situation better.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-proof.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Description of Incident
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can provide a detailed description of the incident.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-description.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>

        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Accepted by Rescuer
          </summary>
          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Details of the Assigned Rescuer
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  Citizen can view the details of the assigned rescuer.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-waitingrescueracceptance.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">Call Button</h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  Citizen can call the assigned rescuer using the call button.
                  It will redirect to the phone number of the rescuer.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-name.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Relation to Victim (Optional)
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can fill in your relation to the victim. It helps the
                  rescuer to understand the situation better.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-relation.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Proof of Incident (Optional)
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can upload a proof of the incident. It also helps the
                  rescuer to understand the situation better.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-proof.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="Current Location"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-4 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <div className="p-5 rounded-lg transition duration-300 hover:text-green-600 hover:bg-white">
                <h4 className="text-2xl font-semibold">
                  Description of Incident
                </h4>
                <p className="mt-2 text-gray-600 text-center text-base">
                  You can provide a detailed description of the incident.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <img
                    src="src/assets/tutorial-citizen-description.png"
                    className="h-64 w-36 md:w-44 md:h-96"
                    alt="On Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </>
  );
};

export default CitizenTutorial;

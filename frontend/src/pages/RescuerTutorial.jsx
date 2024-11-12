import { Nav } from "../components";
import { useNavigate } from "react-router-dom";

const RescuerTutorial = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav navigate={navigate} />

      <div className="flex flex-col items-center justify-start gap-4 h-full p-6 md:p-12 md:h-auto text-center text-black">
        <div className="mb-8">
          <h1 className="text-4xl text-text-primary font-bold mb-4">
            Rescuer Tutorial
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
          <div className="w-full md:w-1/2">
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

        {/* Tutorial : Provide Information */}
        <details className="w-full max-w-3xl p-6 text-center bg-background-light shadow-md rounded-lg mb-6">
          <summary className="cursor-pointer text-lg md:text-2xl text-start font-bold">
            Providing Information
          </summary>
          <div className="px-4 md:px-8 mt-4 flex items-center justify-center">
            <div className="w-full md:w-1/2">
              {/* Each tutorial step here */}
            </div>
          </div>
        </details>
      </div>
    </>
  );
};

export default RescuerTutorial;

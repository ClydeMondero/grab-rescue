import { Nav } from "../components";
import { useNavigate } from "react-router-dom";
import { useRef } from "react"; // Import useRef
import { FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";
import { RiGovernmentFill } from "react-icons/ri";

const About = () => {
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null); // Reference for About Us section

  // Function to scroll smoothly to the About Us section
  const scrollToAboutSection = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Nav navigate={navigate} />
      <div className="flex flex-col gap-y-16 w-full">
        {/* Hero Section with Parallax Effect */}
        <div className="relative h-screen w-full bg-cover bg-center text-center text-black parallax-hero">
          <div className="absolute inset-0 bg-black bg-opacity-50 md:bg-opacity-50 flex items-center justify-center">
            <div>
              <h2 className="text-7xl md:text-8xl font-bold tracking-wider leading-tight text-white">
                Grab Rescue
              </h2>
              <p className="mt-4 text-2xl md:text-3xl text-white">
                Your trusted lifeline for fast and accurate emergency
                assistance, ensuring that help is always just a tap away.
              </p>
              <button
                onClick={scrollToAboutSection} // Attach the scroll function here
                className="mt-6 px-8 py-3 tracking-wider leading-tight bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
              >
                ABOUT US
              </button>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <section ref={aboutSectionRef} className="py-16 bg-white">
          {" "}
          {/* Reference added here */}
          <div className="container mx-auto md:w-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-8">About Us</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-50 p-6 shadow-lg rounded-lg align-start text-start">
                <h4 className="text-2xl font-semibold text-green-600">
                  We prioritize your safety
                </h4>
                <p className="mt-2 text-gray-600 text-justify text-base">
                  GrabRescue is dedicated to transforming emergency response by
                  leveraging technology to make assistance faster, more precise,
                  and more reliable. Our app was designed with communities in
                  mind—especially those facing challenges like unreliable
                  signals, location inaccuracies, and the need for trustworthy
                  emergency communication.
                </p>
                <p className="mt-2 text-gray-600 text-justify text-base">
                  We believe that everyone deserves quick, effective help in
                  times of crisis. GrabRescue provides essential features like
                  GPS-based location tracking, caller verification, and a
                  streamlined reporting interface, ensuring that responders
                  receive accurate information to reach those in need swiftly.
                  Our goal is simple: to create safer communities by empowering
                  emergency teams and individuals with the tools they need for
                  quick, reliable action. With GrabRescue, we’re building a
                  lifeline you can count on, dedicated to saving lives and
                  making emergency responses as effective as possible.
                </p>
              </div>
              <div className="bg-gray-200 p-6 shadow-sm">
                <img
                  src="../src/assets/content-about.jpg"
                  alt="Image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* "How to Use" Section */}
        <section className="flex flex-col items-center justify-center h-dvh md:p-16 md:h-auto text-center text-black border-t-2 border-b-2 border-gray-300 bg-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold">How to Use</h1>
          <p className="mt-4 max-w-md mx-auto text-base md:text-lg md:mb-5">
            Click the button below to get started.
          </p>

          <div className="grid gap-6 md:grid-cols-3 w-full px-4 py-6 md:px-8 md:py-8 items-center justify-center">
            <div className="bg-gray-50 p-6 shadow-lg rounded-lg transition hover:scale-110 duration-300 hover:text-green-600 flex flex-col items-center">
              <h4 className="text-4xl font-semibold flex items-center gap-2">
                <FaLocationPin className="h-8 w-8" />
                Citizen
              </h4>
              <p className="mt-2 text-gray-600 text-center text-base">
                Citizen Step by Step Guide
              </p>
              <button
                onClick={() => navigate("/citizen-tutorial")}
                className="mt-6 px-20 py-3 tracking-wider leading-tight bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Citizen Tutorial
              </button>
            </div>

            <div className="bg-gray-50 p-6 shadow-lg rounded-lg hover:scale-110 transition duration-300 hover:text-green-600 flex flex-col items-center">
              <h4 className="text-4xl font-semibold flex items-center gap-2">
                <BiSolidAmbulance className="h-9 w-9" />
                Rescuer
              </h4>
              <p className="mt-2 text-gray-600 text-center text-base">
                Rescuer Step by Step Guide
              </p>
              <button
                onClick={() => navigate("/rescuer-tutorial")}
                className="mt-6 px-20 py-3 tracking-wider leading-tight bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Rescuer Tutorial
              </button>
            </div>

            <div className="bg-gray-50 p-6 shadow-lg rounded-lg hover:scale-110 transition duration-300 hover:text-green-600 flex flex-col items-center">
              <h4 className="text-4xl font-semibold flex items-center gap-2">
                <RiGovernmentFill className="h-8 w-8" />
                Admin
              </h4>
              <p className="mt-2 text-gray-600 text-center text-base">
                Admin Step by Step Guide
              </p>
              <button
                onClick={() => navigate("/admin-tutorial")}
                className="mt-6 px-20 py-3 tracking-wider leading-tight bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Admin Tutorial
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;

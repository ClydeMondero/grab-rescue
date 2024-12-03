import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Nav } from "../components";
import background from "/assets/bg.svg";
import bgGif from "../assets/mobile-view.gif";
import contentAbout from "../assets/content-about.jpg";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { FaAndroid, FaLocationPin } from "react-icons/fa6";
import { BiSolidAmbulance } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null);
  const getStartedSectionRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const scrollToAbout = () => {
    aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToGetStarted = () => {
    getStartedSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Verify token function
  const verifyToken = async () => {
    const { data } = await axios.post("/auth/", {}, { withCredentials: true });

    if (data.success) {
      const role = data.user.account_type;
      navigate("/" + role.toLowerCase(), { replace: true });
    }
  };

  const handleDownloadAPK = () => {
    const link = document.createElement("a");
    link.href =
      "https://github.com/ClydeMondero/grab-rescue/releases/download/latest/Grab-Rescue.apk";
    link.setAttribute("download", "Grab-Rescue.apk");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    verifyToken();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleDownloadPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <div className="h-dvh">
      {/* Desktop Navbar */}
      <Nav
        navigate={navigate}
        scrollToAbout={scrollToAbout}
        scrollToGetStarted={scrollToGetStarted}
      />
      {/* Desktop View */}
      <div className="hidden md:flex flex-col w-full">
        {/* Hero */}
        <div
          id="hero"
          className="relative flex flex-row justify-center items-center p-8 w-full h-[90vh] overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          {/* Content Section */}
          <section className="flex flex-col items-start gap-6 text-left w-6/12 px-12 mt-0">
            <p className="text-7xl font-bold text-primary-dark max-w-xl">
              <span className="text-primary text-7xl">Grab Rescue.</span> Every{" "}
              <span className="text-secondary">second</span> counts.
            </p>

            <div className="flex flex-col items-center md:flex-row gap-4">
              {isVisible && (
                <button
                  onClick={handleDownloadPWA}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-400 text-white font-semibold rounded-full shadow-md"
                >
                  <IoMdDownload className="w-4 h-4" />
                  <span>Download PWA</span>
                </button>
              )}

              <div className="flex flex-col items-center">
                <button
                  onClick={handleDownloadAPK}
                  className="flex items-center gap-2 px-8 py-4 bg-green-50 text-primary font-semibold rounded-full shadow-md"
                >
                  <IoLogoGooglePlaystore className="w-4 h-4" />
                  <span>Download APK</span>
                </button>
                <div className="flex gap-2 text-gray-500 mt-2">
                  <FaAndroid />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center items-center w-full md:w-5/12 md:ml-4 lg:ml-6">
            <img
              src={bgGif}
              alt="Grab Rescue"
              className="w-48 md:w-52 lg:w-64 object-contain"
            />
          </div>
        </div>

        <section
          ref={getStartedSectionRef}
          className="flex flex-col items-center justify-center min-h-[100vh] py-12 text-center text-black bg-gradient-to-b from-white via-gray-100 to-background-light"
        >
          <div className="flex items-center gap-2 text-5xl text-primary-dark">
            <h1 className="font-bold mb-4">Get Started with Grab Rescue</h1>
          </div>
          <p className="mt-4 max-w-lg mx-auto text-base md:text-lg md:mb-8 text-gray-700">
            Whether you're a citizen or rescuer, follow the guides below to
            learn how to use our platform effectively.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-around w-full px-8 py-10 gap-8 max-w-5xl">
            <div className="bg-white shadow-lg p-8 transition transform hover:scale-105 duration-300 hover:text-green-600 flex flex-col items-center rounded-lg w-full md:w-5/12">
              <h4 className="text-4xl font-semibold flex items-center gap-3 text-secondary">
                <FaLocationPin className="h-9 w-9" />
                Citizen
              </h4>
              <p className="mt-3 text-gray-600 text-center text-base">
                Step-by-step guide for citizens to ensure you're prepared for
                any emergency.
              </p>
              <button
                onClick={() => navigate("/citizen-tutorial")}
                className="mt-6 px-24 py-3 tracking-wider leading-tight bg-highlight hover:opacity-80 text-white font-semibold rounded-full shadow-md"
              >
                Citizen Tutorial
              </button>
            </div>

            <div className="bg-white shadow-lg p-8 transition transform hover:scale-105 duration-300 hover:text-green-600 flex flex-col items-center rounded-lg w-full md:w-5/12">
              <h4 className="text-4xl font-semibold flex items-center gap-3 text-primary">
                <BiSolidAmbulance className="h-9 w-9" />
                Rescuer
              </h4>
              <p className="mt-3 text-gray-600 text-center text-base">
                Comprehensive guide for rescuers to quickly and efficiently
                respond to emergencies.
              </p>
              <button
                onClick={() => navigate("/rescuer-tutorial")}
                className="mt-6 px-24 py-3 tracking-wider leading-tight bg-highlight hover:opacity-80 text-white font-semibold rounded-full shadow-md"
              >
                Rescuer Tutorial
              </button>
            </div>
          </div>
        </section>

        <section
          ref={aboutSectionRef}
          className="flex flex-row items-center justify-center min-h-[100vh] py-12 text-left text-black bg-white"
        >
          <img
            src={contentAbout}
            alt="Image"
            className="w-1/2 h-auto object-contain"
          />
          <div className="flex flex-col pl-12">
            <h2 className="text-5xl font-bold mb-6 text-primary-dark">
              About Us
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-base md:text-lg md:mb-8 text-gray-700">
              Grab Rescue is committed to providing fast and reliable emergency
              assistance. Our platform connects citizens and rescuers to ensure
              help is always just a tap away.
            </p>
            <p className="mt-4 max-w-lg mx-auto text-base md:text-lg md:mb-8 text-gray-700">
              As a responsible and dedicated team, we are committed to
              delivering the highest level of service and support to our users.
              Our platform is designed with the user in mind, and we strive to
              provide a seamless and intuitive experience for all.
            </p>
          </div>
        </section>

        <footer className="w-full bg-background-light text-primary-medium py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex flex-col items-center">
                  <img src={logo} alt="" />
                  <p className="text-sm ">Every second counts</p>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap justify-center gap-16 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Explore</h3>
                  <ul>
                    <li>
                      <a
                        onClick={() => navigate("/")}
                        className="hover:text-gray-300 cursor-pointer"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => scrollToGetStarted()}
                        className="hover:text-gray-300"
                      >
                        Get Started
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => scrollToAbout()}
                        className="hover:text-gray-300 cursor-pointer"
                      >
                        About
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Others</h3>
                  <ul>
                    <li>
                      <a
                        onClick={() => navigate("/privacy-policy")}
                        className="hover:text-gray-300 cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => navigate("/terms-of-service")}
                        className="hover:text-gray-300 cursor-pointer"
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <ul>
                    <li className="underline cursor-pointer">
                      grabrescue.ph@gmail.com
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-background-medium text-xs">
              <p>Copyright © Grab Rescue 2024. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      {/* Mobile View */}
      <div className="flex flex-col items-center justify-around h-screen bg-background-light px-8 md:hidden">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="" className="w-36" />
          <p className="text-sm text-primary-medium">Every second counts</p>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={toggleModal}
            className="bg-primary text-white font-semibold py-4 px-6 w-full rounded-full "
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-background-light text-primary border border-primary font-semibold py-4 px-6 w-full rounded-full "
          >
            New to Grab Rescue? Sign up!
          </button>
        </div>
      </div>
      {/* Minimal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-highlight bg-opacity-80 flex flex-col items-center justify-center z-[100] text-white p-6">
          <button
            onClick={toggleModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-4">Choose Account Type</h2>
          <p className="text-lg mb-6 text-center max-w-sm">
            Select your account type to proceed with login.
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button
              onClick={() => {
                navigate("/login?role=Citizen");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-highlight font-bold py-3 rounded-lg hover:bg-gray-100 text-center "
            >
              Login as Citizen
            </button>
            <button
              onClick={() => {
                navigate("/login?role=Rescuer");
                setIsModalOpen(false);
              }}
              className="w-full bg-white text-highlight font-bold py-3 rounded-lg hover:bg-gray-100 text-center"
            >
              Login as Rescuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

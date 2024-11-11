import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import bgGif from "../assets/mobile-view.gif";
import { useNavigate } from "react-router-dom";
import backGround from "/assets/bg.svg";
import backGroundMobile from "/assets/mobile-bg.svg";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa";
import { FaWindows, FaApple, FaLinux, FaAndroid } from "react-icons/fa6";
import { Nav } from "../components";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
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

const Download = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
    <div
      className="relative min-h-screen bg-gray-50 overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <Nav navigate={navigate} />

      {/* Page Content */}
      <div
        className={`relative flex flex-col ${
          isMobile ? "items-center" : "md:flex-row"
        } justify-center md:justify-between items-center p-8 w-full h-full overflow-hidden bg-cover bg-center`}
        style={{
          backgroundImage: `url(${isMobile ? backGroundMobile : backGround})`,
        }}
      >
        {/* Back Button */}
        {isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-2 text-white px-6 py-2"
          >
            <FaChevronLeft className="mr-2 text-primary-medium text-2xl" />
          </button>
        )}

        {/* Content Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 md:w-6/12 md:px-12 mt-24 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight mb-6 md:mb-8">
            Download Our App
          </h1>
          <p className="text-xl md:text-2xl text-primary-dark max-w-xs md:max-w-md leading-relaxed">
            Choose your preferred format to download the app and enjoy seamless
            access to all of our features.
          </p>

          <div className="flex flex-col items-center md:flex-row gap-4">
            {/* PWA Download Button */}
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
              {/* APK Download Button */}
              <button
                onClick={handleDownloadAPK}
                className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold rounded-full shadow-md"
              >
                <IoLogoGooglePlaystore className="w-4 h-4" />
                <span>Download APK</span>
              </button>

              {/* Platform Icons */}
              <div className="flex gap-2 text-gray-500 mt-2">
                <FaAndroid />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center items-center w-full md:w-5/12 md:ml-4 lg:ml-6">
          <img
            src={bgGif}
            alt="Grab Rescue"
            className="w-48 md:w-52 lg:w-64 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Download;

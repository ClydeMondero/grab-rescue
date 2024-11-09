import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import bgGif from "../assets/mobile-view.gif";
import { useNavigate } from "react-router-dom";
import backGround from "../assets/bg.svg";
import backGroundMobile from "../assets/mobile-bg.svg";
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
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
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

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferred prompt variable, since it can only be used once
    setDeferredPrompt(null);
    setIsVisible(false); // Hide the install button after prompt
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="relative min-h-screen bg-gray-50 overflow-hidden"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      <Nav navigate={navigate} />

      {/* Page Content */}
      <div
        className={`relative flex flex-col md:flex-row justify-center items-center p-8 w-full h-full overflow-hidden bg-cover bg-center`}
        style={{
          backgroundImage: `url(${isMobile ? backGroundMobile : backGround})`,
        }}
      >
        {/* Back Button Positioned at Top Left */}
        {isMobile && (
          <button
            onClick={handleGoBack}
            className="absolute top-6 left-2 text-white px-6 py-2"
          >
            <FaChevronLeft className="mr-2 text-primary-medium text-2xl" />
          </button>
        )}

        {/* Content Section (Adjust position to make room for the back button) */}
        <div className="flex flex-col md:items-center md:w-1/2 text-center md:text-left mb-8 md:mb-0 space-y-8 mt-24 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight mb-4 text-shadow-md">
            Download Our App
          </h1>
          <p className="text-lg md:text-xl text-primary-dark mb-8 max-w-xs md:max-w-md leading-relaxed text-shadow-md">
            Choose your preferred format to download the app and enjoy seamless
            access to all of our features.
          </p>

          <div className="flex flex-col items-center justify-center w-full space-y-6 md:flex-row md:space-y-0 md:space-x-6">
            {/* PWA Download Section */}
            {isVisible && (
              <div className="flex flex-col items-center">
                <button
                  onClick={handleDownloadPWA}
                  className="gap-2 flex items-center justify-center px-8 py-4 bg-blue-400 text-white font-semibold rounded-full shadow-md"
                >
                  <IoMdDownload className="w-4 h-4" />
                  <span className="font-medium">Download PWA</span>
                </button>
                <span className="text-md text-center text-gray-500 mt-2">
                  <FaWindows className="inline-block mr-1" />
                  <FaApple className="inline-block mr-1" />
                  <FaLinux className="inline-block mr-1" />
                  <FaAndroid className="inline-block mr-1" />
                </span>
              </div>
            )}
            {/* APK Download Button */}
            <div className="flex flex-col items-center">
              <button
                className="gap-2 flex items-center justify-center px-8 py-4 bg-green-500 text-white font-semibold rounded-full shadow-md"
                onClick={handleDownloadAPK}
              >
                <IoLogoGooglePlaystore className="w-4 h-4" />
                <span className="font-medium">Download APK</span>
              </button>
              <span className="text-md text-center text-gray-500 mt-2">
                <FaAndroid className="inline-block mr-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center md:w-1/2 mb-6 md:mb-0">
          <img
            src={bgGif}
            alt="Grab Rescue"
            className="w-64 h-5/6 object-contain"
          />
        </div>
      </div>

      {/* Mobile View Content */}
      {isMobile && (
        <div className="flex flex-col items-center p-8 mt-10">
          <h1 className="text-3xl font-bold text-primary tracking-tight mb-4 text-center">
            Download Our App
          </h1>
          <p className="text-lg text-primary-dark mb-8 max-w-xs leading-relaxed text-center">
            Choose your preferred format to download the app and enjoy seamless
            access to all of our features.
          </p>

          <div className="flex flex-col items-center justify-center w-full space-y-6">
            <button className="gap-2 flex items-center justify-between px-8 py-4 bg-blue-400 text-white font-semibold rounded-full shadow-md">
              <IoMdDownload className="w-4 h-4" />
              <span className="font-medium">Download PWA</span>
            </button>

            <button className="gap-2 flex items-center justify-between px-8 py-4 bg-green-500 text-white font-semibold rounded-full shadow-md">
              <IoLogoGooglePlaystore className="w-4 h-4" />
              <span className="font-medium">Download APK</span>
            </button>
          </div>

          {/* Mobile Logo Section */}
          <div className="flex flex-col items-center mt-12">
            <img
              src={bgGif}
              alt="Grab Rescue"
              className="w-64 h-5/6 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Download;

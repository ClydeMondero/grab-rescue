import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    setShowScrollUp(window.scrollY > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-black-50 to-gray-50 text-primary-dark">
      <div className="flex-1 py-12 px-6 md:px-12 lg:px-24 mx-auto max-w-screen-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <FaArrowLeft className="mr-2 text-primary-dark" />
            <span className="text-lg font-semibold text-primary-dark">
              Back
            </span>
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary-dark ">
          Terms Of Services
        </h1>
        <p className="text-center text-primary-dark text-sm mb-6">
          Effective Date: November 2024
        </p>

        <div className="space-y-6 md:space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content:
                "By using the GrabRescue app, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the App.",
            },
            {
              title: "3. Scope of Service",
              content:
                "GrabRescue is a web-based mobile application developed to facilitate emergency response services in Bulacan, Philippines, specifically within San Rafael and Bustos for testing purposes. GrabRescue aims to notify the nearest available rescue team about emergencies based on the user's GPS-determined location.",
            },
            {
              title: "4. Limitations of Service",
              content:
                "Device Dependency: GrabRescue requires a mobile device with internet access and GPS capabilities. Emergency notifications depend on the accuracy and speed of your device's location services.\n\nReal-Time Limitations: The app can only determine the user’s initial location; it does not track the user's real-time movement or provide live rescuer tracking.\n\nAccessibility Limitations: GrabRescue may not be accessible to individuals with disabilities or in situations where mobile device use is challenging.",
            },
            {
              title: "3. User Responsibilities",
              content:
                "You agree to use the App solely for emergency reporting and to provide accurate information, including your location and nature of the emergency. Misuse of the App for non-emergency purposes may result in termination of access.",
            },
            {
              title: "5. Privacy and Data Collection",
              content:
                "By using the App, you consent to the collection and use of your location data and other relevant information required for emergency dispatch purposes. This data will be shared with authorized emergency responders and the Municipal Disaster Risk Reduction and Management Office for accurate and efficient emergency assistance.",
            },
            {
              title: "7. Limitation of Liability",
              content:
                "GrabRescue, its developers, and affiliates shall not be liable for any delays, inaccuracies, or interruptions in service resulting from device limitations, network issues, or unforeseen technical failures. The App is a tool to assist in emergency reporting but does not guarantee immediate response or successful rescue.",
            },
            {
              title: "9. Modifications to Terms",
              content:
                "GrabRescue reserves the right to modify these Terms at any time. Users will be notified of significant changes. Continued use of the App following any updates signifies acceptance of the revised Terms.",
            },
            {
              title: "11. Governing Law",
              content:
                "These Terms shall be governed by and construed in accordance with the laws of the Philippines. Republic Act No. 10173 or the Data Privacy Act of 2012 plays a major role in shaping the requirements for Terms and Conditions (T&C), especially concerning data privacy and user consent.",
            },
            {
              title: "13. Contact Information",
              content: (
                <>
                  For questions about these Terms, please email us at{" "}
                  <a
                    href="mailto:grab-rescue.ph@gmail.com"
                    className="text-teal-600 underline hover:text-teal-800"
                  >
                    grab-rescue.ph@gmail.com
                  </a>
                  .
                </>
              ),
            },
            {
              title: "Acknowledgment",
              content:
                "By using GrabRescue, you acknowledge that you have read, understood, and agree to these Terms and Conditions.",
            },
          ].map((section, index) => (
            <section
              key={index}
              className="bg-white p-6 md:p-8 rounded-lg shadow-sm border-t-4 border-primary"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                {section.title}
              </h2>
              <p className="mt-3 text-primary-dark">{section.content}</p>
            </section>
          ))}
        </div>
      </div>

      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover: transition-transform transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default TermsOfService;

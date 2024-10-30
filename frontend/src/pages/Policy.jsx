import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Policy = () => {
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
          Privacy Policy
        </h1>

        <div className="space-y-6 md:space-y-8">
          {[
            {
              title: "1. Information Collected",
              content:
                "We collect information necessary for emergency dispatch, such as location data, contact details, and emergency-related information.",
            },
            {
              title: "2. Use of Information",
              content:
                "Collected data is used exclusively to notify emergency responders and the Municipal Disaster Risk Reduction and Management Office to facilitate prompt response to incidents.",
            },
            {
              title: "3. Data Sharing",
              content:
                "Information is shared only with authorized emergency response teams. We do not share, sell, or disclose user data to third parties outside of emergency-related purposes.",
            },
            {
              title: "4. Data Retention",
              content:
                "Personal information is retained only as long as needed for emergency records or as required by law.",
            },
            {
              title: "5. User Rights",
              content:
                "Users have the right to access, update, or delete their personal information, as outlined by the Data Privacy Act of 2012.",
            },
            {
              title: "6. Data Security",
              content:
                "We employ secure servers and encryption practices to protect user data. However, no security measure is infallible, and we cannot guarantee absolute security.",
            },
            {
              title: "7. Contact Us",
              content: (
                <>
                  For privacy inquiries, please reach out to{" "}
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
              title: "8. Acceptable Use Policy",
              content:
                "GrabRescue is designed for emergency reporting. Misuse of the app for false reporting, prank calls, or non-emergency purposes is prohibited and may result in account suspension or legal action.",
            },
            {
              title: "9. Security Policy",
              content:
                "Only authorized personnel can access user data, which is limited to relevant emergency personnel and administrative staff.",
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
          <FaArrowUp className="" size={20} />
        </button>
      )}
    </div>
  );
};

export default Policy;

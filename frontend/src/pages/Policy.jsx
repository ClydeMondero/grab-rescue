import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
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
    window.location = "/";
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
            <FaChevronLeft className="text-xl mr-2 text-primary-dark" />
            <span className="text-lg font-semibold text-primary-dark">
              Back
            </span>
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary-dark">
          Policy Information
        </h1>

        <div className="space-y-6 md:space-y-8">
          {[
            {
              title: "Privacy Policy",
              sections: [
                {
                  subtitle: "Information Collected",
                  content:
                    "We collect information necessary for emergency dispatch, such as location data, contact details, and emergency-related information.",
                },
                {
                  subtitle: "Use of Information",
                  content:
                    "Collected data is used exclusively to notify emergency responders and the Municipal Disaster Risk Reduction and Management Office to facilitate prompt response to incidents.",
                },
                {
                  subtitle: "Data Sharing",
                  content:
                    "Information is shared only with authorized emergency response teams. We do not share, sell, or disclose user data to third parties outside of emergency-related purposes.",
                },
                {
                  subtitle: "Data Retention",
                  content:
                    "Personal information is retained only as long as needed for emergency records or as required by law.",
                },
                {
                  subtitle: "User Rights",
                  content:
                    "Users have the right to access, update, or delete their personal information, as outlined by the Data Privacy Act of 2012.",
                },
                {
                  subtitle: "Data Security",
                  content:
                    "We employ secure servers and encryption practices to protect user data. However, no security measure is infallible, and we cannot guarantee absolute security.",
                },
                {
                  subtitle: "Contact Us",
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
              ],
            },
            {
              title: "Acceptable Use Policy",
              sections: [
                {
                  subtitle: "Intended Use",
                  content:
                    "Grab Rescue is designed for emergency reporting. Misuse of the app for false reporting, prank calls, or non-emergency purposes is prohibited and may result in account suspension or legal action.",
                },
                {
                  subtitle: "User Conduct",
                  content:
                    "Users are expected to provide accurate information and maintain respectful communication with responders.",
                },
                {
                  subtitle: "Device Requirements",
                  content:
                    "Grab Rescue relies on user devices for location data. Users should ensure their devices are operational and location services are enabled during emergencies.",
                },
                {
                  subtitle: "Prohibited Activities",
                  content:
                    "Unauthorized access, attempting to breach security protocols, or using the app in a manner that disrupts service operations is strictly prohibited.",
                },
                {
                  subtitle: "Consequences of Violation",
                  content:
                    "Violations may result in restricted access, suspension, or termination of service, and users may face legal action. Prank calls to emergency services are addressed under Article 154 of the Revised Penal Code, Anti-Cybercrime Law (RA 10175), and the Disaster Risk Reduction and Management Act (RA 10121). This law penalizes anyone who, without good cause, spreads false information or alarms that may incite panic, disrupt public order, or interfere with government operations, including emergency services.",
                },
              ],
            },
            {
              title: "Security Policy",
              sections: [
                {
                  subtitle: "Access Control",
                  content:
                    "Only authorized personnel can access user data, which is limited to relevant emergency personnel and administrative staff.",
                },
              ],
            },
          ].map((policy, index) => (
            <section
              key={index}
              className="bg-white p-6 md:p-8 rounded-lg shadow-sm border-t-4 border-primary"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4">
                {policy.title}
              </h2>
              {policy.sections.map((section, subIndex) => (
                <div key={subIndex} className="mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary">
                    {section.subtitle}
                  </h3>
                  <p className="mt-2 text-primary-dark">{section.content}</p>
                </div>
              ))}
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

export default Policy;

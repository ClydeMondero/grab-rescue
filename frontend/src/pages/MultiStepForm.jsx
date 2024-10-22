import React, { useEffect, useState } from "react";
import placeholder from "../assets/placeholder.png";
import { updateRequestInFirestore } from "../services/firestoreService";
import { Loader } from "../components";

//TODO: upload picture to firebase storage
const MultiStepForm = ({ request }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    citizenName: "",
    citizenRelation: "",
    incidentPicture: "",
    incidentDescription: "",
  });
  const [required, setRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.phone) {
        setRequired(true);
        return;
      }

      if (formData.phone.length != 11) {
        setRequired(true);
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name == "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        phone: onlyNumbers,
      });
      setRequired(false);
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value, // Handle file input separately
      });
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { id } = request;
      const {
        phone,
        citizenName,
        citizenRelation,
        incidentPicture,
        incidentDescription,
      } = formData;

      updateRequestInFirestore(id, {
        phone,
        citizenName,
        citizenRelation,
        incidentPicture,
        incidentDescription,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
    }

    setTimeout(() => {
      setIsLoading(false);
      setStep(1);
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <label
                className="text-md font-semibold text-text-secondary"
                htmlFor="phone"
              >
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                minLength={11}
                maxLength={11}
                className={`w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 ${
                  required
                    ? "border-secondary focus:ring-secondary "
                    : "border-background-medium focus:ring-primary "
                }`}
              />
              {required && (
                <p className="text-secondary font-semibold">
                  Phone Number is required
                </p>
              )}
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Your Name
              </h2>
              <input
                type="text"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between space-x-4">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Relation to the Victim
              </h2>
              <input
                type="text"
                name="citizenRelation"
                value={formData.citizenRelation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between space-x-4">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Upload Proof of Incident
              </h2>
              <img
                className="w-full h-48 object-cover rounded-lg mt-2"
                src={
                  formData.incidentPicture == ""
                    ? placeholder
                    : URL.createObjectURL(formData.incidentPicture)
                }
                alt="Preview of uploaded image"
              />
              <input
                type="file"
                name="incidentPicture"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100 focus:file:bg-gray-50"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between space-x-4">
                <button
                  className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Description of Incident
              </h2>
              <textarea
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                placeholder="Provide a brief description of the situation"
                style={{ resize: "none" }}
              />
            </div>
            {/*TODO: add privacy and Terms  */}
            <p className="text-xs text-text-secondary">
              By submitting this request, you agree to our{" "}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-text-primary"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-text-primary"
              >
                Terms of Service
              </a>
            </p>
            <div className="flex justify-between space-x-4">
              <button
                className="border text-primary-dark hover:bg-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-1/2"
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <Loader isLoading={isLoading} size={25} />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (request) {
      setFormData({
        ...formData,
        phone: request.phone ?? "",
        citizenName: request.citizenName ?? "",
        citizenRelation: request.citizenRelation ?? "",
        incidentPicture: request.incidentPicture ?? "",
        incidentDescription: request.incidentDescription ?? "",
      });
    }
  }, [request]);

  return (
    <div className="flex-1 w-full bg-white p-6 md:w-1/2">{renderStep()}</div>
  );
};

export default MultiStepForm;

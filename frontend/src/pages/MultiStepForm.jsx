import React, { useEffect, useState } from "react";
import placeholder from "../assets/placeholder.png";
import {
  updateRequestInFirestore,
  getRequestFromFirestore,
} from "../services/firestoreService";
import { Loader } from "../components";
import { getRequestCookie } from "../services/cookieService";

const MultiStepForm = ({ request, setRequest }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    citizenName: "",
    citizenRelation: "",
    incidentPicture: "",
    incidentDescription: "",
    previewImage: placeholder, // Initialize with Firebase URL or placeholder
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

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData((prevData) => ({
        ...prevData,
        phone: onlyNumbers,
      }));
      setRequired(false);
    } else if (name === "incidentPicture" && files && files[0]) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        incidentPicture: file,
        previewImage: URL.createObjectURL(file), // Update preview URL with uploaded file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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

      checkRequest();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }

    setTimeout(() => {
      setIsLoading(false);
      setStep(1);
    }, 2000);
  };

  const checkRequest = async () => {
    const requestId = getRequestCookie();

    console.log(requestId);

    const onGoingRequest = await getRequestFromFirestore(requestId);
    setRequest(onGoingRequest);
  };

  useEffect(() => {
    return () => {
      if (formData.previewImage && formData.previewImage !== placeholder) {
        URL.revokeObjectURL(formData.previewImage);
      }
    };
  }, [formData.previewImage]);

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
                Phone Number (required)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                required
                onChange={handleChange}
                autoComplete="tel"
                minLength={11}
                maxLength={11}
                className={`w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 ${
                  required
                    ? "border-secondary focus:ring-secondary "
                    : "border-background-medium focus:ring-primary "
                }`}
                disabled={request?.phone ? true : false}
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
                Your Name (optional)
              </h2>
              <input
                type="text"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                disabled={request?.citizenName ? true : false}
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
                Relation to the Victim (optional)
              </h2>
              <input
                type="text"
                name="citizenRelation"
                value={formData.citizenRelation}
                onChange={handleChange}
                disabled={request?.citizenRelation ? true : false}
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
                Upload Proof of Incident (optional)
              </h2>
              <img
                className="w-full h-48 object-cover rounded-lg mt-2"
                src={formData.previewImage}
                alt="Preview of uploaded image"
              />
              {!request?.incidentPicture && (
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
              )}
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
                disabled={request?.incidentDescription ? true : false}
              />
            </div>
            <p className="text-xs text-text-secondary">
              By submitting this request, you agree to our{" "}
              <a href="/policies" className="underline text-text-primary">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="terms" className="underline text-text-primary">
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
        previewImage: request.incidentPicture ?? placeholder,
      });
    }
  }, [request]);

  return (
    <div className="flex-1 w-full bg-white p-6 md:w-1/2">{renderStep()}</div>
  );
};

export default MultiStepForm;

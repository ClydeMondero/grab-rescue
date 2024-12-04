import React, { useEffect, useState } from "react";
import placeholder from "../assets/placeholder.png";
import {
  updateRequestInFirestore,
  getRequestFromFirestore,
} from "../services/firestoreService";
import { Loader } from "../components";
import { getRequestCookie } from "../services/cookieService";
import { Link } from "react-router-dom";

const MultiStepForm = ({ request, setRequest }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    citizenRelation: "",
    incidentPicture: "",
    incidentDescription: "",
    previewImage: placeholder,
  });
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "incidentPicture" && files && files[0]) {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        incidentPicture: file,
        previewImage: URL.createObjectURL(file),
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
      const { citizenRelation, incidentPicture, incidentDescription } =
        formData;

      updateRequestInFirestore(id, {
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
                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg transition duration-300 h-12 w-full"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
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
      case 3:
        return (
          <div className="h-full flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold text-text-secondary">
                Description of Incident (optional)
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
              <Link
                to="/privacy-policy"
                className="underline text-text-primary"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms-of-service"
                className="underline text-text-primary"
              >
                Terms of Service
              </Link>
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

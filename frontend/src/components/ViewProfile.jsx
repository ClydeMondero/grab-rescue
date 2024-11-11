import { useState, useEffect, useContext } from "react";
import { FaChevronLeft, FaSave, FaEdit, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { createAuthHeader } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "../components";
import { barangaysData } from "../constants/Barangays";
import { Loader } from "../components";
import { RescuerContext } from "../contexts/RescuerContext";

const ViewProfile = (props) => {
  const navigate = useNavigate();
  const { user } = props;
  const [profile, setProfile] = useState(user);
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const setPage =
    user.account_type === "Rescuer" ? useContext(RescuerContext).setPage : null;

  // Extract municipalities from barangaysData
  const municipalities = Object.keys(barangaysData);

  useEffect(() => {
    calculateAge(profile.birthday);
  }, [profile]);

  // Function to calculate age based on birthday
  const calculateAge = (birthday) => {
    if (!birthday) return;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setAge(age);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    if (name === "birthday") calculateAge(value); // Update age on birthday change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authHeader = createAuthHeader();
      const response = await (
        await axios.put(`/users/update/${profile.id}`, profile, {
          headers: {
            ...authHeader,
            "Content-Type": "application/json",
          },
        })
      ).data;

      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="flex-1 p-6 h-full to-background-light">
        <div className="w-full items-center gap-4 mb-6 hidden md:flex border-b-2 pb-2 border-gray-200">
          <FaChevronLeft
            className="text-background-dark text-2xl cursor-pointer "
            onClick={() => {
              navigate(`/${user.account_type.toLowerCase()}`);
              setPage("Navigate");
            }}
          />
          <p className="text-3xl text-primary-dark font-bold">Your Profile</p>
        </div>

        {/* Main Profile Container */}
        <div className="w-full flex items-center justify-center md:flex-row gap-4">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-[#557C55] mb-2">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 gap-2 text-sm text-primary-dark mt-3">
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  Username:
                </span>
                <p className="ml-2">{profile.username}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  First Name:
                </span>
                <p className="ml-2">{profile.first_name}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  Middle Name:
                </span>
                <p className="ml-2">{profile.middle_name}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  Last Name:
                </span>
                <p className="ml-2">{profile.last_name}</p>
              </div>
              {user.account_type === "Admin" && (
                <>
                  <div className="flex items-center py-1 border-b border-gray-300">
                    <span className="font-semibold text-primary-dark">
                      Municipality:
                    </span>
                    <p className="ml-2">{profile.municipality}</p>
                  </div>
                  <div className="flex items-center py-1 border-b border-gray-300">
                    <span className="font-semibold text-primary-dark">
                      Barangay:
                    </span>
                    <p className="ml-2">{profile.barangay}</p>
                  </div>
                </>
              )}
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  Contact Number:
                </span>
                <p className="ml-2">{profile.contact_number}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">
                  Birthday:
                </span>
                <p className="ml-2">
                  {profile.birthday
                    ? new Date(profile.birthday).toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-300">
                <span className="font-semibold text-primary-dark">Age:</span>
                <p className="ml-2">{age || "N/A"}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#557C55] text-white px-6 py-4 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition"
              >
                <div className="flex items-center gap-2">
                  <FaEdit className="mr-1 text-sm" />
                  Edit Profile
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="relative bg-white p-4 w-full md:w-2/3 lg:w-1/2 max-h-[500px] overflow-y-auto rounded-lg shadow-lg">
              <FaTimes
                className="text-lg absolute top-4 right-4 text-[#557C55] hover:text-gray-700 cursor-pointer"
                onClick={() => setIsEditing(false)}
              />
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-[#557C55]" />
                <h4 className="text-lg font-bold text-[#557C55]">
                  Edit Profile
                </h4>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile?.username || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-xs font-semibold text-[#557C55]"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profile?.first_name || ""}
                        onChange={handleProfileChange}
                        className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="middle_name"
                        className="block text-xs font-semibold text-[#557C55]"
                      >
                        Middle Name
                      </label>
                      <input
                        type="text"
                        id="middle_name"
                        name="middle_name"
                        value={profile?.middle_name || ""}
                        onChange={handleProfileChange}
                        className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-xs font-semibold text-[#557C55]"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profile?.last_name || ""}
                        onChange={handleProfileChange}
                        className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                      />
                    </div>
                  </div>
                  {user.account_type === "Admin" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="municipality"
                          className="block text-xs font-semibold text-[#557C55]"
                        >
                          Municipality
                        </label>
                        <select
                          id="municipality"
                          name="municipality"
                          value={profile?.municipality || ""}
                          onChange={handleProfileChange}
                          className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                        >
                          <option value="">Select Municipality</option>
                          {municipalities.map((municipality) => (
                            <option key={municipality} value={municipality}>
                              {municipality}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="barangay"
                          className="block text-xs font-semibold text-[#557C55]"
                        >
                          Barangay
                        </label>
                        <select
                          id="barangay"
                          name="barangay"
                          value={profile?.barangay || ""}
                          onChange={handleProfileChange}
                          className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                        >
                          <option value="">Select Barangay</option>
                          {barangaysData[profile?.municipality || ""]?.map(
                            (barangay) => (
                              <option key={barangay} value={barangay}>
                                {barangay}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="contact_number"
                    name="contact_number"
                    value={profile?.contact_number || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-xs font-semibold text-[#557C55]"
                  >
                    Birthday:
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={profile?.birthday || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 border rounded-md bg-gray-100 border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#557C55] transition"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#557C55] text-white px-6 py-4 rounded-md text-xs font-semibold hover:bg-[#6EA46E] transition"
                  >
                    {loading ? (
                      <Loader isLoading={loading} size={20} color="#fff" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <FaSave className="mr-1" /> Save
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Toast />
      </div>
    </>
  );
};

export default ViewProfile;

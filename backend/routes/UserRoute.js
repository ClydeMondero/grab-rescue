const router = require("express").Router();
const {
  GetUsers,
  GetUser,
  VerifyEmail,
  RequestPasswordReset,
  ResetPassword,
  UpdateUser,
  UpdateUserEmail,
  UpdateUserPassword,
  UploadProfileImage, // Import the new handler
} = require("../controllers/UserController");
const { upload, handleMulterError } = require("../utils/fileUpload"); // Import upload middleware

// Get users route
router.get("/get", GetUsers);

// Get user route
router.get("/get/:id", GetUser);

// Verify email route
router.put("/verify/:token", VerifyEmail);

// Request password reset route
router.post("/forgot-password", RequestPasswordReset);

// Reset password route
router.post("/reset-password/:token", ResetPassword);

// Update user route
router.put("/update/:id", UpdateUser);

// Update user email route
router.put("/updateEmail/:id", UpdateUserEmail);

// Update user password route
router.put("/updatePassword/:id", UpdateUserPassword);

// Upload profile image route
router.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  handleMulterError,
  UploadProfileImage
);

module.exports = router;

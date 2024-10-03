const router = require("express").Router();
const {
  GetUsers,
  VerifyEmail,
  RequestPasswordReset,
  ResetPassword,
  ShowResetPasswordForm, // Import the new method
} = require("../controllers/UserController");

// Get users route
router.get("/get", GetUsers);

// Verify email route
router.put("/verify/:token", VerifyEmail);

// Request password reset route
router.post("/forgot-password", RequestPasswordReset);

// Show reset password form route
router.get("/reset-password/:token", ShowResetPasswordForm); // New route for the form

// Reset password route
router.post("/reset-password/:token", ResetPassword);

module.exports = router;

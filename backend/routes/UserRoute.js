const router = require("express").Router();
const {
  GetUsers,
  VerifyEmail,
  RequestPasswordReset,
  ResetPassword,
} = require("../controllers/UserController");

// Get users route
router.get("/get", GetUsers);

// Verify email route
router.put("/verify/:token", VerifyEmail);

// Request password reset route
router.post("/forgot-password", RequestPasswordReset);

// Reset password route
router.post("/reset-password/:token", ResetPassword);

module.exports = router;

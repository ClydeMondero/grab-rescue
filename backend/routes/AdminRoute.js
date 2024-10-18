// AdminRoute.js
const router = require("express").Router();
const {
  CreateAdmin,
  GetAdmins,
  GetAdmin,
} = require("../controllers/AdminController");

// Consider adding the image upload middleware if needed
router.post(
  "/create",
  upload.single("profileImage"),
  handleMulterError,
  CreateAdmin
);
router.get("/get", GetAdmins);
router.get("/get/:id", GetAdmin);

module.exports = router;

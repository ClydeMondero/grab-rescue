// routes/AdminRoute.js
const router = require("express").Router();
const {
  CreateAdmin,
  GetAdmins,
  GetAdmin,
} = require("../controllers/AdminController");

const { upload, handleMulterError } = require("../utils/fileUpload");

// Route to create admin
router.post(
  "/create",
  upload.single("profileImage"),
  handleMulterError,
  CreateAdmin
);

router.get("/get", GetAdmins);
router.get("/get/:id", GetAdmin);

module.exports = router;

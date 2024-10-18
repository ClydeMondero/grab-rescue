// routes/RescuerRoute.js
const router = require("express").Router();
const {
  CreateRescuer,
  GetRescuers,
  GetRescuer,
} = require("../controllers/RescuerController");

const { upload, handleMulterError } = require("../utils/fileUpload");

// Route to create rescuer with profile image upload
router.post(
  "/create",
  upload.single("profileImage"),
  handleMulterError,
  CreateRescuer
);

router.get("/get", GetRescuers);
router.get("/get/:id", GetRescuer);

module.exports = router;

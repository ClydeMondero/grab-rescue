// RescuerRoute.js
const router = require("express").Router();
const {
  CreateRescuer,
  GetRescuers,
  GetRescuer,
} = require("../controllers/RescuerController");

// Consider adding the image upload middleware if needed
router.post(
  "/create",
  upload.single("profileImage"),
  handleMulterError,
  CreateRescuer
);
router.get("/get", GetRescuers);
router.get("/get/:id", GetRescuer);

module.exports = router;

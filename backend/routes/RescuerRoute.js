// routes/RescuerRoute.js
const router = require("express").Router();
const {
  CreateRescuer,
  GetRescuers,
  GetRescuer,
} = require("../controllers/RescuerController");

// Route to create rescuer
router.post("/create", CreateRescuer);

router.get("/get", GetRescuers);
router.get("/get/:id", GetRescuer);

module.exports = router;

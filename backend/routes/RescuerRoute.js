const router = require("express").Router();
const { CreateRescuer } = require("../controllers/RescuerController");
const { GetRescuers } = require("../controllers/RescuerController");
const { GetRescuer } = require("../controllers/RescuerController");
const { UpdateRescuer } = require("../controllers/RescuerController");
const { UpdateRescuerEmail } = require("../controllers/RescuerController");
const { UpdateRescuerPassword } = require("../controllers/RescuerController");

router.post("/create", CreateRescuer);
router.get("/get", GetRescuers);
router.get("/get/:id", GetRescuer);
router.put("/update/:id", UpdateRescuer);
router.put("/updateEmail/:id", UpdateRescuerEmail);
router.put("/updatePassword/:id", UpdateRescuerPassword);

module.exports = router;

const router = require("express").Router();
const { CreateRescuer } = require("../controllers/RescuerController");
const { GetRescuers } = require("../controllers/RescuerController");
const { GetRescuer } = require("../controllers/RescuerController");

router.post("/create", CreateRescuer);
router.get("/get", GetRescuers);
router.get("/get/:id", GetRescuer);

module.exports = router;

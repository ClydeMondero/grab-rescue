// routes/RescuerRoute.js
const router = require("express").Router();
const { RegisterCitizen } = require("../controllers/CitizenController");

router.post("/register", RegisterCitizen);

module.exports = router;

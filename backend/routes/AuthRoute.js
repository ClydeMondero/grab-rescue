const router = require("express").Router();
const { Login } = require("../controllers/AuthController");

router.post("/login", Login);

module.exports = router;

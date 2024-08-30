const router = require("express").Router();
const { Login } = require("../controllers/AuthController");
const { UserVerification } = require("../middlewares/AuthMiddleware");

router.post("/", UserVerification);
router.post("/login", Login);

module.exports = router;

const router = require("express").Router();
const { Login, Logout } = require("../controllers/AuthController");
const { UserVerification } = require("../middlewares/AuthMiddleware");

router.post("/", UserVerification);
router.post("/login", Login);
router.post("/logout", Logout);

module.exports = router;

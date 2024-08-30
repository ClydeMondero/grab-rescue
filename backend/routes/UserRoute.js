const router = require("express").Router();
const { CreateUser } = require("../controllers/UserController");

router.post("/create", CreateUser);

module.exports = router;

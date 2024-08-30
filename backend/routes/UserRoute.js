const { CreateUser } = require("../controllers/UserController");
const router = require("express").Router();

router.post("/create", CreateUser);

module.exports = router;

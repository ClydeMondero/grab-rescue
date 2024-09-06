const router = require("express").Router();
const { CreateUser } = require("../controllers/UserController");
const { GetUsers } = require("../controllers/UserController");

router.post("/create", CreateUser);
router.get("/get", GetUsers);

module.exports = router;

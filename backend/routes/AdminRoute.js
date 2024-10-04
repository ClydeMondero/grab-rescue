const router = require("express").Router();
const { CreateAdmin } = require("../controllers/AdminController");
const { GetAdmins } = require("../controllers/AdminController");
const { GetAdmin } = require("../controllers/AdminController");

router.post("/create", CreateAdmin);
router.get("/get", GetAdmins);
router.get("/get/:id", GetAdmin);
module.exports = router;

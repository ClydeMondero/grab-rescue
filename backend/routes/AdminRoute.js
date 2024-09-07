const router = require("express").Router();
const { CreateAdmin } = require("../controllers/AdminController");
const { GetAdmins } = require("../controllers/AdminController");
const { GetAdmin } = require("../controllers/AdminController");
const { UpdateAdmin } = require("../controllers/AdminController");
const { UpdateAdminEmail } = require("../controllers/AdminController");

router.post("/create", CreateAdmin);
router.get("/get", GetAdmins);
router.get("/get/:id", GetAdmin);
router.put("/update/:id", UpdateAdmin);
router.put("/updateEmail/:id", UpdateAdminEmail);
module.exports = router;
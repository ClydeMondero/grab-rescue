// routes/AdminRoute.js
const router = require("express").Router();
const {
  CreateAdmin,
  GetAdmins,
  GetAdmin,
} = require("../controllers/AdminController");

// Route to create admin
router.post("/create", CreateAdmin);

router.get("/get", GetAdmins);
router.get("/get/:id", GetAdmin);

module.exports = router;

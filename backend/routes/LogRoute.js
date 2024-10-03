const router = require("express").Router();
const { CreateLog } = require("../controllers/LogController");

router.post("/create", CreateLog);

module.exports = router;

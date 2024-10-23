const express = require("express");
const { CreateLog, GetLogs } = require("../controllers/LogController");
const router = express.Router();

// Route for creating a log entry
router.post("/create", async (req, res) => {
  const { userId, action } = req.body;

  if (!userId || !action) {
    return res
      .status(400)
      .json({ success: false, message: "userId and action are required." });
  }

  const result = await CreateLog({ userId, action });
  res.status(200).json(result);
});

// Route for retrieving logs with optional action and account_type filtering
router.get("/get", async (req, res) => {
  const actionQuery = req.query.action; // Get action filters from the query string
  const accountTypeQuery = req.query.account_type; // Get account_type filters from the query string

  const actionFilters = actionQuery
    ? actionQuery.split(",").map((action) => action.trim())
    : [];

  const accountTypeFilters = accountTypeQuery
    ? accountTypeQuery.split(",").map((type) => type.trim())
    : [];

  const result = await GetLogs(actionFilters, accountTypeFilters);
  res.status(200).json(result);
});

module.exports = router;

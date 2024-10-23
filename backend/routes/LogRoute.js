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
  try {
    const { account_type, action, start_date, end_date } = req.query;

    // Split action filters by comma, since multiple actions might be selected
    const actionFilters = action ? action.split(",") : [];
    const accountTypeFilters = account_type ? [account_type] : [];

    const logs = await LogController.GetLogs(
      actionFilters,
      accountTypeFilters,
      start_date || null,
      end_date || null
    );

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving logs.",
    });
  }
});

module.exports = router;

const db = require("../config/db");
const bcrypt = require("bcrypt");

const { createSecretToken } = require("../utils/SecretToken");
const { CreateLog } = require("./LogController");

module.exports.Login = async (req, res) => {
  const { email, password, role } = req.body;

  // Get the user from the database
  const q =
    "SELECT * FROM users WHERE (email = $1 OR username = $1) AND verified = true";
  db.query(q, [email], async (err, data) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message: "Database error.",
        error: err.message,
      });
    }

    if (data.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Email does not exist or is not verified.",
      });
    }

    const [userData] = data.rows;

    // Check if the user is inactive
    if (userData.status === "Inactive") {
      return res.status(200).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    if (userData.is_online) {
      return res
        .status(200)
        .json({ success: false, message: "User is already online." });
    }

    if (userData.account_type !== role) {
      return res
        .status(200)
        .json({ success: false, message: "Role is not valid." });
    }

    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid password." });
    }

    const updateQuery = "UPDATE users SET is_online = true WHERE id = $1";
    db.query(updateQuery, [userData.id], async (err) => {
      if (err) {
        return res
          .status(200)
          .json({ success: false, message: "Failed to update online status." });
      }

      // Log the login action
      const logResult = await CreateLog({
        userId: userData.id,
        action: "User logged in", // You can customize this message
      });

      if (!logResult.success) {
        console.error("Failed to create log:", logResult.message);
      }

      const token = createSecretToken(userData.id);
      res.cookie("token", token, {
        withCredentials: true,
        secure: true,
        sameSite: "none",
        httpOnly: false,
      });

      delete userData.password; // Remove password from userData
      return res.status(200).json({
        success: true,
        message: "Logged In Success!",
        role: userData.account_type,
      });
    });
  });
};

module.exports.Logout = async (req, res) => {
  const { id } = req.body;

  // Update the user to be offline
  const updateQuery = "UPDATE users SET is_online = false WHERE id = $1";
  db.query(updateQuery, [id], async (err) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Logout failed." });
    }

    // Log the logout action
    const logResult = await CreateLog({
      userId: id,
      action: "User logged out",
    });

    if (!logResult.success) {
      console.error("Failed to create log:", logResult.message);
    }

    // Clear the cookie after updating the user's online status
    res.clearCookie("token");

    return res
      .status(200)
      .json({ success: true, message: "Logged Out Success!" });
  });
};

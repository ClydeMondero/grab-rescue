const db = require("../config/db");
const bcrypt = require("bcrypt");

const { createSecretToken } = require("../utils/SecretToken");

module.exports.Login = async (req, res) => {
  // Get the username and password from the request body
  const { email, password } = req.body;

  // Get the user from the database
  const q = "SELECT * FROM users WHERE email = ? AND verified = true";
  db.query(q, [email], (err, data) => {
    if (err)
      return res.status(200).json({
        success: false,
        message: "Database error",
        error: err.message,
      });

    // If the user does not exist or is not verified, return an error
    if (data.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Email does not exist or is not verified",
      });
    }

    // Get the user data from the database
    const [userData] = data;

    // Check if the user is already online
    if (userData.is_online) {
      return res
        .status(200)
        .json({ success: false, message: "User is already online" });
    }

    // Check if the password is valid
    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid password" });
    }

    // Update the user to be online
    const updateQuery = "UPDATE users SET is_online = true WHERE id = ?";
    db.query(updateQuery, [userData.id], (err) => {
      if (err)
        return res
          .status(200)
          .json({ success: false, message: "Failed to update online status" });

      const token = createSecretToken(userData.id);

      res.cookie("token", token, {
        withCredentials: true,
        secure: true,
        sameSite: "none",
        httpOnly: false,
      });

      // Remove the password from the user data and return it
      delete userData.password;
      return res
        .status(200)
        .json({ success: true, message: "Logged In Success!" });
    });
  });
};

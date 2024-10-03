const pool = require("../config/db");
const env = require("../config/env");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Get Users with Filtering and Name Search (Rescuers and Admins)
module.exports.GetUsers = async (req, res) => {
  let q = `
    SELECT id, first_name, middle_initial, last_name, municipality, barangay, contact_number, 
    is_online, verified, account_type FROM users WHERE 1=1
  `;

  const queryParams = [];

  if (req.query.account_type) {
    q += " AND account_type = $1";
    queryParams.push(req.query.account_type);
  } else {
    q += " AND (account_type = 'Rescuer' OR account_type = 'Admin')";
  }

  if (req.query.municipality) {
    q += " AND municipality = $2";
    queryParams.push(req.query.municipality);
  }

  if (req.query.barangay) {
    q += " AND barangay = $3";
    queryParams.push(req.query.barangay);
  }

  if (req.query.is_online) {
    q += " AND is_online = $4";
    queryParams.push(req.query.is_online);
  }

  if (req.query.keyword) {
    q += " AND (first_name ILIKE $5 OR last_name ILIKE $6)";
    const keyword = `%${req.query.keyword}%`;
    queryParams.push(keyword, keyword);
  }

  try {
    const { rows } = await pool.query(q, queryParams);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Verify Email
module.exports.VerifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Query to get the user based on the verification token
    const q = "SELECT * FROM users WHERE verification_token = $1";
    const { rows } = await pool.query(q, [token]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { pending_email: newEmail, id, verified } = rows[0];

    // If the user is not verified yet, this is a new user email verification
    if (!verified) {
      // Verify the email by setting `verified = true`, clear the token
      const updateQuery = `
        UPDATE users
        SET verified = true, verification_token = NULL
        WHERE id = $1
      `;
      await pool.query(updateQuery, [id]);

      return res
        .status(200)
        .json({ message: "New user email verified successfully." });
    }

    // If the user is already verified but there's a pending email, it's an email change verification
    if (newEmail) {
      const updateQuery = `
        UPDATE users
        SET email = $1, pending_email = NULL, verification_token = NULL
        WHERE id = $2
      `;
      await pool.query(updateQuery, [newEmail, id]);

      return res
        .status(200)
        .json({ message: "Email change verified and updated successfully." });
    }

    // Fallback case: no pending email or verification case
    return res.status(400).json({
      error: "No email change pending or invalid verification request.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Request Password Reset
module.exports.RequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists and if it is verified
    const q = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(q, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No user found with that email" });
    }

    const user = rows[0];

    if (!user.verified) {
      return res.status(400).json({ error: "Email address not verified" });
    }

    // Generate a reset password token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    // Update the user's reset password token and expiration time
    const updateQuery =
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3";
    const expires = new Date(Date.now() + 3600000);
    await pool.query(updateQuery, [resetPasswordToken, expires, email]);

    // Get the dynamic base URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Email options
    const mailOptions = {
      from: "bhenzmharlbartolome012603@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Please click the following link to reset your password: ${baseUrl}/users/reset-password/${resetPasswordToken}`,
    };

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhenzmharlbartolome012603@gmail.com",
        pass: "owvb wzni fhxu cvbz",
      },
    });

    // Send the email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to send reset password email" });
      }
      return res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Reset Password
module.exports.ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  try {
    const q =
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2";
    const { rows } = await pool.query(q, [token, new Date()]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = rows[0];
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const updateQuery =
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2";
    await pool.query(updateQuery, [hashedPassword, user.id]);

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Show Reset Password Form
module.exports.ShowResetPasswordForm = async (req, res) => {
  const { token } = req.params;

  // You can validate the token if needed, but for now, just render the form
  res.send(`
    <form action="/users/reset-password/${token}" method="POST">
      <label for="newPassword">New Password:</label>
      <input type="password" id="newPassword" name="newPassword" required>
      <br>
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" id="confirmPassword" name="confirmPassword" required>
      <br>
      <button type="submit">Reset Password</button>
    </form>
  `);
};

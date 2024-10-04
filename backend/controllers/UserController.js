const pool = require("../config/db");
const env = require("../config/env");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Get Users with Filtering and Name Search (Rescuers and Admins)
module.exports.GetUsers = async (req, res) => {
  let q = `
    SELECT id, first_name, middle_initial, last_name, to_char(birthday, 'YYYY-MM-DD') AS birthday, municipality, barangay, contact_number, username,
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

module.exports.GetUser = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, middle_initial, last_name, to_char(birthday, 'YYYY-MM-DD') AS birthday, municipality, barangay, contact_number, username, is_online, verified, account_type FROM users WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update User
module.exports.UpdateUser = async (req, res) => {
  const {
    first_name: firstName,
    middle_initial: middleInitial,
    last_name: lastName,
    birthday,
    municipality,
    barangay,
    contact_number: contactNumber,
    username: newUsername,
  } = req.body;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !birthday ||
    !municipality ||
    !barangay ||
    !contactNumber ||
    !newUsername
  ) {
    return res.status(200).json({ error: "Please fill in all fields" });
  }

  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );
  const MIN_AGE = 18;

  if (age < MIN_AGE) {
    return res.status(200).json({
      error: `You must be at least ${MIN_AGE} years old to register.`,
    });
  }

  try {
    // Check if the user exists
    const userQuery = `SELECT username FROM users WHERE id = $1`;
    const { rows: existingUsers } = await pool.query(userQuery, [
      req.params.id,
    ]);

    if (existingUsers.length === 0) {
      return res.status(200).json({ error: "User does not exist" });
    }

    const oldUsername = existingUsers[0].username;

    if (newUsername && newUsername !== oldUsername) {
      // Check if new username is already taken
      const usernameQuery =
        "SELECT * FROM users WHERE username = $1 AND username != $2";
      const { rows: usernameRows } = await pool.query(usernameQuery, [
        newUsername,
        oldUsername,
      ]);

      if (usernameRows.length > 0) {
        return res.status(200).json({ error: "Username is already taken" });
      }
    }

    // Update the user in the database without email and password, including age
    const updateQuery = `
      UPDATE users SET first_name = $1, middle_initial = $2, last_name = $3, birthday = $4, age = $5,
      municipality = $6, barangay = $7, contact_number = $8, username = $9 WHERE id = $10
    `;
    const values = [
      firstName,
      middleInitial,
      lastName,
      birthday,
      age,
      municipality,
      barangay,
      contactNumber,
      newUsername,
      req.params.id,
    ];

    await pool.query(updateQuery, values);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update User Email
module.exports.UpdateUserEmail = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ error: "Please enter an email" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Fetch the user's current data from the database
    const q = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const { email: oldEmail, pending_email: pendingEmail } = rows[0];

    // Check if the new email is the same as the current or pending email
    if (email === oldEmail || email === pendingEmail) {
      return res
        .status(200)
        .json({ message: "The email is the same. No changes made." });
    }

    // Check if the new email is already taken by another user
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Update the pending email and verification token in the database
    const updateQuery = `
      UPDATE users
      SET pending_email = $1, verification_token = $2
      WHERE id = $3
    `;
    await pool.query(updateQuery, [email, verificationToken, id]);

    // Use frontend base URL for the verification link
    const verificationLink = `${process.env.SITE_URL}/verify/${verificationToken}`;

    // Send a verification email to the new email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhenzmharlbartolome012603@gmail.com",
        pass: "owvb wzni fhxu cvbz",
      },
    });

    const mailOptions = {
      from: "bhenzmharlbartolome012603@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your new email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error while sending email:", err);
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      } else {
        return res.status(200).json({
          message: "Verification email sent. Please check your new email.",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update User Password
module.exports.UpdateUserPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const id = req.params.id;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Please fill in all password fields" });
  }

  // Check if new password matches confirm password
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  try {
    // Fetch the user's current password from the database
    const q = "SELECT password FROM users WHERE id = $1";
    const { rows } = await pool.query(q, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const { password: hashedPassword } = rows[0];

    // Compare the current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    const updateQuery = `
      UPDATE users 
      SET password = $1 
      WHERE id = $2
    `;
    await pool.query(updateQuery, [newHashedPassword, id]);

    return res.status(200).json({ message: "Password updated successfully" });
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
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    await pool.query(updateQuery, [resetPasswordToken, expires, email]);

    const resetLink = `${process.env.SITE_URL}/reset-password/${resetPasswordToken}`;

    // Email options
    const mailOptions = {
      from: "bhenzmharlbartolome012603@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhenzmharlbartolome012603@gmail.com",
        pass: "owvb wzni fhxu cvbz", // Consider using environment variables for sensitive data
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

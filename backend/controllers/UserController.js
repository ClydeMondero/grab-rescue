const pool = require("../config/db");
const env = require("../config/env");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const zxcvbn = require("zxcvbn");
const { CreateLog } = require("./LogController");

// Get Users with Filtering and Name Search (Rescuers and Admins)
module.exports.GetUsers = async (req, res) => {
  let q = `
    SELECT id, first_name, middle_initial, last_name, to_char(birthday, 'YYYY-MM-DD') AS birthday, municipality, barangay, profile_image, contact_number, username,
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
    return res.status(200).json({ error: err.message });
  }
};

// Get User
module.exports.GetUser = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, middle_initial, last_name, to_char(birthday, 'YYYY-MM-DD') AS birthday, municipality, barangay, profile_image, contact_number, username, is_online, verified, account_type FROM users WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(200).json({ error: "User not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(200).json({ error: err.message });
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
  const missingFields = [];

  if (!firstName) missingFields.push("First Name");
  if (!lastName) missingFields.push("Last Name");
  if (!birthday) missingFields.push("Birthday");
  if (!municipality) missingFields.push("Municipality");
  if (!barangay) missingFields.push("Barangay");
  if (!contactNumber) missingFields.push("Contact Number");
  if (!newUsername) missingFields.push("Username");

  if (missingFields.length > 0) {
    return res.status(200).json({
      success: false,
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  // Username length validation
  const MIN_USERNAME_LENGTH = 6;
  const MAX_USERNAME_LENGTH = 15;

  if (newUsername.length < MIN_USERNAME_LENGTH) {
    return res.status(200).json({
      success: false,
      message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
    });
  }

  if (newUsername.length > MAX_USERNAME_LENGTH) {
    return res.status(200).json({
      success: false,
      message: `Username must be no more than ${MAX_USERNAME_LENGTH} characters long.`,
    });
  }

  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );
  const MIN_AGE = 18;

  if (age < MIN_AGE) {
    return res.status(200).json({
      success: false,
      message: `You must be at least ${MIN_AGE} years old to update your account. You are currently ${age} years old.`,
    });
  }

  try {
    // Check if the user exists
    const userQuery = `SELECT * FROM users WHERE id = $1`;
    const { rows: existingUsers } = await pool.query(userQuery, [
      req.params.id,
    ]);

    if (existingUsers.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User does not exist.",
      });
    }

    const oldUserData = existingUsers[0];
    const updates = [];
    const newUserData = {
      first_name: firstName,
      middle_initial: middleInitial,
      last_name: lastName,
      birthday,
      municipality,
      barangay,
      contact_number: contactNumber,
      username: newUsername,
      age, // Include age for update
    };

    // Check for changes
    for (const [key, newValue] of Object.entries(newUserData)) {
      const oldValue = oldUserData[key];

      if (key === "birthday" && newValue !== oldValue) {
        // Format the old and new birthdays to include month, day, and year
        const oldBirthdayFormatted = new Date(oldValue).toLocaleDateString(
          "en-US",
          { month: "2-digit", day: "2-digit", year: "numeric" }
        );
        const newBirthdayFormatted = new Date(newValue).toLocaleDateString(
          "en-US",
          { month: "2-digit", day: "2-digit", year: "numeric" }
        );
        updates.push(
          `Birthday changed from ${oldBirthdayFormatted} to ${newBirthdayFormatted}`
        );
      } else if (newValue && newValue !== oldValue) {
        updates.push(
          `${key.replace(/_/g, " ")} changed from ${oldValue} to ${newValue}`
        );
      }
    }

    // If there are no updates, return a message
    if (updates.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No changes detected.",
      });
    }

    // Update the user in the database
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

    // Log the changes
    await CreateLog({
      userId: req.params.id,
      action: `User updated: ${updates.join(", ")}.`,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

// Update User Email
module.exports.UpdateUserEmail = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(200).json({
      success: false,
      message: "Please enter an email",
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({
      success: false,
      message: "Invalid email format",
    });
  }

  try {
    // Fetch the user's current data from the database
    const q = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(q, [id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User does not exist",
      });
    }

    const { email: oldEmail, pending_email: pendingEmail } = rows[0];

    // Check if the new email is the same as the current or pending email
    if (email === oldEmail || email === pendingEmail) {
      return res.status(200).json({
        success: false,
        message: "The email is the same. No changes made.",
      });
    }

    // Check if the new email is already taken by another user
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Email is already taken",
      });
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

    // Log the email update action
    await CreateLog({
      userId: id,
      action: `User changed email from ${oldEmail} to ${email}.`,
    });

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
        return res.status(200).json({
          success: false,
          message: "Failed to send verification email",
          error: err.message,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Verification email sent. Please check your new email.",
        });
      }
    });
  } catch (err) {
    // Log the error
    await CreateLog({
      userId: id,
      action: `Error updating email: ${err.message}`,
    });

    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

// Update User Password
module.exports.UpdateUserPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const id = req.params.id;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(200).json({
      success: false,
      message: "Please provide all passwords.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(200).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  // Check password length
  if (newPassword.length < 8) {
    return res.status(200).json({
      success: false,
      message: "Password must be at least 8 characters.",
    });
  }

  // Check password strength using zxcvbn
  const passwordStrength = zxcvbn(newPassword);
  if (passwordStrength.score < 3) {
    return res.status(200).json({
      success: false,
      message: "Password is too weak.",
    });
  }

  // Check for required character types (uppercase, lowercase, number, special character)
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return res.status(200).json({
      success: false,
      message:
        "Password must include at least one uppercase, lowercase, number, and special character.",
    });
  }

  try {
    // Fetch the user's current password from the database
    const q = "SELECT password FROM users WHERE id = $1";
    const { rows } = await pool.query(q, [id]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User does not exist.",
      });
    }

    const { password: hashedPassword } = rows[0];

    // Compare the current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Check if the new password is the same as the old one
    const isNewPasswordSameAsOld = await bcrypt.compare(
      newPassword,
      hashedPassword
    );
    if (isNewPasswordSameAsOld) {
      return res.status(200).json({
        success: false,
        message: "New password cannot be the same as old password.",
      });
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

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
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
      return res.status(200).json({
        success: false,
        message: "Invalid or expired token.",
      });
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

      // Log successful verification for a new user
      await CreateLog({
        userId: id,
        action: "New user email verified successfully.",
      });

      return res.status(200).json({
        success: true,
        message: "New user email verified successfully.",
      });
    }

    // If the user is already verified but there's a pending email, it's an email change verification
    if (newEmail) {
      const updateQuery = `
        UPDATE users
        SET email = $1, pending_email = NULL, verification_token = NULL
        WHERE id = $2
      `;
      await pool.query(updateQuery, [newEmail, id]);

      // Log successful email change verification
      await CreateLog({
        userId: id,
        action: `Email change verified and updated from ${rows[0].email} to ${newEmail}.`,
      });

      return res.status(200).json({
        success: true,
        message: "Email change verified and updated successfully.",
      });
    }

    // Fallback case: no pending email or verification case
    return res.status(200).json({
      success: false,
      message: "No email change pending or invalid verification request.",
    });
  } catch (err) {
    // Log the error
    await CreateLog({
      userId: null,
      action: `Error verifying email: ${err.message}`,
    }); // User ID can be null since it might not be valid in case of error

    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

// Request Password Reset
module.exports.RequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  try {
    // Check if the email exists and if it is verified
    const q = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(q, [email]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No user found with that email.",
      });
    }

    const user = rows[0];

    if (!user.verified) {
      return res.status(200).json({
        success: false,
        message: "Email address not verified.",
      });
    }

    // Generate a reset password token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    // Update the user's reset password token and expiration time
    const updateQuery =
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3";
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    await pool.query(updateQuery, [resetPasswordToken, expires, email]);

    const resetLink = `${process.env.SITE_URL}/reset-password/${resetPasswordToken}`;

    // Log the password reset request with user ID
    const logResult = await CreateLog({
      userId: user.id, // Use user.id here
      action: "Requested password reset",
    });

    if (!logResult.success) {
      console.error("Failed to create log:", logResult.message);
    }

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
        pass: "owvb wzni fhxu cvbz",
      },
    });

    // Send the email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        // Log the error
        CreateLog({
          userId: user.id,
          action: `Failed to send reset password email: ${err.message}`,
        });
        return res.status(200).json({
          success: false,
          message: "Failed to send reset password email.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
      });
    });
  } catch (err) {
    // Log the server error
    await CreateLog({
      userId: null,
      action: `Error in password reset request: ${err.message}`,
    });

    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

// Reset Password
module.exports.ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(200).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  // Check password length
  if (newPassword.length < 8) {
    return res.status(200).json({
      success: false,
      message: "Password must be at least 8 characters.",
    });
  }

  // Check password strength using zxcvbn
  const passwordStrength = zxcvbn(newPassword);
  if (passwordStrength.score < 3) {
    return res.status(200).json({
      success: false,
      message: "Password is too weak.",
    });
  }

  // Check for required character types (uppercase, lowercase, number, special character)
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return res.status(200).json({
      success: false,
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    });
  }

  try {
    const q =
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2";
    const { rows } = await pool.query(q, [token, new Date()]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const user = rows[0];

    // Check if the new password is the same as the old one
    const isPasswordTheSame = await bcrypt.compare(newPassword, user.password);
    if (isPasswordTheSame) {
      return res.status(200).json({
        success: false,
        message: "New password cannot be the same as old password.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password and clear the reset token and expiry
    const updateQuery =
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2";
    await pool.query(updateQuery, [hashedPassword, user.id]);

    // Log the password reset action
    const logResult = await CreateLog({
      userId: user.id, // Use user.id here
      action: "Password reset successful",
    });

    if (!logResult.success) {
      console.error("Failed to create log:", logResult.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err) {
    // Log the server error
    await CreateLog({
      userId: null,
      action: `Error in password reset: ${err.message}`,
    });

    return res.status(200).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};

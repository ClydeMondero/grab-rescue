const pool = require("../config/db"); // Import the PostgreSQL pool setup
const env = require("../config/env");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Get Admins with Filtering and Name Search
module.exports.GetAdmins = async (req, res) => {
  const queryParams = [];
  let q =
    "SELECT id, first_name, middle_initial, last_name, municipality, barangay, contact_number, is_online, verified FROM users WHERE account_type = 'Admin'";

  let paramCounter = 1; // To dynamically number the query parameters

  // Add filters based on query parameters
  if (req.query.municipality) {
    q += ` AND municipality = $${paramCounter}`;
    queryParams.push(req.query.municipality);
    paramCounter++;
  }

  if (req.query.barangay) {
    q += ` AND barangay = $${paramCounter}`;
    queryParams.push(req.query.barangay);
    paramCounter++;
  }

  if (req.query.is_online) {
    q += ` AND is_online = $${paramCounter}`;
    queryParams.push(req.query.is_online);
    paramCounter++;
  }

  // Add keyword search for first_name or last_name
  if (req.query.keyword) {
    q += ` AND (first_name ILIKE $${paramCounter} OR last_name ILIKE $${
      paramCounter + 1
    })`;
    const keyword = `%${req.query.keyword}%`;
    queryParams.push(keyword, keyword);
    paramCounter += 2;
  }

  // Add filter for verified
  if (req.query.verified) {
    q += ` AND verified = $${paramCounter}`;
    queryParams.push(req.query.verified);
    paramCounter++;
  }

  try {
    const { rows } = await pool.query(q, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Specific Admin
module.exports.GetAdmin = async (req, res) => {
  const q =
    "SELECT id, first_name, middle_initial, last_name, municipality, barangay, contact_number, is_online, verified FROM users WHERE id = $1";
  try {
    const { rows } = await pool.query(q, [req.params.id]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Admin
module.exports.CreateAdmin = async (req, res) => {
  const {
    firstName,
    middleInitial,
    lastName,
    birthday,
    municipality,
    barangay,
    contactNumber,
    email,
    username,
    password,
  } = req.body;

  // Calculate the user's age based on the provided birthday
  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );
  const MIN_AGE = 18;

  if (age < MIN_AGE) {
    return res.status(400).json({
      error: `You must be at least ${MIN_AGE} years old to register.`,
    });
  }

  try {
    // Check if the username or email already exists in the database
    const q = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const result = await pool.query(q, [username, email]);

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    } else {
      // Hash the password using bcrypt
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Insert the user into the database
      const insertQuery = `
        INSERT INTO users(
          first_name, middle_initial, last_name, birthday, age, municipality, 
          barangay, contact_number, email, username, password, account_type, 
          verified, is_online, verification_token
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id
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
        email,
        username,
        hash,
        "Admin",
        false,
        false,
        verificationToken,
      ];

      const insertResult = await pool.query(insertQuery, values);
      const userId = insertResult.rows[0].id;

      // Send a verification email to the user
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bhenzmharlbartolome012603@gmail.com",
          pass: "owvb wzni fhxu cvbz",
        },
      });

      const mailOptions = {
        from: "your_email_here",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://localhost:4000/users/verify/${verificationToken}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          return res
            .status(200)
            .json({ message: "User created. Verification email sent." });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update Admin
module.exports.UpdateAdmin = async (req, res) => {
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

module.exports.UpdateAdminEmail = async (req, res) => {
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
    // Fetch the user's current email from the database
    const q = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(q, [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "User does not exist" });

    const { email: oldEmail } = rows[0];

    // Check if the new email is the same as the old email
    if (email === oldEmail) {
      return res
        .status(200)
        .json({ message: "The email is the same. No changes made." });
    }

    // Check if the new email is already taken
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Proceed to update the email and verification token in the database
    const updateQuery = `
      UPDATE users
      SET email = $1, verification_token = $2, verified = false
      WHERE id = $3
    `;

    await pool.query(updateQuery, [email, verificationToken, id]);

    // Send a verification email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bhenzmharlbartolome012603@gmail.com",
        pass: "owvb wzni fhxu cvbz",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your new email: http://localhost:4000/users/verify/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error while sending email:", err);
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      } else {
        console.log("Verification email sent:", info.response);
        return res
          .status(200)
          .json({ message: "Email updated. Verification email sent." });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update Admin's Password
module.exports.UpdateAdminPassword = async (req, res) => {
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

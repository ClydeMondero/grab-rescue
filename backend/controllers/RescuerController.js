const pool = require("../config/db"); // Import the PostgreSQL pool setup
const env = require("../config/env");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const zxcvbn = require("zxcvbn");
const { getTokenSubject } = require("../utils/SecretToken");
const { CreateLog } = require("./LogController");

// Get Rescuers with Filtering and Name Search
module.exports.GetRescuers = async (req, res) => {
  const queryParams = [];
  let q =
    "SELECT id, first_name, middle_name, last_name, municipality, barangay, profile_image, contact_number, email, is_online, verified, status FROM users WHERE account_type = 'Rescuer'";

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

  // Add filter for active and inactive status
  if (req.query.status) {
    q += ` AND status = $${paramCounter}`;
    queryParams.push(req.query.status);
    paramCounter++;
  }

  q +=
    " ORDER BY (CASE status WHEN 'Active' THEN 1 WHEN 'Inactive' THEN 2 END), id";

  try {
    const { rows } = await pool.query(q, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Specific Rescuer
module.exports.GetRescuer = async (req, res) => {
  const q =
    "SELECT id, first_name, middle_name, last_name, municipality, barangay, profile_image, contact_number, email, is_online, verified, status FROM users WHERE id = $1";
  try {
    const { rows } = await pool.query(q, [req.params.id]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Rescuer
module.exports.CreateRescuer = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    birthday,
    municipality,
    barangay,
    contactNumber,
    email,
    username,
    password,
    confirmPassword,
  } = req.body;

  // List of required fields
  const requiredFields = {
    firstName: "First Name",
    lastName: "Last Name",
    birthday: "Birthday",
    municipality: "Municipality",
    barangay: "Barangay",
    contactNumber: "Contact Number",
    email: "Email",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
  };

  // Check for missing fields
  const missingFields = [];

  for (const [key, field] of Object.entries(requiredFields)) {
    if (!req.body[key]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(200).json({
      success: false,
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  // Validate username length
  const MIN_USERNAME_LENGTH = 6;
  const MAX_USERNAME_LENGTH = 15;

  if (username.length < MIN_USERNAME_LENGTH) {
    return res.status(200).json({
      success: false,
      message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
    });
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return res.status(200).json({
      success: false,
      message: `Username must be no more than ${MAX_USERNAME_LENGTH} characters long.`,
    });
  }

  // Calculate the user's age based on the provided birthday
  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );
  const MIN_AGE = 18;

  if (age < MIN_AGE) {
    return res.status(200).json({
      success: false,
      message: `You must be at least ${MIN_AGE} years old to register. You are currently ${age} years old.`,
    });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(200).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  // Check password length
  if (password.length < 8) {
    return res.status(200).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  // Check password strength using zxcvbn
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return res.status(200).json({
      success: false,
      message: "Password is too weak.",
    });
  }

  // Check for required character types (uppercase, lowercase, number, special character)
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return res.status(200).json({
      success: false,
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  try {
    // Check if the username or email already exists in the database
    const q = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const result = await pool.query(q, [username, email]);

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.username === username) {
        return res.status(200).json({
          success: false,
          message: "Username is already taken.",
        });
      }
      if (existingUser.email === email) {
        return res.status(200).json({
          success: false,
          message: "Email is already taken.",
        });
      }
    } else {
      // Hash the password using bcrypt
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Insert the new rescuer into the database
      const insertQuery = `
      INSERT INTO users (
        first_name, middle_name, last_name, birthday, age, municipality, 
        barangay, contact_number, email, username, password, account_type, 
        verified, is_online, verification_token, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id
    `;
      const values = [
        firstName,
        middleName,
        lastName,
        birthday,
        age,
        municipality,
        barangay,
        contactNumber,
        email,
        username,
        hash,
        "Rescuer",
        false,
        false,
        verificationToken,
        "Active",
      ];

      const auth = req.headers.authorization;

      const token = auth.substring(7, auth.length);

      const subject = await getTokenSubject(token);

      const insertResult = await pool.query(insertQuery, values);
      //const userId = insertResult.rows[0].id;

      // Log the rescuer creation
      await CreateLog({
        userId: subject,
        action: `Rescuer Created with username: ${username} and email: ${email}`,
      });

      // Use frontend base URL for the verification link
      const verificationLink = `${process.env.SITE_URL}/verify/${verificationToken}`;

      // Send a verification email to the new email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: "GrabRescue <grabrescue.ph@gmail.com>",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your new email: ${verificationLink}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(200).json({
            success: false,
            message: `Email could not be sent: ${err.message}`,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "User created successfully. Verification email sent.",
          });
        }
      });
    }
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: `Server error: ${err.message}`,
    });
  }
};

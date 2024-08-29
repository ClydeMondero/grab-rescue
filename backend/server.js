const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "config/.env" });
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE, PORT } =
  process.env;

//create database connection
const db = mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE,
});

const port = PORT;
app.listen(port, () => {
  console.log(`Server listening in http://localhost:${port}`);
});

//enable cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//parse body to JSON
app.use(express.json());

//Get all users
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

//Create new user
app.post("/users", (req, res) => {
  // Get the user details from the request body
  const {
    firstName,
    middleInitial,
    lastName,
    birthday,
    municipality,
    barangay,
    email,
    username,
    password,
    confirmPassword,
    accountType,
  } = req.body;

  // Check if the user has filled in all the required fields
  if (
    !firstName ||
    !middleInitial ||
    !lastName ||
    !birthday ||
    !municipality ||
    !barangay ||
    !email ||
    !username ||
    !password ||
    !confirmPassword ||
    !accountType
  ) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  // Check if the password is at least 8 characters long
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirm password do not match" });
  }

  // Calculate the user's age based on the provided birthday
  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );

  // Check if the username or email already exists in the database
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [username, email], (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.sqlMessage });
    }

    if (data.length > 0) {
      const existingUser = data[0];
      // Check if the username is already taken
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      // Check if the email is already taken
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    } else {
      // Hash the password using bcrypt
      const bcrypt = require("bcrypt");
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Insert the user into the database
      const q =
        "INSERT INTO users(`id`, `first_name`, `middle_initial`, `last_name`, `birthday`, `age`, `municipality`, `barangay`, `email`, `username`, `password`, `account_type`, `verified`, `is_online`) VALUES (?)";
      const values = [
        req.body.id,
        firstName,
        middleInitial,
        lastName,
        birthday,
        age,
        municipality,
        barangay,
        email,
        username,
        hash,
        accountType,
        false,
        false,
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: err.sqlMessage });
        }

        const userId = data.insertId;

        // Send a verification email to the user
        const transporter = nodemailer.createTransport({
          service: "yahoo",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Email Verification",
          text: `Please click the following link to verify your email: http://localhost:4000/verify/${userId}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error while sending email:", err);
            return res.status(500).json({ error: err.message });
          } else {
            console.log("Email sent:", info.response);
            return res.status(201).json({ data });
          }
        });
      });
    }
  });
});

//Verify a user
app.get("/verify/:id", (req, res) => {
  const id = req.params.id;
  const q = "UPDATE users SET verified = 1 WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ message: "User verified successfully" });
  });
});

//Get a specific user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

//Update a user
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const {
    first_name: firstName,
    middle_initial: middleInitial,
    last_name: lastName,
    birthday,
    municipality,
    barangay,
    username: newUsername,
    account_type: accountType,
  } = req.body;

  //Validation
  if (
    !firstName ||
    !middleInitial ||
    !lastName ||
    !birthday ||
    !municipality ||
    !barangay ||
    !accountType ||
    !newUsername
  ) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    // Check if user exists
    if (err) return res.status(500).json({ error: err.sqlMessage });
    else if (data.length === 0)
      return res.status(400).json({ error: "User does not exist" });
    else {
      const { username: oldUsername } = data[0];

      if (newUsername && newUsername !== oldUsername) {
        // Check if new username is already taken
        const q = "SELECT * FROM users WHERE username = ? AND username != ?";
        db.query(q, [newUsername, oldUsername], (err, data) => {
          if (err) return res.status(500).json({ error: err.sqlMessage });
          else if (data.length > 0) {
            const existingUser = data[0];
            if (existingUser.username === newUsername) {
              return res
                .status(400)
                .json({ error: "Username is already taken" });
            }
          }

          // Update the user
          const q = `
            UPDATE users 
            SET first_name = ?, middle_initial = ?, last_name = ?, birthday = ?, municipality = ?, barangay = ?, username = ?, account_type = ?, age = ?
            WHERE id = ?
          `;
          const values = [
            firstName,
            middleInitial,
            lastName,
            birthday,
            municipality,
            barangay,
            newUsername,
            accountType,
            Math.floor(
              (new Date() - new Date(birthday).getTime()) / 3.15576e10
            ),
            id,
          ];
          db.query(q, values, (err, out) => {
            console.log(err, out);
            if (err) return res.json({ error: err.sqlMessage });
            else return res.json({ data: out });
          });
        });
      } else {
        // Update the user
        const q = `
          UPDATE users 
          SET first_name = ?, middle_initial = ?, last_name = ?, birthday = ?, municipality = ?, barangay = ?, account_type = ?, age = ?
          WHERE id = ?
        `;
        const values = [
          firstName,
          middleInitial,
          lastName,
          birthday,
          municipality,
          barangay,
          accountType,
          Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e10),
          id,
        ];
        db.query(q, values, (err, out) => {
          console.log(err, out);
          if (err) return res.json({ error: err.sqlMessage });
          else return res.json({ data: out });
        });
      }
    }
  });
});

//Update a user's email
app.put("/users/:id/email", (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ error: "Please enter a new email" });
  }

  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    // Check if user exists
    if (err) return res.status(500).json({ error: err.sqlMessage });
    else if (data.length === 0)
      return res.status(400).json({ error: "User does not exist" });
    else {
      const { email: oldEmail } = data[0];

      if (email && email !== oldEmail) {
        // Check if new email is already taken
        const q = "SELECT * FROM users WHERE email = ? AND email != ?";
        db.query(q, [email, oldEmail], (err, data) => {
          if (err) return res.status(500).json({ error: err.sqlMessage });
          else if (data.length > 0) {
            return res.status(400).json({ error: "Email is already taken" });
          }

          // Update the user
          const q = "UPDATE users SET email = ?, verified = 0 WHERE id = ?";
          const values = [email, id];
          db.query(q, values, (err, out) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });

            // Send a verification email to the user
            const transporter = nodemailer.createTransport({
              service: "yahoo",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: "Email Verification",
              text: `Please click the following link to verify your new email: http://localhost:4000/verify/${id}`,
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
          });
        });
      } else {
        // Return success if no changes were made
        return res.json({ data: { message: "No changes were made" } });
      }
    }
  });
});

// Forgot password email sending
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  // Validate the email
  if (!email) {
    return res.status(400).json({ error: "Please enter your email" });
  }

  // Check if the user exists
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });

    if (data.length === 0) {
      return res
        .status(400)
        .json({ error: "No account associated with this email" });
    }

    const user = data[0];

    // Generate a reset token and expiration time (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hour

    // Update the user with the reset token and expiration
    const updateQuery = `
      UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE id = ?
    `;
    db.query(updateQuery, [resetToken, resetTokenExpire, user.id], (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });

      // Send the reset email
      const transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `http://localhost:4000/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link to reset your password: ${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error while sending email:", err);
          return res.status(500).json({ error: "Failed to send reset email" });
        } else {
          console.log("Reset email sent:", info.response);
          return res.status(200).json({ message: "Password reset email sent" });
        }
      });
    });
  });
});

// Reset password
app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Validate the passwords
  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Please enter a new password and confirm it" });
  } else if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  } else if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirm password do not match" });
  }

  // Find the user by the reset token
  const q = `
    SELECT * FROM users WHERE reset_token = ? AND reset_token_expire > ?
  `;
  db.query(q, [token, Date.now()], (err, data) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });

    if (data.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const user = data[0];

    // Hash the new password
    const bcrypt = require("bcrypt");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Update the user's password and clear the reset token fields
    const updateQuery = `
      UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?
    `;
    db.query(updateQuery, [hash, user.id], (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });

      return res
        .status(200)
        .json({ message: "Password has been reset successfully" });
    });
  });
});

//Update a user's password
app.put("/users/:id/password", (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    // Check if user exists
    if (err) return res.status(200).json({ error: err.sqlMessage });
    else if (data.length === 0)
      return res.status(200).json({ error: "User does not exist" });
    else {
      // Hash the password using bcrypt
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Update the user's password
      const q = "UPDATE users SET password = ? WHERE id = ?";
      db.query(q, [hash, id], (err, out) => {
        if (err) return res.json({ error: err.sqlMessage });
        else return res.status(200).json({ success: true });
      });
    }
  });
});

//Delete a user
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  console.log("Deleted:" + req.body);
  const { user } = req.body;
  console.log(req.body);
  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

//Login user
app.post("/login", (req, res) => {
  // Get the username and password from the request body
  const { email, password } = req.body;

  // Get the user from the database
  const q = "SELECT * FROM users WHERE email = ? AND verified = true";
  db.query(q, [email], (err, data) => {
    if (err)
      return res
        .status(200)
        .json({ success: false, message: "Database error" });

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

      // Remove the password from the user data and return it
      delete userData.password;
      return res
        .status(200)
        .json({ success: true, message: "Logged In Success!" });
    });
  });
});

const db = require("../config/db");

require("dotenv").config({ path: "config/.env" });
const { EMAIL_USER, EMAIL_PASS } = process.env;

const bcrypt = require("bcrypt");

module.exports.CreateUser = async (req, res) => {
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
    accountType,
  } = req.body;

  // Calculate the user's age based on the provided birthday
  const age = Math.floor(
    (new Date() - new Date(birthday).getTime()) / 3.15576e10
  );

  // Check if the username or email already exists in the database
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [username, email], (err, data) => {
    if (err) {
      return res.status(200).json({ error: err.sqlMessage });
    }

    if (data.length > 0) {
      const existingUser = data[0];
      // Check if the username is already taken
      if (existingUser.username === username) {
        return res.status(200).json({ error: "Username is already taken" });
      }
      // Check if the email is already taken
      if (existingUser.email === email) {
        return res.status(200).json({ error: "Email is already taken" });
      }
    } else {
      // Hash the password using bcrypt
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
          return res.status(200).json({ error: err.sqlMessage });
        }

        const userId = data.insertId;

        // Send a verification email to the user
        const transporter = nodemailer.createTransport({
          service: "yahoo",
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: EMAIL_USER,
          to: email,
          subject: "Email Verification",
          text: `Please click the following link to verify your email: http://localhost:4000/verify/${userId}`,
        };

        // transporter.sendMail(mailOptions, (err, info) => {
        //   if (err) {
        //     return res.status(200).json({ error: err.message });
        //   } else {
        //     return res.status(200).json({ data });
        //   }
        // });
      });
    }
  });
};

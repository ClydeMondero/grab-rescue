const db = require("../config/db");

require("dotenv").config({ path: "config/.env" });
const { EMAIL_USER, EMAIL_PASS } = process.env;

const bcrypt = require("bcrypt");

// Get Admins with Filtering and Name Search
module.exports.GetAdmins = async (req, res) => {
    let q = "SELECT id, first_name, middle_initial, last_name, municipality, barangay, contact_number, is_online FROM users WHERE account_type = 'Admin'";
    
    const queryParams = [];

    // Add filters based on query parameters
    if (req.query.municipality) {
        q += " AND municipality = ?";
        queryParams.push(req.query.municipality);
    }

    if (req.query.barangay) {
        q += " AND barangay = ?";
        queryParams.push(req.query.barangay);
    }

    if (req.query.is_online) {
        q += " AND is_online = ?";
        queryParams.push(req.query.is_online);
    }

    // Add keyword search for first_name or last_name
    if (req.query.keyword) {
        q += " AND (first_name LIKE ? OR last_name LIKE ?)";
        const keyword = `%${req.query.keyword}%`;
        queryParams.push(keyword, keyword);
    }

    db.query(q, queryParams, (err, data) => {
        if (err) {
            return res.status(200).json({ error: err.sqlMessage });
        }
        return res.status(200).json(data);
    });
}


// Get Specific Admin
module.exports.GetAdmin = async (req, res) => {
    const q = "SELECT id, first_name, middle_initial, last_name, municipality, barangay, contact_number, is_online FROM users WHERE id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            return res.status(200).json({ error: err.sqlMessage });
        }
        return res.status(200).json(data);
    });
};

// Create Admin
module.exports.CreateAdmin = async (req, res) => {
  // Get the user details from the request body
  const {
    firstName,
    middleInitial,
    lastName,
    birthday,
    municipality,
    barangay,
    profile_image,
    contactNumber,
    email,
    username,
    password
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
        "INSERT INTO users(`id`, `first_name`, `middle_initial`, `last_name`, `birthday`, `age`, `municipality`, `barangay`,`contact_number`, `email`, `username`, `password`, `account_type`, `verified`, `is_online`) VALUES (?)";
      const values = [
        req.body.id,
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
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          return res.status(200).json({ error: err.sqlMessage });
        }

        const userId = data.insertId;

        // Send a verification email to the user
        // const transporter = nodemailer.createTransport({
        //   service: "yahoo",
        //   auth: {
        //     user: EMAIL_USER,
        //     pass: EMAIL_PASS,
        //   },
        // });

        // const mailOptions = {
        //   from: EMAIL_USER,
        //   to: email,
        //   subject: "Email Verification",
        //   text: `Please click the following link to verify your email: http://localhost:4000/verify/${userId}`,
        // };

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

// Update Admin
module.exports.UpdateAdmin = async (req, res) => {
  // Get the user details from the request body
  const {
    first_name: firstName,
    middle_initial: middleInitial,
    last_name: lastName,
    birthday,
    municipality,
    barangay,
    profile_image,
    contact_number: contactNumber,
    username: newUsername
  } = req.body;

  // Validation
  if (!firstName || !lastName || !birthday || !municipality || !barangay || !contactNumber || !newUsername) {
    return res.status(200).json({ error: "Please fill in all fields" });
  }

  let oldUsername;

  const q = `SELECT * FROM users WHERE id = ?`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(200).json({ error: err.sqlMessage });
    else if (data.length === 0) return res.status(200).json({ error: "User does not exist" });
    else {
      oldUsername = data[0].username;
    }

    if (newUsername && newUsername !== oldUsername) {
      // Check if new username is already taken
      const q = "SELECT * FROM users WHERE username = ? AND username != ?";
      db.query(q, [newUsername, oldUsername], (err, data) => {
        if (err) return res.status(200).json({ error: err.sqlMessage });
        else if (data.length > 0) {
          const existingUser = data[0];
          if (existingUser.username === newUsername) {
            return res.status(200).json({ error: "Username is already taken" });
          }
        }

        // Update the user in the database without email and password
        const q = `UPDATE users SET first_name = ?, middle_initial = ?, last_name = ?, birthday = ?, municipality = ?, barangay = ?, contact_number = ?, username = ? WHERE id = ?`;
        const values = [
          firstName,
          middleInitial,
          lastName,
          birthday,
          municipality,
          barangay,
          contactNumber,
          newUsername,
          req.params.id
        ];
        db.query(q, values, (err, data) => {
          if (err) return res.status(200).json({ error: err.sqlMessage });
          return res.status(200).json({ data });
        });
      });
    } else {
      // Update the user in the database without email and password
      const q = `UPDATE users SET first_name = ?, middle_initial = ?, last_name = ?, birthday = ?, municipality = ?, barangay = ?, contact_number = ?, username = ? WHERE id = ?`;
      const values = [
        firstName,
        middleInitial,
        lastName,
        birthday,
        municipality,
        barangay,
        contactNumber,
        newUsername,
        req.params.id
      ];
      db.query(q, values, (err, data) => {
        if (err) return res.status(200).json({ error: err.sqlMessage });
        return res.status(200).json({ data });
      });
    }
  });
};

// Update Admin Email
module.exports.UpdateAdminEmail = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(200).json({ error: "Please enter an email" });
  }

    // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(200).json({ error: "Invalid email format" });
  }


  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(200).json({ error: err.sqlMessage });
    else if (data.length === 0) return res.status(200).json({ error: "User does not exist" });
    else {
      const {email: oldEmail} = data[0];

      if (email && email !== oldEmail) {
        // Check if new email is already taken
        const q = `SELECT * FROM users WHERE email = ? AND email != ?`;
        db.query(q, [email, oldEmail], (err, data) => {
          if (err) return res.status(200).json({ error: err.sqlMessage });
          else if (data.length > 0) {
            const existingUser = data[0];
            if (existingUser.email === email) {
              return res.status(200).json({ error: "Email is already taken" });
            }
          }

          // Update the user in the database
          const q = `UPDATE users SET email = ? WHERE id = ?`;
          db.query(q, [email, id], (err, data) => {
            if (err) return res.status(200).json({ error: err.sqlMessage });
            
            // Send email verification
            //const transporter = nodemailer.createTransport({
            //  service: "yahoo",
            //  auth: {
            //    user: process.env.EMAIL_USER,
            //    pass: process.env.EMAIL_PASS,
            //  },
            //});
            //const mailOptions = {
            //  from: process.env.EMAIL_USER,
            //  to: email,
            //  subject: "Email Verification",
            //  text: `Please click the following link to verify your new email: http://localhost:4000/verify/${id}`,
            //};
            //transporter.sendMail(mailOptions, (err, info) => {
            //  if (err) {
            //    console.error("Error while sending email:", err);
            //    return res
            //      .status(500)
            //      .json({ error: "Failed to send verification email" });
            //  } else {
            //    console.log("Verification email sent:", info.response);
            //    return res
            //      .status(200)
            //      .json({ message: "Email updated. Verification email sent." });
            //  }
            //});
          });
        });
      }else{
        //Return success when email is not updated
        return res.status(200).json({ data: "Email not updated" });
      }
    }
  })
}



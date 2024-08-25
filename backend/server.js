const express = require('express');

const app = express();
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const port = 4000;

require('dotenv').config({path:'config/.env'});

//create database connection
const db = mysql.createConnection({
  host:process.env.DATABASE_HOST,
  user:process.env.DATABASE_USER,
  password:process.env.DATABASE_PASSWORD,
  database:process.env.DATABASE
});

app.use(express.json());
app.use(cors());

app.listen(port,()=>{
console.log(`Server listening in http://localhost:${port}`);
})

//Get all users
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    console.log(err, data);
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ data });
  })
})

//Create new user
app.post("/users", (req, res) => {
  // Get the user details from the request body
  const { firstName, middleInitial, lastName, birthday, municipality, barangay, email, username, password, accountType } = req.body;

  // Check if the user has filled in all the required fields
  if (!firstName || !middleInitial || !lastName || !birthday || !municipality || !barangay || !email || !username || !password || !accountType) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  // Check if the password is at least 8 characters long
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  // Calculate the user's age based on the provided birthday
  const age = Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

  // Check if the username or email already exists in the database
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [username, email], (err, data) => {
    if (err) {
      console.error('Database Error:', err);
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
      const bcrypt = require('bcrypt');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      // Insert the user into the database
      const q = "INSERT INTO users(`id`, `first_name`, `middle_initial`, `last_name`, `birthday`, `age`, `municipality`, `barangay`, `email`, `username`, `password`, `account_type`, `verified`, `is_online`) VALUES (?)";
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
        false
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ error: err.sqlMessage });
        }
        
        const userId = data.insertId;

        // Send a verification email to the user
        const transporter = nodemailer.createTransport({
          service: 'yahoo',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Email Verification',
          text: `Please click the following link to verify your email: http://localhost:4000/verify/${userId}`
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Error while sending email:', err);
            return res.status(500).json({ error: err.message });
          } else {
            console.log('Email sent:', info.response);
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
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ message: "User verified successfully" });
  })
});

//Get a specific user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id
  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ data });
  })
})

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
    email, 
    username: newUsername, 
    password, 
    account_type: accountType 
  } = req.body;

  //Validation
  if (!firstName || !middleInitial || !lastName || !birthday || !municipality || !barangay || !accountType || !email) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  if (password && password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    // Check if user exists
    if (err) return res.status(500).json({ error: err.sqlMessage });
    else if (data.length === 0) return res.status(400).json({ error: "User does not exist" });
    else {
      const { username: oldUsername, email: oldEmail } = data[0];

      if ((newUsername && newUsername !== oldUsername) || (email && email !== oldEmail)) {
        // Check if new username or email is already taken
        const q = "SELECT * FROM users WHERE (username = ? AND username != ?) OR (email = ? AND email != ?)";
        db.query(q, [newUsername, oldUsername, email, oldEmail], (err, data) => {
          if (err) return res.status(500).json({ error: err.sqlMessage });
          else if (data.length > 0) {
            const existingUser = data[0];
            if (existingUser.username === newUsername) {
              return res.status(400).json({ error: "Username is already taken" });
            }
            if (existingUser.email === email) {
              return res.status(400).json({ error: "Email is already taken" });
            }
          }

          // If password is provided, hash it
          let updatedData = { ...req.body };
          if (password) {
            const bcrypt = require('bcrypt');
            const salt = bcrypt.genSaltSync(10);
            updatedData.password = bcrypt.hashSync(password, salt);
          }

          // Update the user's age based on the provided birthday
          updatedData.age = Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

          // Construct the query and update the user
          const q = `
            UPDATE users 
            SET ${Object.keys(updatedData).map((key) => `${key} = ?`).join(", ")} 
            WHERE id = ?
          `;
          db.query(q, [...Object.values(updatedData), id], (err, out) => {
            console.log(err, out);
            if (err) return res.json({ error: err.sqlMessage });
            else return res.json({ data: out });
          });
        });
      } else {
        // If password is provided, hash it
        let updatedData = { ...req.body };
        if (password) {
          const bcrypt = require('bcrypt');
          const salt = bcrypt.genSaltSync(10);
          updatedData.password = bcrypt.hashSync(password, salt);
        }

        // Update the user's age based on the provided birthday
        updatedData.age = Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

        // Construct the query and update the user
        const q = `
          UPDATE users 
          SET ${Object.keys(updatedData).map((key) => `${key} = ?`).join(", ")} 
          WHERE id = ?
        `;
        db.query(q, [...Object.values(updatedData), id], (err, out) => {
          console.log(err, out);
          if (err) return res.json({ error: err.sqlMessage });
          else return res.json({ data: out });
        });
      }
    }
  });
});



//Delete a user
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  console.log("Deleted:" + req.body);
  const {user} = req.body;
  console.log(req.body);
  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ data });
  })
})

//Login user
app.post("/login", (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Check if the fields are filled in
  if (!username || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  // Get the user from the database
  const q = "SELECT * FROM users WHERE username = ? AND verified = true";
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });

    // If the user does not exist or is not verified, return an error
    if (data.length === 0) {
      return res.status(400).json({ error: "Username does not exist or is not verified" });
    }

    // Get the user data from the database
    const [userData] = data;

    // Check if the user is already online
    if (userData.is_online) {
      return res.status(400).json({ error: "User is already online" });
    }

    // Check if the password is valid
    const bcrypt = require('bcrypt');
    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Update the user to be online
    const updateQuery = "UPDATE users SET is_online = true WHERE id = ?";
    db.query(updateQuery, [userData.id], (err) => {
      if (err) return res.status(500).json({ error: "Failed to update online status" });

      // Remove the password from the user data and return it
      delete userData.password;
      return res.status(200).json({ data: userData });
    });
  });
});




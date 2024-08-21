const express = require('express');

const app = express();
const cors = require('cors');
const mysql = require('mysql');

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

//get all users
app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    console.log(err, data);
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ data });
  })
})

//create a new user
app.post("/users", (req, res) => {
  //validation
  const { firstName, middleInitial, lastName, birthday, municipality, barangay, username, password, accountType } = req.body;
  if(!firstName || !middleInitial || !lastName || !birthday || !municipality || !barangay || !username || !password || !accountType){
    return res.status(400).json({error: "Please fill in all fields"});
  }
  if(password.length < 8){
    return res.status(400).json({error: "Password must be at least 8 characters"});
  }

  const age = Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);

  //check if username is already taken
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], (err, data) => {
    if(err) return res.status(500).json({ error: err.sqlMessage });
    else if(data.length > 0) return res.status(400).json({error: "Username is already taken"});
    else {
      //hash the password
      const bcrypt = require('bcrypt');
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const q = "INSERT INTO users(`id`, `first_name`, `middle_initial`, `last_name`, `birthday`, `age`, `municipality`, `barangay`, `username`, `password`, `account_type`) VALUES (?)";
      const values = [
        req.body.id,
        req.body.firstName,
        req.body.middleInitial,
        req.body.lastName,
        req.body.birthday,
        age,
        req.body.municipality,
        req.body.barangay,
        req.body.username,
        hash,
        req.body.accountType
      ];
      db.query(q, [values], (err, data) => {
        console.log(err, data);
        if(err) return res.status(500).json({ error: err.sqlMessage });
        else return res.status(201).json({ data });
      });
    }
  });
});


//get a specific user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id
  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    console.log(err, data);
    if(err) return res.json({error: err.sqlMessage});
    else return res.json({ data });
  })
})

//update a user
app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const { first_name: firstName, middle_initial: middleInitial, last_name: lastName, birthday, municipality, barangay, username: newUsername, password, account_type: accountType } = req.body;

  // Validation
  if (!firstName || !middleInitial || !lastName || !birthday || !municipality || !barangay || !accountType) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  if (password && password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if(err) return res.status(500).json({ error: err.sqlMessage });
    else if(data.length === 0) return res.status(400).json({error: "User does not exist"});
    else {
      const { username: oldUsername } = data[0];
      if (newUsername && newUsername !== oldUsername) {
        // Check if new username is already taken
        const q = "SELECT * FROM users WHERE username = ?";
        db.query(q, [newUsername], (err, data) => {
          if(err) return res.status(500).json({ error: err.sqlMessage });
          else if(data.length > 0) return res.status(400).json({error: "Username is already taken"});

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


//delete a user
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


//login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    else if (data.length === 0) return res.status(400).json({ error: "Username does not exist" });
    else {
      const [userData] = data;
      const bcrypt = require('bcrypt');
      const isPasswordValid = bcrypt.compareSync(password, userData.password);
      if (!isPasswordValid) return res.status(400).json({ error: "Invalid password" });
      delete userData.password;
      return res.status(200).json({ data: userData });
    }
  });
});



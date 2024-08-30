const express = require("express");
const app = express();
const cors = require("cors");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "config/.env" });
const { PORT } = process.env;

const userRoute = require("./routes/UserRoute");

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

//parse cookies
app.use(cookieParser());

//parse body to JSON
app.use(express.json());

//routes
app.use("/users", userRoute);

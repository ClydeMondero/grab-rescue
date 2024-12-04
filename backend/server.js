const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");

const userRoute = require("./routes/UserRoute");
const authRoute = require("./routes/AuthRoute");
const rescuerRoute = require("./routes/RescuerRoute");
const citizenRoute = require("./routes/CitizenRoute");
const adminRoute = require("./routes/AdminRoute");
const logRoute = require("./routes/LogRoute");
const messageRoute = require("./routes/MessageRoute");

const url = env.API_URL;
const port = env.PORT;

app.listen(port, () => {
  console.log(`Server listening in ${url}:${port}`);
});

//enable cors
const corsOptions = {
  origin: ["http://localhost:5173", "https://grab-rescue.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

//parse cookies
app.use(cookieParser());

//parse body to JSON
app.use(express.json());

//routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/rescuers", rescuerRoute);
app.use("/citizens", citizenRoute);
app.use("/admins", adminRoute);
app.use("/logs", logRoute);
app.use("/messages", messageRoute);

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("./config/env");

const userRoute = require("./routes/UserRoute");
const authRoute = require("./routes/AuthRoute");
const rescuerRoute = require("./routes/RescuerRoute");
const adminRoute = require("./routes/AdminRoute");

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server listening in http://localhost:${port}`);
});

//enable cors
app.use(
  cors({
    origin: ["http://localhost:5173", "https://grab-rescue.onrender.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//parse cookies
app.use(cookieParser());

//parse body to JSON
app.use(express.json());

//routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/rescuers", rescuerRoute);
app.use("/admins", adminRoute);

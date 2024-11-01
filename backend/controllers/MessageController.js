const admin = require("firebase-admin");

if (process.env.NODE_ENV === "production") {
  // Production environment: use credentials via GOOGLE_APPLICATION_CREDENTIALS
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  // Development environment: use the local service account key file
  const serviceAccount = require("../config/serviceKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.sendNotification = (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(message);
      console.log("Successfully sent message:", response);
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).send("Failed to send notification");
    });
};

const admin = require("firebase-admin");

const serviceAccount =
  process.env.NODE_ENV === "production"
    ? require("/etc/secrets/serviceKey.json")
    : require("./serviceKey.json"); // Local path for development

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

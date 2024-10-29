// Import the Firebase scripts needed
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js"
);

fetch("/firebase-config.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    // Initialize Firebase with the loaded config
    firebase.initializeApp(firebaseConfig);

    // Retrieve Firebase Messaging and handle background messages
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message: ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  })
  .catch((error) => {
    console.error("Error loading Firebase configuration:", error);
  });

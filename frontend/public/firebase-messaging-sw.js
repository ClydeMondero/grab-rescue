// Import the Firebase scripts needed
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js"
);

// Event listeners for push, subscription change, and notification click
self.addEventListener("push", (event) => {
  if (event.data) {
    let payload;
    try {
      payload = event.data.json();
    } catch (e) {
      console.error("Failed to parse push event data:", e);
      return;
    }

    const notificationTitle = payload.notification?.title || "Default Title";
    const notificationOptions = {
      body: payload.notification?.body || "Default body text.",
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

self.addEventListener("pushsubscriptionchange", (event) => {
  // Handle push subscription change if needed
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// Initialize Firebase Messaging
fetch("/firebase-config.json")
  .then((response) => response.json())
  .then((firebaseConfig) => {
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification?.title || "Default Title";
      const notificationOptions = {
        body: payload.notification?.body || "Default body text.",
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

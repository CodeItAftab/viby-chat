// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBSr5dwTifArnM6ZROJUej0zm_xhWjYieg",
  authDomain: "viby-chat-b4f3d.firebaseapp.com",
  projectId: "viby-chat-b4f3d",
  storageBucket: "viby-chat-b4f3d.firebasestorage.app",
  messagingSenderId: "843532868764",
  appId: "1:843532868764:web:7f75cc0f1e6d01373e2159",
  measurementId: "G-K4ETC46D4C",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

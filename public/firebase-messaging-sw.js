// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");



// // eslint-disable-next-line no-undef
// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// // eslint-disable-next-line no-undef
// const messaging = firebase.messaging();
self.addEventListener('fetch', () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      self.firebaseConfig = Object.fromEntries(urlParams);
    } catch (err) {
      console.error('Failed to add event listener', err);
    }
  
  });
  // "Default" Firebase configuration (prevents errors)
  const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
  };
  
  // Initialize Firebase app
  firebase.initializeApp(self.firebaseConfig || defaultConfig);
  let messaging;
  try {
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging();
      messaging
        .getToken({
          vapidKey: VAPID_KEY
        })
        .then((currentToken) => {
          if (currentToken) {
          subscribeTokenToTopic(currentToken,"admin");
          }
        })
        .catch((err) => {
          console.log('Error to get token', err);
        });

      messaging.onMessage((payload) => {
        console.log(payload.notification)
      });

      // Otherwise, we need to ask the user for permission
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } else {
      console.log('firebase messaging not supported');
    }
  } catch (err) {
    console.log(err);
  }
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon3.png.ico",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});


function subscribeTokenToTopic(token, topic) {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `key=${FCM_SERVER_KEY}`
    })
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 400) {
        console.log(response.status, response);
      }
      console.log(`"${topic}" is subscribed`);
    })
    .catch((error) => {
      console.error(error.result);
    });
  return true;
}
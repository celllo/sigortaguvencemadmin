import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebase_app from '@/firebasefile/config';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// // eslint-disable-next-line no-undef
// const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging;

if (process.browser) {

   messaging = getMessaging(firebase_app);
  
  }
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
     // console.log("payload", payload)
      resolve(payload);
    });
  });

  export const requestForToken = () => {
  
    return getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_KEY_PAIR })
      .then((currentToken) => {
        if (currentToken) {
          
         // console.log('current token for client: ', currentToken);
          // Perform any other neccessary action with the token
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  };

  const UrlFirebaseConfig = new URLSearchParams(
    {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

    }.toString()
  );
  
  const swUrl = `http://localhost:3030/firebase-messaging-sw.js?${UrlFirebaseConfig}`;
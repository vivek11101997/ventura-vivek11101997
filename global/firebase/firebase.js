import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//  Firebase Config
const firebaseConfig = {
  apiKey: process.env.VENTURA_APP_GMAIL_API_KEY,
  authDomain: process.env.VENTURA_APP_GMAIL_AUTH_DOMAIN,
  projectId: process.env.VENTURA_APP_GMAIL_PROJECT_ID,
  storageBucket: process.env.VENTURA_APP_GMAIL_STORAGE_BUCKET,
  messagingSenderId: process.env.VENTURA_APP_GMAIL_MESSAGING_SENDER_ID,
  appId: process.env.VENTURA_APP_GMAIL_APP_ID,
  measurementId: process.env.VENTURA_APP_GMAIL_MEASUREMENT_ID,
};

const app = initializeApp({ ...firebaseConfig });

const auth = getAuth(app);
auth.languageCode = "it";

export { auth };

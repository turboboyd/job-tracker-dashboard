import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

type Env = {
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
};

const env = process.env as Env;

function mustEnv(name: keyof Env): string {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: mustEnv("FIREBASE_API_KEY"),
  authDomain: mustEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: mustEnv("FIREBASE_PROJECT_ID"),
  appId: mustEnv("FIREBASE_APP_ID"),
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

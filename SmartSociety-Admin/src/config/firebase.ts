// src/config/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA44jHDeHHp86J5APc5uZI-sKj860bEFaE",
  authDomain: "smartsociety-e735a.firebaseapp.com",
  projectId: "smartsociety-e735a",
  storageBucket: "smartsociety-e735a.firebasestorage.app",
  messagingSenderId: "550106776656",
  appId: "1:550106776656:web:25300704978f971043bd55",
  measurementId: "G-XDFW63VKGQ"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with AsyncStorage for persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
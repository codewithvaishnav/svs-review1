import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  Auth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';

// Optional fallback configuration for AI Studio sandbox environment
import fallbackConfig from '../../firebase-applet-config.json';


/**
 * Robust Firebase Configuration Resolver
 * Priority:
 * 1. Standard Vite environment variables (`import.meta.env.VITE_FIREBASE_*`)
 * 2. AI Studio local environment config (`firebase-applet-config.json`)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId || '',
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || fallbackConfig.firestoreDatabaseId || undefined;

// Defensive sanity check
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.warn(
    '[Firebase Init Warning]: Firebase configuration values are missing or incomplete. ' +
    'Please verify your .env file or VITE_FIREBASE_* variables.'
  );
}

/**
 * Singleton Firebase App Initialization
 * Prevents "Firebase: Firebase App named '[DEFAULT]' already exists" error during hot reloads or multiple imports.
 */
export const app: FirebaseApp = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

/**
 * Firestore Database Instance
 * Supports custom database ID (e.g. named Firestore databases) if specified.
 */
export const db: Firestore = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

/**
 * Firebase Authentication Instance
 */
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy, 
  limit,
  serverTimestamp,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  type FirebaseUser
};


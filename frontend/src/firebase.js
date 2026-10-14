// Firebase configuration and authentication setup
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqK_AWrJ41jp3kajB4B_6nt16VpIH5-OE",
  authDomain: "fashionsearch-57146.firebaseapp.com",
  projectId: "fashionsearch-57146",
  storageBucket: "fashionsearch-57146.firebasestorage.app",
  messagingSenderId: "208567001755",
  appId: "1:208567001755:web:9e057f423e271a22d75c3e",
  measurementId: "G-N3PG3C5PQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely (works only in browser environments)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Firebase Google Auth error:", error);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Firebase Signout error:", error);
    return { success: false, error: error.message };
  }
};

export { onAuthStateChanged };
export default app;

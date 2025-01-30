import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, increment, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import * as deposit from './features/deposit.js';
import * as viewAd from './features/viewAd.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signUp = async () => {
  // ... (Sign up function remains the same)
};

window.logIn = async () => {
  // ... (Log in function remains the same)
};

window.logOut = async () => {
  // ... (Log out function remains the same)
};

async function showDashboard(user) {
  // ... (Show dashboard function remains the same)
}

onAuthStateChanged(auth, (user) => {
  // ... (onAuthStateChanged function remains the same)
});

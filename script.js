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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Firestore reference for the user document
    const userDocRef = doc(db, 'users', user.uid);  // 'users' collection mein user document reference

    try {
      // Fetch the user document from Firestore
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        console.error("User document not found!");

        // Agar document exist nahi karta, toh create karte hain
        await setDoc(userDocRef, {
          name: user.displayName || "User Name",  // User ka name (agar available ho)
          email: user.email,  // User ka email
          // Aap aur fields bhi add kar sakte hain jaise balance, registration date, etc.
        });

        console.log("User document successfully created!");
      } else {
        // Agar document mil jata hai, toh usse process karein
        console.log("User document fetched successfully:", docSnap.data());
        showDashboard(user); // Dashboard ko display karte hain
      }
    } catch (error) {
      console.error("Error fetching or creating document:", error);
    }
  } else {
    console.log("No user is signed in!");
  }
});

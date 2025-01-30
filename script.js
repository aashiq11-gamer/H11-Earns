import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, increment, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up Function
window.signUp = async () => {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is created and logged in
    console.log("User signed up:", user.uid);

    // Create the user document in Firestore if it doesn't exist
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.log("User document not found, creating...");
      await setDoc(userDocRef, {
        name: user.displayName || "New User",
        email: user.email,
        earnings: 0,  // Set initial earnings
        balance: 0,   // Set initial balance
      });
      console.log("User document created successfully!");
    }

    // Show the dashboard after sign-up
    showDashboard(user);

  } catch (error) {
    console.error("Error signing up:", error);
  }
};

// Log In Function
window.logIn = async () => {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User logged in:", user.uid);
    showDashboard(user);

  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Log Out Function
window.logOut = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    document.getElementById("username").innerText = "";
    document.getElementById("earnings").innerText = "";
    document.getElementById("balance").innerText = "";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Show Dashboard Function
async function showDashboard(user) {
  const userDocRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    console.log("User Data:", userData);

    // Show the user's information on the dashboard
    document.getElementById("username").innerText = userData.name;
    document.getElementById("earnings").innerText = `Earnings: ${userData.earnings} PKR`;
    document.getElementById("balance").innerText = `Balance: ${userData.balance} PKR`;
  } else {
    console.error("User data not found!");
  }
}

// Auth State Change Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);
    showDashboard(user);
  } else {
    console.log("No user logged in");
  }
});

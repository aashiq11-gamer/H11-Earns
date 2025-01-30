// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Listen for auth state changes
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    if (user.email === 'admin@example.com') { // Check if the logged-in user is admin
      window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
    } else {
      showDashboard(user);
    }
  } else {
    console.log("User is signed out");
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
  }
});

// Sign Up Function
window.signUp = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    if (userCredential.user.email === 'admin@example.com') {
      window.location.href = 'admin-dashboard.html';
    } else {
      // Give signup bonus of 25 PKR
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        balance: 25,
        earnings: 0,
        deposit: 0
      });
      showDashboard(userCredential.user);
    }
  } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
};

// Log In Function
window.logIn = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    if (userCredential.user.email === 'admin@example.com') {
      window.location.href = 'admin-dashboard.html';
    } else {
      showDashboard(userCredential.user);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
};

// Log Out Function
window.logOut = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Show User Dashboard
const showDashboard = async (user) => {
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";

  // Fetch user balance and earnings
  const q = query(collection(db, 'users'), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    document.getElementById("balance").innerText = userData.balance;
    document.getElementById("earnings").innerText = userData.earnings;
  });
};

// Withdraw Function
window.withdraw = async () => {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, 'users'), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let userData = {};
    let docId = '';
    querySnapshot.forEach((doc) => {
      userData = doc.data();
      docId = doc.id;
    });

    if (userData.balance >= 25) {
      // Update balance and record withdrawal request
      await updateDoc(doc(db, 'users', docId), {
        balance: userData.balance - 25,
        withdrawalRequest: true
      });
      alert('Withdrawal request submitted');
    } else {
      alert('Minimum withdrawal amount is 25 PKR');
    }
  }
};

// Add bonus to user account
const addBonus = async (userId, amount) => {
  const q = query(collection(db, 'users'), where("uid", "==", userId));
  const querySnapshot = await getDocs(q);
  let docId = '';
  querySnapshot.forEach((doc) => {
    docId = doc.id;
  });

  await updateDoc(doc(db, 'users', docId), {
    balance: amount
  });
  console.log(`Added ${amount} PKR bonus to user ${userId}`);
};

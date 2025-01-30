// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Listen for auth state changes
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user);
    if (user.email === 'admin@example.com') { // Check if the logged-in user is admin
      window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
    } else {
      showDashboard();
    }
  } else {
    console.log("User is signed out");
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
  }
});

// Sign Up Function
window.signUp = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
      if (userCredential.user.email === 'admin@example.com') {
        window.location.href = 'admin-dashboard.html';
      } else {
        showDashboard();
      }
    })
    .catch((error) => {
      console.error("Error signing up:", error);
      alert(error.message);
    });
};

// Log In Function
window.logIn = () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
      if (userCredential.user.email === 'admin@example.com') {
        window.location.href = 'admin-dashboard.html';
      } else {
        showDashboard();
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert(error.message);
    });
};

// Log Out Function
window.logOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User logged out");
      document.getElementById("user-dashboard").style.display = "none";
      document.getElementById("auth-form").style.display = "block";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
};

// Show User Dashboard
const showDashboard = () => {
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";
};

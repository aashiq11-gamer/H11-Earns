// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Sign Up Function
const signUp = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Successfully Signed Up
      console.log("User signed up:", userCredential.user);
      showDashboard();
    })
    .catch((error) => {
      console.error("Error signing up:", error);
    });
};

// Log In Function
const logIn = () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Successfully Logged In
      console.log("User logged in:", userCredential.user);
      showDashboard();
    })
    .catch((error) => {
      console.error("Error logging in:", error);
    });
};

// Log Out Function
const logOut = () => {
  auth.signOut()
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

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, increment, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signUp = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: user.email,
      balance: 25,
      earnings: 0,
      deposit: 0,
      adViews: 0
    });
    showDashboard(user);
  } catch (error) {
    console.error("Sign Up Error:", error);
    alert(error.message);
  }
};

window.logIn = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showDashboard(user);
  } catch (error) {
    console.error("Log In Error:", error);
    alert(error.message);
  }
};

window.logOut = async () => {
  try {
    await signOut(auth);
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
  } catch (error) {
    console.error("Log Out Error:", error);
  }
};

async function showDashboard(user) {
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById("balance").innerText = userData.balance;
      document.getElementById("earnings").innerText = userData.earnings;
    } else {
      console.error("User document not found!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    showDashboard(user);
  } else {
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
  }
});

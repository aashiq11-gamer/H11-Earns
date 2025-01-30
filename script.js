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
      showAdminDashboard(user); // Load admin dashboard
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
      showAdminDashboard(userCredential.user); // Load admin dashboard
    } else {
      // Give signup bonus of 25 PKR
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        balance: 25,
        earnings: 0,
        deposit: 0,
        adViews: 0 // Initialize adViews
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
      showAdminDashboard(userCredential.user); // Load admin dashboard
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

// Show Admin Dashboard
const showAdminDashboard = (user) => {
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";

  document.getElementById("balance").innerText = "Admin: Unlimited Access";
  document.getElementById("earnings").innerText = "Admin: Unlimited Access";
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

    if (user.email === 'admin@example.com') {
      alert('Admin cannot withdraw.');
    } else {
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
  }
};

// Deposit Function
window.deposit = async (amount) => {
  const user = auth.currentUser;
  if (user && amount >= 100) {
    const q = query(collection(db, 'users'), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let docId = '';
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });

    await updateDoc(doc(db, 'users', docId), {
      deposit: amount,
      balance: firebase.firestore.FieldValue.increment(amount)
    });
    alert('Deposit successful');
    showDashboard(user);
  } else {
    alert('Minimum deposit amount is 100 PKR');
  }
};

// Add Ad View Earnings Logic
window.viewAd = async () => {
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

    if (user.email === 'admin@example.com') {
      alert('Admin: Ad viewed. Earnings updated.');
    } else {
      if (userData.adViews < 5) {
        // Update earnings and ad views count
        await updateDoc(doc(db, 'users', docId), {
          earnings: userData.earnings + 0.50,
          adViews: (userData.adViews || 0) + 1
        });
        alert('Ad viewed. Earnings updated.');
        showDashboard(user);
      } else {
        alert('Maximum ad views reached for today.');
      }
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
    balance: firebase.firestore.FieldValue.increment(amount)
  });
  console.log(`Added ${amount} PKR bonus to user ${userId}`);
};

// Firebase Function to add daily profit
export const dailyProfit = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const snapshot = await getDocs(collection(db, 'users'));
  snapshot.forEach(async (doc) => {
    const user = doc.data();
    const profit = user.balance * 0.07; // Daily 7% profit
    await updateDoc(doc.ref, {
      balance: firebase.firestore.FieldValue.increment(profit)
    });
  });
});

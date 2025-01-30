import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, increment } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';  // Import increment
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is signed in:", user);
        const userDoc = await getUserData(user.uid); // Helper function (explained below)

        if (userDoc && userDoc.email === 'admin@example.com') {
            showAdminDashboard(user);
        } else if (userDoc) {  // Make sure userDoc exists!
            showDashboard(user, userDoc); // Pass user data to showDashboard
        } else {
            console.error("User data not found!");
            await signOut(auth); // Sign the user out to avoid issues
            // Redirect to an error page or display an error message.
        }
    } else {
        console.log("User is signed out");
        hideDashboardAndShowAuth(); // Helper function
    }
});

// Helper function to get user data
async function getUserData(uid) {
    try {
        const userRef = doc(db, 'users', uid); // Use uid directly
        const userSnap = await getDoc(userRef);
        return userSnap.data();
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; // Return null if there's an error
    }
}


// Helper function to show/hide elements
function showDashboard(user, userData) {
    document.getElementById("auth-form").style.display = "none";
    document.getElementById("user-dashboard").style.display = "block";

    document.getElementById("balance").innerText = userData.balance;  // Use userData
    document.getElementById("earnings").innerText = userData.earnings; // Use userData
    // ... other dashboard updates
}

function hideDashboardAndShowAuth() {
    document.getElementById("user-dashboard").style.display = "none";
    document.getElementById("auth-form").style.display = "block";
}


// ... (signUp, logIn, logOut functions - these are mostly fine)

// Deposit Function (Improved)
window.deposit = async (amount) => {
    const user = auth.currentUser;
    if (user && amount >= 100) {
      try {
        const userRef = doc(db, 'users', user.uid); // Use uid directly
        await updateDoc(userRef, {
          deposit: amount,
          balance: increment(amount) // Use increment for atomic updates
        });
        alert('Deposit successful');
        const updatedUserData = await getUserData(user.uid); // Refresh user data
        showDashboard(user, updatedUserData); // Update the dashboard
      } catch (error) {
        console.error("Error depositing:", error);
        alert("Deposit failed. Please check the console for errors.");
      }
    } else {
      alert('Minimum deposit amount is 100 PKR');
    }
  };

// ... (withdraw, viewAd functions - these are mostly fine)

// Add bonus to user account (Improved)
const addBonus = async (userId, amount) => {
  try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { balance: increment(amount) });
      console.log(`Added ${amount} PKR bonus to user ${userId}`);
  } catch (error) {
      console.error("Error adding bonus:", error);
  }
};


// ... (dailyProfit cloud function - this is separate and usually goes in a functions/index.js file)

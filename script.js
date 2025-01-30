import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const db = getFirestore(app);  // Firestore initialization
const userDocRef = doc(db, 'users', user.uid);  // User document reference

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);  // Debugging: Check user uid
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.error("User document not found!");  // Debugging: Error when document doesn't exist

      try {
        await setDoc(userDocRef, {
          name: user.displayName || "User Name",  // Setting default values
          email: user.email,
        });
        console.log("User document successfully created!");
      } catch (error) {
        console.error("Error creating document:", error);
      }
    } else {
      console.log("User document fetched:", docSnap.data());
      showDashboard(user);  // Show the user's dashboard
    }
  } else {
    console.log("No user is logged in.");
  }
});

import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Firestore reference
const userDocRef = doc(db, 'users', user.uid);  // 'users' collection mein user document reference

// Document ko fetch karte hain
const docSnap = await getDoc(userDocRef);

if (!docSnap.exists()) {
  console.error("User document not found!");  // Agar document nahi milta

  // Document create kar rahe hain agar missing ho
  try {
    await setDoc(userDocRef, {
      name: user.displayName || "User Name",  // Agar displayName available ho toh use karein
      email: user.email,  // User ka email
      // Aap aur fields bhi add kar sakte hain jaise balance, registration date, etc.
    });
    console.log("User document successfully created!");  // Document create hone ke baad
  } catch (error) {
    console.error("Error creating document:", error);  // Agar document create karte waqt koi error aaye
  }
} else {
  // Agar document mil gaya, toh usse process karein
  console.log("User document fetched successfully:", docSnap.data());
  showDashboard(user);  // User ka dashboard show karte hain
}

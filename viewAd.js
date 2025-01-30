import { getFirestore, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function viewAd(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (userData.adViews < 5) {
      await updateDoc(userRef, {
        earnings: userData.earnings + 0.50,
        adViews: (userData.adViews || 0) + 1
      });
      alert('Ad viewed. Earnings updated.');
       const userDoc = await getDoc(userRef);
       const userData = userDoc.data();
       document.getElementById("earnings").innerText = userData.earnings;
    } else {
      alert('Maximum ad views reached for today.');
    }
  } catch (error) {
    console.error('Error viewing ad:', error);
    alert('Error updating earnings.');
  }
}

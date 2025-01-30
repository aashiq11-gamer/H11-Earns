import { getFirestore, doc, increment, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function deposit(userId) {
  const amount = parseFloat(prompt('Enter deposit amount:'));

  if (isNaN(amount) || amount < 100) {
    alert('Invalid deposit amount. Minimum is 100.');
    return;
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { balance: increment(amount), deposit: amount });
    alert('Deposit successful.');
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    document.getElementById("balance").innerText = userData.balance;
  } catch (error) {
    console.error('Error depositing:', error);
    alert('Deposit failed.');
  }
}

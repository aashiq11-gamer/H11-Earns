import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fetchRequests = async () => {
  // Fetch deposit requests
  const depositRequests = [];
  const q1 = query(collection(db, 'users'), where("depositRequest", "==", true));
  const depositQuerySnapshot = await getDocs(q1);
  depositQuerySnapshot.forEach((doc) => {
    depositRequests.push({ id: doc.id, ...doc.data() });
  });

  // Fetch withdrawal requests
  const withdrawalRequests = [];
  const q2 = query(collection(db, 'users'), where("withdrawalRequest", "==", true));
  const withdrawalQuerySnapshot = await getDocs(q2);
  withdrawalQuerySnapshot.forEach((doc) => {
    withdrawalRequests.push({ id: doc.id, ...doc.data() });
  });

  renderRequests(depositRequests, withdrawalRequests);
};

const renderRequests = (depositRequests, withdrawalRequests) => {
  // Render deposit requests
  const depositList = document.getElementById('deposit-requests');
  depositList.innerHTML = '';
  depositRequests.forEach((request) => {
    const li = document.createElement('li');
    li.innerText = `User: ${request.uid}, Amount: ${request.deposit}`;
    depositList.appendChild(li);
  });

  // Render withdrawal requests
  const withdrawalList = document.getElementById('withdrawal-requests');
  withdrawalList.innerHTML = '';
  withdrawalRequests.forEach((request) => {
    const li = document.createElement('li');
    li.innerText = `User: ${request.uid}, Amount: 25`;
    withdrawalList.appendChild(li);
  });
};

window.addEventListener('load', fetchRequests);

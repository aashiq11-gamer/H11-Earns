import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js'; // یا وہ فائل جہاں آپ کی Firebase configuration ہے۔

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchRequests() {
    const depositRequests = [];
    const withdrawalRequests = [];

    const depositsQuery = query(collection(db, 'users'), where('depositRequest', '==', true));
    const withdrawalsQuery = query(collection(db, 'users'), where('withdrawalRequest', '==', true));

    const getRequests = async (querySnapshot, requests) => {
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        requests.push({ id: doc.id, data });
      }
    };

    const depositsSnapshot = await getDocs(depositsQuery);
    await getRequests(depositsSnapshot, depositRequests);

    const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
    await getRequests(withdrawalsSnapshot, withdrawalRequests);

    displayRequests(depositRequests, withdrawalRequests);
}

function displayRequests(depositRequests, withdrawalRequests) {
    const display = (requests, tableId, approveFunction) => {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous requests

        requests.forEach(request => {
            const row = tbody.insertRow();
            row.insertCell().textContent = request.data.uid;
            row.insertCell().textContent = request.data.deposit || 25; // Show deposit or fixed withdrawal amount

            const actionsCell = row.insertCell();
            const approveButton = document.createElement('button');
            approveButton.textContent = 'Approve';
            approveButton.addEventListener('click', () => approveFunction(request.id, request.data));
            actionsCell.appendChild(approveButton);

        });
    };

    display(depositRequests, 'deposit-requests', approveDeposit);
    display(withdrawalRequests, 'withdrawal-requests', approveWithdrawal);
}

async function approveDeposit(userId, userData) {
    try {
      await updateDoc(doc(db, "users", userId), {
        depositRequest: false,
        balance: userData.balance + userData.deposit
      });
      alert("Deposit Approved");
      fetchRequests();
    } catch (error) {
      console.error("Error approving deposit:", error);
      alert("Error approving deposit. Check the console for details.");
    }
}

async function approveWithdrawal(userId) {
    try {
      await updateDoc(doc(db, "users", userId), {
        withdrawalRequest: false,
      });
      alert("Withdrawal Approved");
      fetchRequests();
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert("Error approving withdrawal. Check the console for details.");
    }
}


// یوزرز کی فہرست دکھانے کا فنکشن
async function displayUsers() {
    const usersTable = document.getElementById('users-table').querySelector('tbody');
    usersTable.innerHTML = '';

    const usersQuery = collection(db, 'users');

    onSnapshot(usersQuery, (querySnapshot) => {
      usersTable.innerHTML = ''; // Clear existing rows before updating
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = usersTable.insertRow();
        row.insertCell().textContent = userData.uid;
        row.insertCell().textContent = userData.balance;

        const actionsCell = row.insertCell();
        const adjustBalanceButton = document.createElement('button');
        adjustBalanceButton.textContent = 'Adjust Balance';
        adjustBalanceButton.addEventListener('click', () => {
            const newBalance = prompt("Enter the new balance:", userData.balance);
            if (newBalance !== null) {
                adjustUserBalance(doc.id, parseFloat(newBalance));
            }
        });
        actionsCell.appendChild(adjustBalanceButton);
      });
    });
}

async function adjustUserBalance(userId, newBalance) {
    try {
      await updateDoc(doc(db, "users", userId), {
        balance: newBalance
      });
      alert("Balance updated successfully!");
    } catch (error) {
      console.error("Error adjusting balance:", error);
      alert("Error adjusting balance. Please check the console for details.");
    }
}

window.addEventListener('load', () => {
  fetchRequests();
  displayUsers();
});

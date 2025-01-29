// Firebase Initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// UI Elements
const googleSignInBtn = document.getElementById('google-sign-in');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');
const approveDepositBtn = document.getElementById('approve-deposit');

// Sign In with Google
googleSignInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        console.log('User signed in:', result.user);
        checkUserStatus(result.user.uid);
    }).catch(error => {
        console.error(error);
    });
});

// Check if user is Admin or Regular
function checkUserStatus(userID) {
    const userRef = db.ref('users/' + userID);
    userRef.once('value').then(snapshot => {
        const userData = snapshot.val();
        if (userData && userData.isAdmin) {
            // Show Admin Actions
            document.getElementById('admin-actions').style.display = 'block';
        } else {
            // Show User Actions
            document.getElementById('game-actions').style.display = 'block';
        }
        document.getElementById('auth-container').style.display = 'none';
    });
}

// Deposit Function
depositBtn.addEventListener('click', () => {
    const userID = auth.currentUser.uid;
    const depositAmount = 100; // example amount
    const depositRef = db.ref('depositRequests').push();
    depositRef.set({
        userID: userID,
        amount: depositAmount,
        status: 'pending'
    }).then(() => {
        alert('Deposit request sent!');
    });
});

// Withdraw Function
withdrawBtn.addEventListener('click', () => {
    const userID = auth.currentUser.uid;
    const withdrawAmount = 50; // example amount
    const withdrawRef = db.ref('withdrawRequests').push();
    withdrawRef.set({
        userID: userID,
        amount: withdrawAmount,
        status: 'pending',
        date: new Date().toISOString()
    }).then(() => {
        alert('Withdraw request sent!');
    });
});

// Approve Deposit Function (Admin only)
approveDepositBtn.addEventListener('click', () => {
    const depositRequestID = 'requestID1'; // example ID
    const depositRef = db.ref('depositRequests/' + depositRequestID);
    depositRef.update({ status: 'approved' }).then(() => {
        const requestData = depositRef.val();
        const userID = requestData.userID;
        const depositAmount = requestData.amount;
        
        // Update user balance
        const userRef = db.ref('users/' + userID);
        userRef.once('value').then(userSnapshot => {
            const userData = userSnapshot.val();
            const newBalance = userData.balance + depositAmount;
            userRef.update({ balance: newBalance });

            // Log Transaction (Deposit)
            const transactionRef = db.ref('transactions').push();
            transactionRef.set({
                userID: userID,
                type: 'deposit',
                amount: depositAmount,
                status: 'approved',
                date: new Date().toISOString()
            });

            alert('Deposit approved!');
        });
    });
});

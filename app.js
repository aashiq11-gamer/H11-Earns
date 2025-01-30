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
            document.getElementById('admin-actions').style.display = 'block';
        } else {
            document.getElementById('game-actions').style.display = 'block';
        }
        document.getElementById('auth-container').style.display = 'none';
    });
}

// Deposit Function
depositBtn.addEventListener('click', () => {
    if (!auth.currentUser) {
        alert("Please sign in first.");
        return;
    }
    const userID = auth.currentUser.uid;
    const depositAmount = 100;
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
    if (!auth.currentUser) {
        alert("Please sign in first.");
        return;
    }
    const userID = auth.currentUser.uid;
    const withdrawAmount = 50;
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
    const depositRequestID = prompt("Enter Deposit Request ID:");
    if (!depositRequestID) return;

    const depositRef = db.ref('depositRequests/' + depositRequestID);
    depositRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            alert("Invalid Deposit Request ID");
            return;
        }
        
        const requestData = snapshot.val();
        const userID = requestData.userID;
        const depositAmount = requestData.amount;

        depositRef.update({ status: 'approved' }).then(() => {
            const userRef = db.ref('users/' + userID);
            userRef.once('value').then(userSnapshot => {
                const userData = userSnapshot.val();
                const newBalance = (userData?.balance || 0) + depositAmount;
                userRef.update({ balance: newBalance });

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
});
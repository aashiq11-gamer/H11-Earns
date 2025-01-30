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
      balance: amount // Update the balance with the deposit amount
    });
    alert('Deposit successful');
    showDashboard(user);
  } else {
    alert('Minimum deposit amount is 100 PKR');
  }
};

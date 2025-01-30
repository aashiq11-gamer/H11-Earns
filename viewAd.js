window.viewAd = async () => {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, 'users'), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let userData = {};
    let docId = '';
    querySnapshot.forEach((doc) => {
      userData = doc.data();
      docId = doc.id;
    });

    if (userData.adViews < 5) {
      // Update earnings and ad views count
      await updateDoc(doc(db, 'users', docId), {
        earnings: userData.earnings + 0.50,
        adViews: (userData.adViews || 0) + 1
      });
      alert('Ad viewed. Earnings updated.');
      showDashboard(user);
    } else {
      alert('Maximum ad views reached for today.');
    }
  }
};

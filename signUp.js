window.signUp = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);

    // سائن اپ بونس 25 PKR دیں۔
    await addDoc(collection(db, 'users'), {
      uid: userCredential.user.uid,
      balance: 25,
      earnings: 0,
      deposit: 0,
      adViews: 0, // اشتہارات دیکھنے کی تعداد شروع کریں۔
      referrer: "" // ریفر کرنے والے کا یوزر آئی ڈی
    });

    showDashboard(userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
};
